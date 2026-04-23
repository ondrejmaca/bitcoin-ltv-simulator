export type LoanStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'LIQUIDATED'

export interface Loan {
  id: string
  borrower: string
  collateralBtc: number
  loanValueUsd: number
  ltv: number
  chi: number
  status: LoanStatus
  createdAt: string
}

export interface BtcPrice {
  usd: number
  updatedAt: string
}

export interface LoansQueryResult {
  loans: Loan[]
  btcPrice: BtcPrice
}
