import { gql } from '@apollo/client'

export const LOAN_FIELDS = gql`
  fragment LoanFields on Loan {
    id
    borrower
    collateralBtc
    loanValueUsd
    ltv
    chi
    status
    createdAt
  }
`

export const GET_LOANS = gql`
  query GetLoans {
    loans {
      ...LoanFields
    }
    btcPrice {
      usd
      updatedAt
    }
  }
  ${LOAN_FIELDS}
`

export const GET_LOAN = gql`
  query GetLoan($id: ID!) {
    loan(id: $id) {
      ...LoanFields
    }
  }
  ${LOAN_FIELDS}
`

export const REQUEST_LIQUIDATION = gql`
  mutation RequestLiquidation($id: ID!) {
    requestLiquidation(id: $id) {
      ...LoanFields
    }
  }
  ${LOAN_FIELDS}
`
