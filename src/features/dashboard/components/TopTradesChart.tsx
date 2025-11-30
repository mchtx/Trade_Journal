import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Trade } from '../../../types'
import { getTopAndBottomTrades } from './chartUtils'
import { useColorModeValue } from '@chakra-ui/react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Props {
  trades: Trade[]
}

export default function TopTradesChart({ trades }: Props) {
  const textColor = useColorModeValue('#000', '#fff')
  const gridColor = useColorModeValue('#e2e8f0', '#4a5568')
  
  const { best, worst } = getTopAndBottomTrades(trades, 5)

  const data = [
    ...best.map(t => ({
      label: `${t.symbol} Long (${format(new Date(t.entryTime), 'dd MMM', { locale: tr })})`,
      value: t.metrics.tradeReturnPercent,
      type: 'best',
    })),
    ...worst.map(t => ({
      label: `${t.symbol} ${t.direction === 'long' ? 'Long' : 'Short'} (${format(new Date(t.entryTime), 'dd MMM', { locale: tr })})`,
      value: t.metrics.tradeReturnPercent,
      type: 'worst',
    })),
  ]

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis type="number" tick={{ fill: textColor, fontSize: 12 }} />
        <YAxis dataKey="label" type="category" tick={{ fill: textColor, fontSize: 10 }} width={150} />
        <Tooltip
          contentStyle={{
            backgroundColor: useColorModeValue('#fff', '#1a202c'),
            border: `1px solid ${gridColor}`,
            color: textColor,
          }}
        />
        <Bar dataKey="value" name="Getiri %">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.type === 'best' ? '#48bb78' : '#f56565'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
