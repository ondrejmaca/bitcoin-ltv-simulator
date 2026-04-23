import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell, ResponsiveContainer } from 'recharts'
import type { Loan } from '../types'

export function LtvThresholdChart({ loans }: { loans: Loan[] }) {
  const data = loans.map(l => ({ name: l.borrower.replace('.btc', ''), ltv: l.ltv }))

  return (
    <div className="ltv-chart">
      <h3 className="ltv-chart__title">LTV per Borrower</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} unit="%" />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#e2e8f0' }}
            formatter={(v: number) => [`${v.toFixed(1)}%`, 'LTV']}
            cursor={{ fill: 'rgba(255,255,255,0.10)' }}
          />
          <ReferenceLine y={73} stroke="var(--warning)"  strokeDasharray="4 4" />
          <ReferenceLine y={79} stroke="var(--warning)"  strokeDasharray="4 4" />
          <ReferenceLine y={86} stroke="var(--critical)" strokeDasharray="4 4" />
          <ReferenceLine y={95} stroke="#a855f7"         strokeDasharray="4 4" />
          <Bar dataKey="ltv" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.ltv >= 95 ? '#a855f7' : entry.ltv >= 86 ? 'var(--critical)' : entry.ltv >= 73 ? 'var(--warning)' : 'var(--healthy)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
