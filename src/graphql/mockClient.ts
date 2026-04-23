import { ApolloClient, InMemoryCache, ApolloLink, Observable } from '@apollo/client'
import { buildSchema, graphql, print, GraphQLSchema, type ExecutionResult } from 'graphql'

const typeDefs = `
  type Loan {
    id: ID!
    borrower: String!
    collateralBtc: Float!
    loanValueUsd: Float!
    ltv: Float!
    chi: Float!
    status: LoanStatus!
    createdAt: String!
  }

  type BtcPrice {
    usd: Float!
    updatedAt: String!
  }

  enum LoanStatus {
    HEALTHY
    WARNING
    CRITICAL
    LIQUIDATED
  }

  type Query {
    loans: [Loan!]!
    loan(id: ID!): Loan
    btcPrice: BtcPrice!
  }

  type Mutation {
    requestLiquidation(id: ID!): Loan
  }
`

// Shared variable updated by the background Binance poller.
// GraphQL resolvers read this value on every query — no need for a separate price endpoint.
let currentBtcPrice = 0

async function fetchBtcPrice() {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
    const json = await res.json() as { price: string }
    currentBtcPrice = parseFloat(json.price)
  } catch {
    // keep last known price on failure
  }
}

fetchBtcPrice()

const liquidatedIds = new Set<string>()

const seedLoans = [
  { id: '1', borrower: 'alice.btc', collateralBtc: 0.50, loanValueUsd: 22_000 },
  { id: '2', borrower: 'bob.btc',   collateralBtc: 1.15, loanValueUsd: 68_500 },
  { id: '3', borrower: 'carol.btc', collateralBtc: 0.25, loanValueUsd: 17_100 },
  { id: '4', borrower: 'dave.btc',  collateralBtc: 3.00, loanValueUsd: 95_000 },
  { id: '5', borrower: 'eve.btc',   collateralBtc: 0.80, loanValueUsd: 68_500 },
]

export function calculateCHI(ltv: number): number {
  const LTV_SAFE = 0.50
  const LTV_LIQ  = 0.95
  if (ltv <= LTV_SAFE) return 100
  if (ltv >= LTV_LIQ)  return 0
  const health = 100 * ((1 / ltv) - (1 / LTV_LIQ)) / ((1 / LTV_SAFE) - (1 / LTV_LIQ))
  return Math.round(health)
}

export function ltvStatus(id: string, ltv: number): string {
  // liquidatedIds catches manually liquidated loans whose LTV is still below 95%
  if (liquidatedIds.has(id) || ltv >= 95) return 'LIQUIDATED'
  if (ltv >= 86) return 'CRITICAL'
  if (ltv >= 73) return 'WARNING'
  return 'HEALTHY'
}

function buildLoans(btcPrice: number) {
  return seedLoans.map(l => {
    const collateralUsd = l.collateralBtc * btcPrice
    const ltv = (l.loanValueUsd / collateralUsd) * 100
    const ltvRounded = Math.round(ltv * 10) / 10 // rounding to one decimal place
    const chi = calculateCHI(ltv / 100)
    return {
      ...l,
      ltv: ltvRounded,
      chi,
      status: ltvStatus(l.id, ltv),
      createdAt: '2025-03-15T10:00:00Z',
    }
  })
}

const schema: GraphQLSchema = buildSchema(typeDefs)

const rootValue = {
  loans: () => currentBtcPrice === 0 ? [] : buildLoans(currentBtcPrice),
  loan: ({ id }: { id: string }) => buildLoans(currentBtcPrice).find(l => l.id === id) ?? null,
  btcPrice: () => ({ usd: currentBtcPrice, updatedAt: new Date().toISOString() }),
  requestLiquidation: ({ id }: { id: string }) => {
    liquidatedIds.add(id)
    return buildLoans(currentBtcPrice).find(l => l.id === id) ?? null
  },
}

// Refresh price every 5 minutes — Binance public API allows ~1 200 req/min,
// so a single background poller is well within the rate limit.
setInterval(fetchBtcPrice, 300_000)

// In-process GraphQL executor — replaces a real HTTP backend for the demo.
// Apollo Client sends every query/mutation here; we resolve it locally using
// the schema and rootValue above, then push the result back into the Observable
// so Apollo treats it exactly like a network response.
const mockLink = new ApolloLink((operation) => {
  return new Observable<ExecutionResult>((observer) => {
    const { query, variables } = operation
    graphql({ schema, source: print(query), rootValue, variableValues: variables })
      .then(result => {
        observer.next(result)
        observer.complete()
      })
      .catch((err: unknown) => observer.error(err))
  })
})

export const apolloClient = new ApolloClient({
  link: mockLink,
  cache: new InMemoryCache(),
})
