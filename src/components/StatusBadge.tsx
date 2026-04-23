import type { LoanStatus } from '../types'

const LABELS: Record<LoanStatus, string> = {
  HEALTHY:    'Healthy',
  WARNING:    'Warning',
  CRITICAL:   'Critical',
  LIQUIDATED: 'Liquidated',
}

export function StatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span className={`status-badge status-badge--${status.toLowerCase()}`}>
      {LABELS[status]}
    </span>
  )
}
