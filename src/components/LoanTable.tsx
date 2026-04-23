import { useState } from 'react'
import type { Loan } from '../types'
import { LtvBar } from './LtvBar'
import { StatusBadge } from './StatusBadge'
import { LoanDetail } from './LoanDetail'

// Thresholds derived from CHI at LTV 86% (≈12) and LTV 73% (≈33)
function chiColor(chi: number) {
  if (chi <= 0)  return '#a855f7'
  if (chi < 12)  return 'var(--critical)'
  if (chi < 33)  return 'var(--warning)'
  return 'var(--healthy)'
}

interface Props {
  loans: Loan[]
  btcPrice: number
}

export function LoanTable({ loans, btcPrice }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <div className="loan-table">
        <table>
          <thead>
            <tr>
              <th className="loan-table__th">Borrower</th>
              <th className="loan-table__th loan-table__th--right">Collateral (BTC)</th>
              <th className="loan-table__th loan-table__th--right">Collateral (USD)</th>
              <th className="loan-table__th loan-table__th--right">Loan (USD)</th>
              <th className="loan-table__th">LTV</th>
              <th className="loan-table__th loan-table__th--right">CHI</th>
              <th className="loan-table__th">Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan.id} className="loan-table__row" onClick={() => setSelectedId(loan.id)}>
                <td className="loan-table__td">
                  <span className="loan-table__borrower">{loan.borrower}</span>
                </td>
                <td className="loan-table__td loan-table__td--right">₿ {loan.collateralBtc.toFixed(4)}</td>
                <td className="loan-table__td loan-table__td--muted">
                  ${(loan.collateralBtc * btcPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </td>
                <td className="loan-table__td loan-table__td--right">${loan.loanValueUsd.toLocaleString('en-US')}</td>
                <td className="loan-table__td loan-table__td--wide"><LtvBar ltv={loan.ltv} /></td>
                <td className="loan-table__td loan-table__td--right loan-table__chi" style={{ color: chiColor(loan.chi) }}>{loan.chi.toFixed(1)} %</td>
                <td className="loan-table__td"><StatusBadge status={loan.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <LoanDetail
          loanId={selectedId}
          btcPrice={btcPrice}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}
