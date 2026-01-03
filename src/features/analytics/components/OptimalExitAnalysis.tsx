import {
  VStack,
  Text,
  Box,
  Badge,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import { ExitAnalysis } from '../../../types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  analysis: ExitAnalysis
}

export default function OptimalExitAnalysis({ analysis }: Props) {
  const textColor = useColorModeValue('black', 'white')
  const gridColor = useColorModeValue('#e2e8f0', '#4a5568')
  const cardBg = useColorModeValue('blue.50', 'blue.900')

  return (
    <VStack spacing={6} align="stretch">
      <VStack align="stretch" p={4} bg={cardBg} borderRadius="md">
        <Heading size="md">OPTIMAL EXIT STRATEGY</Heading>
        <Text fontSize="3xl" fontWeight="bold" color="brand.500">
          {analysis.optimalExitPercent.toFixed(2)}%
        </Text>
        <Text fontSize="sm" color={textColor}>
          Range: {analysis.exitRangeMin.toFixed(2)}% - {analysis.exitRangeMax.toFixed(2)}%
        </Text>
      </VStack>

      <Text fontSize="sm" fontStyle="italic">
        {analysis.analysisNote}
      </Text>

      <VStack align="stretch">
        <Heading size="sm">PROFIT DISTRIBUTION</Heading>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analysis.histogram}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="range" tick={{ fill: textColor, fontSize: 11 }} angle={-45} />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: useColorModeValue('#fff', '#1a202c'),
                border: `1px solid ${gridColor}`,
                color: textColor,
              }}
            />
            <Bar dataKey="count" fill="#48bb78" name="Trade Count" />
          </BarChart>
        </ResponsiveContainer>
      </VStack>
    </VStack>
  )
}
