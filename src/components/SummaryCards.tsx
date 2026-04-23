import type { Loan } from '../types'
import { AlertTriangle, CheckCircle, XCircle, Skull } from 'lucide-react'

interface CardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
}

function Card({ label, value, icon, color }: CardProps) {
  return (
    <div className="summary-card" style={{ borderColor: `${color}33` }}>
      <div style={{ color, opacity: 0.9 }}>{icon}</div>
      <div>
        <div className="summary-card__label">{label}</div>
        <div className="summary-card__value">{value}</div>
      </div>
    </div>
  )
}

export function SummaryCards({ loans }: { loans: Loan[] }) {
  const healthy    = loans.filter(l => l.status === 'HEALTHY').length
  const warning    = loans.filter(l => l.status === 'WARNING').length
  const critical   = loans.filter(l => l.status === 'CRITICAL').length
  const liquidated = loans.filter(l => l.status === 'LIQUIDATED').length
  return (
    <div className="summary-cards">
      <Card label="Healthy"     value={healthy}    icon={<CheckCircle   size={24} />} color="#22c55e" />
      <Card label="Warning"     value={warning}    icon={<AlertTriangle size={24} />} color="#f59e0b" />
      <Card label="Critical"    value={critical}   icon={<XCircle       size={24} />} color="#ef4444" />
      <Card label="Liquidated"  value={liquidated} icon={<Skull         size={24} />} color="#a855f7" />
    </div>
  )
}
