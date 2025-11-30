import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Trade } from '../../../types'
import { groupTradesByDate } from './chartUtils'
import { useColorModeValue } from '@chakra-ui/react'

interface Props {
  trades: Trade[]
  period: 'week' | 'month' | 'all'
}

export default function PerformanceChart({ trades, period }: Props) {
  const daysBack = period === 'week' ? 7 : period === 'month' ? 30 : 365
  const data = groupTradesByDate(trades, daysBack)

  const textColor = useColorModeValue('#000', '#fff')
  const gridColor = useColorModeValue('#e2e8f0', '#4a5568')

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="date"
          tick={{ fill: textColor, fontSize: 12 }}
          interval={Math.floor(data.length / 5)}
        />
        <YAxis tick={{ fill: textColor, fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: useColorModeValue('#fff', '#1a202c'),
            border: `1px solid ${gridColor}`,
            color: textColor,
          }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
        <Bar dataKey="totalReturn" fill="#48bb78" name="Günlük Getiri %" />
      </BarChart>
    </ResponsiveContainer>
  )
}
