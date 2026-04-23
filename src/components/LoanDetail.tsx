import { useQuery, useMutation } from '@apollo/client'
import type { Loan } from '../types'
import { GET_LOAN, REQUEST_LIQUIDATION, GET_LOANS } from '../graphql/schema'
import { StatusBadge } from './StatusBadge'
import { LtvBar } from './LtvBar'

interface Props {
  loanId: string
  btcPrice: number
  onClose: () => void
}

interface GetLoanResult { loan: Loan }
interface RequestLiquidationResult { requestLiquidation: Loan }

export function LoanDetail({ loanId, btcPrice, onClose }: Props) {
  const { data, loading } = useQuery<GetLoanResult>(GET_LOAN, {
    variables: { id: loanId },
    pollInterval: 3000,
  })

  const [requestLiquidation, { loading: mutating }] = useMutation<RequestLiquidationResult>(
    REQUEST_LIQUIDATION,
    {
      variables: { id: loanId },
      refetchQueries: [GET_LOANS],
    }
  )

  const loan = data?.loan

  return (
    <div className="loan-detail" onClick={onClose}>
      <div className="loan-detail__panel" onClick={e => e.stopPropagation()}>
        <div className="loan-detail__header">
          <h2 className="loan-detail__title">Loan Detail</h2>
          <button className="loan-detail__close" onClick={onClose}>✕</button>
        </div>

        {loading && <p className="loan-detail__loading">Loading…</p>}

        {loan && (
          <>
            <div className="loan-detail__fields">
              <Row label="Borrower" value={<span className="loan-detail__borrower">{loan.borrower}</span>} />
              <Row label="Status"   value={<StatusBadge status={loan.status} />} />
              <Row label="CHI" value={
                <span style={{ color: loan.chi <= 0 ? 'var(--critical)' : loan.chi <= 25 ? 'var(--warning)' : 'var(--healthy)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {loan.chi.toFixed(1)} %
                </span>
              } />
              <Row label="Collateral" value={`₿ ${loan.collateralBtc.toFixed(4)}`} />
              <Row
                label="Collateral (USD)"
                value={`$${(loan.collateralBtc * btcPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              />
              <Row label="Loan Value" value={`$${loan.loanValueUsd.toLocaleString('en-US')}`} />
              <div>
                <span className="loan-detail__ltv-label">LTV</span>
                <LtvBar ltv={loan.ltv} />
              </div>
              <Row label="Opened" value={new Date(loan.createdAt).toLocaleDateString()} />
            </div>

            {loan.status === 'CRITICAL' && (
              <button
                className="loan-detail__liquidate-btn"
                onClick={() => requestLiquidation()}
                disabled={mutating}
              >
                {mutating ? 'Processing…' : 'Request Liquidation'}
              </button>
            )}

            {loan.status === 'LIQUIDATED' && (
              <div className="loan-detail__liquidated-note">Liquidation requested</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="loan-detail__row">
      <span className="loan-detail__row-label">{label}</span>
      <span className="loan-detail__row-value">{value}</span>
    </div>
  )
}
