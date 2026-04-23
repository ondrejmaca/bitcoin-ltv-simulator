import { useEffect, useRef, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { BtcPrice } from '../types'

interface Props {
  btcPrice: BtcPrice
}

export function BtcPriceTicker({ btcPrice }: Props) {
  const prevPrice = useRef(btcPrice.usd)
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    if (btcPrice.usd !== 0 && btcPrice.usd !== prevPrice.current) {
      setDirection(btcPrice.usd > prevPrice.current ? 'up' : 'down')
      prevPrice.current = btcPrice.usd
    }
  }, [btcPrice.usd])

  if (btcPrice.usd === 0) {
    return (
      <div className="btc-ticker">
        <span className="btc-ticker__label">BTC/USD</span>
        <span className="btc-ticker__price btc-ticker__price--loading">—</span>
      </div>
    )
  }

  const priceColor = direction === 'up' ? 'var(--healthy)' : direction === 'down' ? 'var(--critical)' : 'var(--warning)'

  return (
    <div className="btc-ticker">
      <span className="btc-ticker__label">BTC/USD</span>
      <span className="btc-ticker__price" style={{ color: priceColor }}>
        ${btcPrice.usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
      </span>
      <div className="btc-ticker__icon-slot">
        {direction === 'up'   && <TrendingUp  size={18} color="var(--healthy)"  />}
        {direction === 'down' && <TrendingDown size={18} color="var(--critical)" />}
        {direction === null   && <Minus        size={18} color="var(--warning)"  />}
      </div>
    </div>
  )
}
