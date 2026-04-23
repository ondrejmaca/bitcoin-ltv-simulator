export function LtvBar({ ltv }: { ltv: number }) {
  const clamped = Math.min(ltv, 100)
  const color =
    ltv >= 95 ? '#a855f7' :
    ltv >= 86 ? 'var(--critical)' :
    ltv >= 73 ? 'var(--warning)' :
               'var(--healthy)'

  return (
    <div className="ltv-bar">
      <div className="ltv-bar__track">
        <div className="ltv-bar__fill" style={{ width: `${clamped}%`, background: color }} />
      </div>
      <span className="ltv-bar__label" style={{ color }}>{ltv.toFixed(1)}%</span>
    </div>
  )
}
