import { Trade, PerformanceStats } from '../../../types'
import { calculateTradeMetrics } from '@utils/calculations'
import { format, subDays } from 'date-fns'
import { tr } from 'date-fns/locale'

// Trade'leri tarih grubuna göre topla
export const groupTradesByDate = (
  trades: Trade[],
  daysBack: number = 30
) => {
  const includedTrades = trades.filter(t => !t.excludeFromStats)
  const result: Record<string, Trade[]> = {}

  const now = new Date()
  for (let i = 0; i < daysBack; i++) {
    const date = subDays(now, i)
    const dateStr = format(date, 'yyyy-MM-dd')
    result[dateStr] = []
  }

  for (const trade of includedTrades) {
    const dateStr = format(new Date(trade.entryTime), 'yyyy-MM-dd')
    if (result[dateStr]) {
      result[dateStr].push(trade)
    }
  }

  return Object.entries(result)
    .map(([date, dayTrades]) => ({
      date,
      trades: dayTrades,
      totalReturn: dayTrades.reduce((sum, t) => {
        const metrics = calculateTradeMetrics(t)
        return sum + metrics.tradeReturnPercent
      }, 0),
      count: dayTrades.length,
    }))
    .reverse()
}

// Cumulative return'ü hesapla
export const calculateCumulativeReturn = (trades: Trade[]) => {
  const includedTrades = trades.filter(t => !t.excludeFromStats)
  let cumulative = 0

  return includedTrades.map(trade => {
    const metrics = calculateTradeMetrics(trade)
    cumulative += metrics.tradeReturnPercent
    return {
      date: format(new Date(trade.entryTime), 'yyyy-MM-dd'),
      cumulative,
      tradeReturn: metrics.tradeReturnPercent,
    }
  })
}

// Win/Loss trade'lerini listele
export const getTopAndBottomTrades = (trades: Trade[], limit: number = 5) => {
  const includedTrades = trades.filter(t => !t.excludeFromStats)
  const withMetrics = includedTrades.map(trade => ({
    ...trade,
    metrics: calculateTradeMetrics(trade),
  }))

  const sorted = [...withMetrics].sort(
    (a, b) => b.metrics.tradeReturnPercent - a.metrics.tradeReturnPercent
  )

  return {
    best: sorted.slice(0, limit),
    worst: sorted.slice(-limit).reverse(),
  }
}
