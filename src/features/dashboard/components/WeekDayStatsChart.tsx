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
import { WeekDayStats } from '../../../types'
import { useColorModeValue } from '@chakra-ui/react'

interface Props {
  stats: WeekDayStats[]
}

export default function WeekDayStatsChart({ stats }: Props) {
  const textColor = useColorModeValue('#000', '#fff')
  const gridColor = useColorModeValue('#e2e8f0', '#4a5568')

  const data = stats.map(stat => ({
    day: stat.dayOfWeek,
    'Ort. Getiri %': Number(stat.averageReturnPercent.toFixed(2)),
    'Win Rate %': Number(stat.winRate.toFixed(2)),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="day" tick={{ fill: textColor, fontSize: 12 }} />
        <YAxis tick={{ fill: textColor, fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: useColorModeValue('#fff', '#1a202c'),
            border: `1px solid ${gridColor}`,
            color: textColor,
          }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
        <Bar dataKey="Ort. Getiri %" fill="#48bb78" />
        <Bar dataKey="Win Rate %" fill="#3182ce" />
      </BarChart>
    </ResponsiveContainer>
  )
}
