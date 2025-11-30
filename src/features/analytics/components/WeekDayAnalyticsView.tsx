import {
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from '@chakra-ui/react'
import { WeekDayStats } from '../../../types'

interface Props {
  stats: WeekDayStats[]
}

export default function WeekDayAnalyticsView({ stats }: Props) {
  const textColor = useColorModeValue('black', 'white')

  const best = stats.reduce((max, curr) =>
    curr.averageReturnPercent > max.averageReturnPercent ? curr : max
  )
  const worst = stats.reduce((min, curr) =>
    curr.averageReturnPercent < min.averageReturnPercent ? curr : min
  )

  return (
    <VStack spacing={6} align="stretch">
      {/* Best/Worst Summary */}
      <HStack spacing={4}>
        <VStack flex={1} p={4} bg="green.900" borderRadius="md" align="stretch">
          <Heading size="sm" color="green.100">
            En İyi Gün
          </Heading>
          <Text fontSize="2xl" fontWeight="bold" color="green.100">
            {best.dayOfWeek}
          </Text>
          <Text color="green.200">{best.averageReturnPercent.toFixed(2)}% Ort.</Text>
          <Text color="green.200">{best.winRate.toFixed(1)}% Win Rate</Text>
        </VStack>

        <VStack flex={1} p={4} bg="red.900" borderRadius="md" align="stretch">
          <Heading size="sm" color="red.100">
            En Kötü Gün
          </Heading>
          <Text fontSize="2xl" fontWeight="bold" color="red.100">
            {worst.dayOfWeek}
          </Text>
          <Text color="red.200">{worst.averageReturnPercent.toFixed(2)}% Ort.</Text>
          <Text color="red.200">{worst.winRate.toFixed(1)}% Win Rate</Text>
        </VStack>
      </HStack>

      {/* Detailed Table */}
      <VStack align="stretch">
        <Heading size="md">Haftanın Tüm Günleri</Heading>
        <Table size="sm">
          <Thead>
            <Tr bg={useColorModeValue('gray.100', 'gray.700')}>
              <Th>Gün</Th>
              <Th>Trade Sayısı</Th>
              <Th>Ort. Getiri %</Th>
              <Th>Toplam Getiri %</Th>
              <Th>Win Rate %</Th>
              <Th>En Büyük Kazanç</Th>
              <Th>En Büyük Kayıp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stats.map(stat => (
              <Tr key={stat.dayIndex}>
                <Td fontWeight="bold">{stat.dayOfWeek}</Td>
                <Td>{stat.tradeCount}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      stat.averageReturnPercent > 0
                        ? 'green'
                        : stat.averageReturnPercent < 0
                        ? 'red'
                        : 'gray'
                    }
                  >
                    {stat.averageReturnPercent.toFixed(2)}%
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      stat.totalReturnPercent > 0
                        ? 'green'
                        : stat.totalReturnPercent < 0
                        ? 'red'
                        : 'gray'
                    }
                  >
                    {stat.totalReturnPercent.toFixed(2)}%
                  </Badge>
                </Td>
                <Td>{stat.winRate.toFixed(1)}%</Td>
                <Td>
                  <Badge colorScheme="green">
                    +{stat.largestWinPercent.toFixed(2)}%
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme="red">
                    {stat.largestLossPercent.toFixed(2)}%
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </VStack>
  )
}
