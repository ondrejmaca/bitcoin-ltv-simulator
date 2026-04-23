interface Props {
  width?: string
  height?: string
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = '1rem', style }: Props) {
  return <div className="skeleton" style={{ width, height, ...style }} />
}

export function SummaryCardsSkeleton() {
  return (
    <div className="skeleton-cards">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <Skeleton width="5rem"   height="0.75rem" />
          <Skeleton width="6.25rem" height="1.75rem" />
          <Skeleton width="3.75rem" height="0.6875rem" />
        </div>
      ))}
    </div>
  )
}

export function ChartRowSkeleton() {
  return (
    <div className="skeleton-chart-row">
      <div className="skeleton-chart-card">
        <Skeleton width="8.75rem" height="0.875rem" />
        <Skeleton width="100%" height="11.25rem" style={{ borderRadius: '0.5rem' }} />
      </div>
      <div className="skeleton-chart-card">
        <Skeleton width="7.5rem" height="0.875rem" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-legend-row">
            <Skeleton width="0.625rem" height="0.625rem" style={{ borderRadius: '50%', flexShrink: 0, marginTop: '0.1875rem' }} />
            <div className="skeleton-legend-text">
              <Skeleton width="10rem" height="0.75rem" />
              <Skeleton width="12.5rem" height="0.6875rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GlossaryBannerSkeleton() {
  return (
    <div className="glossary-banner">
      <div className="glossary-banner__item">
        <Skeleton width="1.75rem" height="0.75rem" style={{ flexShrink: 0 }} />
        <Skeleton width="20rem" height="0.8125rem" />
      </div>
      <div className="glossary-banner__divider" />
      <div className="glossary-banner__item">
        <Skeleton width="1.75rem" height="0.75rem" style={{ flexShrink: 0 }} />
        <Skeleton width="18.75rem" height="0.8125rem" />
      </div>
    </div>
  )
}

export function LoanTableSkeleton() {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table__header">
        {['5rem', '7.5rem', '7.5rem', '6.25rem', '10rem', '4.375rem'].map((w, i) => (
          <Skeleton key={i} width={w} height="0.6875rem" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton-table__row">
          <Skeleton width="6.25rem" height="0.875rem" />
          <Skeleton width="5rem"    height="0.875rem" />
          <Skeleton width="5.625rem" height="0.875rem" />
          <Skeleton width="5rem"    height="0.875rem" />
          <Skeleton width="10rem"   height="0.625rem" style={{ borderRadius: '0.25rem' }} />
          <Skeleton width="4.375rem" height="1.375rem" style={{ borderRadius: '1.25rem' }} />
        </div>
      ))}
    </div>
  )
}
