import {
  VStack,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import { Trade } from '../../../types'
import { calculateTradeMetrics } from '@utils/calculations'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  trades: Trade[]
}

export default function RiskRewardDistribution({ trades }: Props) {
  const textColor = useColorModeValue('black', 'white')
  const gridColor = useColorModeValue('#e2e8f0', '#4a5568')

  const includedTrades = trades.filter(t => !t.excludeFromStats)
  const data = includedTrades.map(trade => {
    const metrics = calculateTradeMetrics(trade)
    return {
      riskReward: metrics.riskRewardRatio,
      returnPercent: metrics.tradeReturnPercent,
      result: metrics.result,
    }
  })

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">RISK/REWARD VS RETURN % DISTRIBUTION</Heading>
      
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            type="number"
            dataKey="riskReward"
            name="R:R"
            tick={{ fill: textColor, fontSize: 12 }}
            label={{ value: 'Risk/Reward Ratio', position: 'bottom', fill: textColor, offset: 0 }}
          />
          <YAxis
            type="number"
            dataKey="returnPercent"
            name="Return %"
            tick={{ fill: textColor, fontSize: 12 }}
            label={{ value: 'Return %', angle: -90, position: 'left', fill: textColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: useColorModeValue('#fff', '#1a202c'),
              border: `1px solid ${gridColor}`,
              color: textColor,
            }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter
            name="Win"
            data={data.filter(d => d.result === 'win')}
            fill="#48bb78"
          />
          <Scatter
            name="Loss"
            data={data.filter(d => d.result === 'loss')}
            fill="#f56565"
          />
          <Scatter
            name="Breakeven"
            data={data.filter(d => d.result === 'breakeven')}
            fill="#cbd5e0"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </VStack>
  )
}
