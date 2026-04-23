export function GlossaryBanner() {
  return (
    <div className="glossary-banner">
      <div className="glossary-banner__item">
        <span className="glossary-banner__term">LTV</span>
        <span className="glossary-banner__sep">—</span>
        <span className="glossary-banner__def">
          <strong>Loan-to-Value</strong>: ratio of the loan amount to the BTC collateral value — the higher the LTV, the closer to a margin call.
        </span>
      </div>
      <div className="glossary-banner__divider" />
      <div className="glossary-banner__item">
        <span className="glossary-banner__term">CHI</span>
        <span className="glossary-banner__sep">—</span>
        <span className="glossary-banner__def">
          <strong>Collateral Health Indicator</strong>: collateral health score from 0 to 100 % — 100 % is a fully safe loan, 0 % means liquidation.
        </span>
      </div>
    </div>
  )
}
