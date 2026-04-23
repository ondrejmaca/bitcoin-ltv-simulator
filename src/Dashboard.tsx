import { useQuery } from '@apollo/client'
import { GET_LOANS } from './graphql/schema'
import type { LoansQueryResult } from './types'
import { BtcPriceTicker } from './components/BtcPriceTicker'
import { SummaryCards } from './components/SummaryCards'
import { LoanTable } from './components/LoanTable'
import { LtvThresholdChart } from './components/LtvThresholdChart'
import { GlossaryBanner } from './components/GlossaryBanner'
import { SummaryCardsSkeleton, ChartRowSkeleton, GlossaryBannerSkeleton, LoanTableSkeleton } from './components/Skeleton'

const POLL_INTERVAL = 3000

const LEGEND = [
  { color: '#22c55e', label: 'Healthy',    range: 'LTV < 73%',        desc: 'CHI > 33 % — collateral well above margin call' },
  { color: '#f59e0b', label: 'Warning',    range: '73% ≤ LTV < 86%',  desc: 'Margin call 1–2 — consider adding collateral' },
  { color: '#ef4444', label: 'Critical',   range: '86% ≤ LTV < 95%',  desc: 'Margin call 3 — high liquidation risk' },
  { color: '#a855f7', label: 'Liquidated', range: 'LTV ≥ 95%',        desc: 'CHI = 0 % — collateral automatically liquidated' },
]

export function Dashboard() {
  const { data, loading, error } = useQuery<LoansQueryResult>(GET_LOANS, {
    pollInterval: POLL_INTERVAL,
  })

  if (error) return (
    <div className="dashboard__error">Error: {error.message}</div>
  )

  const isLoading = loading || !data || data.btcPrice.usd === 0

  return (
    <div className="dashboard">
      <div className="dashboard__top-bar">
        <div>
          <h1 className="dashboard__title">Loan Health Monitor</h1>
          <p className="dashboard__subtitle">Live collateral & LTV tracking · BTC price via Binance</p>
        </div>
        <div className="dashboard__top-bar-right">
          {data && (
            <div className="dashboard__total-loans">
              <span className="dashboard__total-loans-label">Total Loans</span>
              <span className="dashboard__total-loans-value">
                ${(data.loans.reduce((s, l) => s + l.loanValueUsd, 0) / 1_000_000).toFixed(2)}M
              </span>
            </div>
          )}
          {data && <BtcPriceTicker btcPrice={data.btcPrice} />}
        </div>
      </div>

      {isLoading ? (
        <>
          <SummaryCardsSkeleton />
          <ChartRowSkeleton />
          <GlossaryBannerSkeleton />
          <LoanTableSkeleton />
        </>
      ) : (
        <>
          <SummaryCards loans={data.loans} />

          <div className="dashboard__chart-row">
            <LtvThresholdChart loans={data.loans} />
            <div className="dashboard__legend">
              <h3 className="dashboard__legend-title">Threshold Legend</h3>
              {LEGEND.map(({ color, label, range, desc }) => (
                <div key={label} className="dashboard__legend-item">
                  <div className="dashboard__legend-dot" style={{ background: color }} />
                  <div>
                    <div className="dashboard__legend-label">
                      {label} <span className="dashboard__legend-range">· {range}</span>
                    </div>
                    <div className="dashboard__legend-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GlossaryBanner />
          <LoanTable loans={data.loans} btcPrice={data.btcPrice.usd} />
        </>
      )}

      <p className="dashboard__footer">
        Loan data is mock · BTC price is live via Binance (refreshes every 5 min)
      </p>
    </div>
  )
}
