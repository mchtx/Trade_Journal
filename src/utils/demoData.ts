import { Trade } from '../types'

/**
 * Demo verisi oluştur - test amacıyla kullanılabilir
 */
export const generateDemoTrades = (): Trade[] => {
  const now = new Date()
  const trades: Trade[] = []

  // Son 30 gün için demo işlemler
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Günde 1-3 trade
    const tradeCount = Math.floor(Math.random() * 3) + 1
    
    for (let j = 0; j < tradeCount; j++) {
      const isWin = Math.random() > 0.4
      const entryPrice = 1.0 + Math.random() * 2
      const returnPercent = isWin 
        ? Math.random() * 3 + 0.5
        : -Math.random() * 2 - 0.3
      
      const exitPrice = entryPrice * (1 + returnPercent / 100)
      
      const entryTime = new Date(date)
      entryTime.setHours(Math.floor(Math.random() * 16) + 8)
      entryTime.setMinutes(Math.floor(Math.random() * 60))
      
      const exitTime = new Date(entryTime)
      exitTime.setMinutes(exitTime.getMinutes() + Math.floor(Math.random() * 480) + 15)
      
      trades.push({
        id: `demo-${i}-${j}`,
        symbol: ['EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD'][Math.floor(Math.random() * 4)],
        direction: Math.random() > 0.5 ? 'long' : 'short',
        entryPrice,
        exitPrice,
        entryTime: entryTime.toISOString(),
        exitTime: exitTime.toISOString(),
        stopLoss: entryPrice * (Math.random() > 0.5 ? 0.98 : 1.02),
        takeProfit: entryPrice * (Math.random() > 0.5 ? 1.05 : 0.95),
        strategyTag: ['Scalping', 'Swing', 'Breakout', 'Support/Resistance'][Math.floor(Math.random() * 4)],
        notes: `Demo işlem - ${isWin ? 'Kazanç' : 'Kayıp'} işlemi`,
        emotionScore: Math.floor(Math.random() * 5) + 1,
        disciplineScore: Math.floor(Math.random() * 5) + 1,
        excludeFromStats: false,
        screenshots: [],
        createdAt: entryTime.toISOString(),
        updatedAt: entryTime.toISOString(),
      })
    }
  }

  return trades
}
