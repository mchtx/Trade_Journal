import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PerformanceStats } from '../../../types'
import { useColorModeValue } from '@chakra-ui/react'

interface Props {
  hourlyData: Record<number, PerformanceStats>
}

export default function HourlyPerformanceChart({ hourlyData }: Props) {
  const textColor = useColorModeValue('#000', '#fff')
  const gridColor = useColorModeValue('#e2e8f0', '#4a5568')

  const data = Object.entries(hourlyData)
    .map(([hour, stats]) => ({
      hour: `${hour}:00`,
      'Toplam Getiri %': Number(stats.totalReturnPercent.toFixed(2)),
      'Trade Sayısı': stats.tradeCount,
    }))
    .filter(d => d['Trade Sayısı'] > 0)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="hour" tick={{ fill: textColor, fontSize: 12 }} interval={2} />
        <YAxis tick={{ fill: textColor, fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: useColorModeValue('#fff', '#1a202c'),
            border: `1px solid ${gridColor}`,
            color: textColor,
          }}
        />
        <Line
          type="monotone"
          dataKey="Toplam Getiri %"
          stroke="#0ea5e9"
          dot={{ fill: '#0ea5e9' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
