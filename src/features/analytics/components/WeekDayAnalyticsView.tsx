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
  Stack,
  Box,
  Card,
  CardBody,
  SimpleGrid,
} from '@chakra-ui/react'
import { WeekDayStats } from '../../../types'

interface Props {
  stats: WeekDayStats[]
}

export default function WeekDayAnalyticsView({ stats }: Props) {
  const textColor = useColorModeValue('black', 'white')
  
  const bestBg = useColorModeValue('green.100', 'green.900')
  const bestText = useColorModeValue('green.800', 'green.100')
  const bestSubText = useColorModeValue('green.700', 'green.200')

  const worstBg = useColorModeValue('red.100', 'red.900')
  const worstText = useColorModeValue('red.800', 'red.100')
  const worstSubText = useColorModeValue('red.700', 'red.200')

  const headerBg = useColorModeValue('gray.50', 'whiteAlpha.50')

  const best = stats.reduce((max, curr) =>
    curr.averageReturnPercent > max.averageReturnPercent ? curr : max
  )
  const worst = stats.reduce((min, curr) =>
    curr.averageReturnPercent < min.averageReturnPercent ? curr : min
  )

  return (
    <VStack spacing={6} align="stretch">
      {/* Best/Worst Summary */}
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
        <VStack flex={1} p={4} bg={bestBg} borderRadius="md" align="stretch">
          <Heading size="sm" color={bestText}>
            EN İYİ GÜN
          </Heading>
          <Text fontSize="2xl" fontWeight="bold" color={bestText}>
            {best.dayOfWeek}
          </Text>
          <Text color={bestSubText}>{best.averageReturnPercent.toFixed(2)}% Ort.</Text>
          <Text color={bestSubText}>{best.winRate.toFixed(1)}% Kazanma Oranı</Text>
        </VStack>

        <VStack flex={1} p={4} bg={worstBg} borderRadius="md" align="stretch">
          <Heading size="sm" color={worstText}>
            EN KÖTÜ GÜN
          </Heading>
          <Text fontSize="2xl" fontWeight="bold" color={worstText}>
            {worst.dayOfWeek}
          </Text>
          <Text color={worstSubText}>{worst.averageReturnPercent.toFixed(2)}% Ort.</Text>
          <Text color={worstSubText}>{worst.winRate.toFixed(1)}% Kazanma Oranı</Text>
        </VStack>
      </Stack>

      {/* Detailed Table */}
      <VStack align="stretch">
        <Heading size="md">HAFTALIK DETAY</Heading>
        
        {/* Mobile View */}
        <VStack spacing={4} display={{ base: 'flex', md: 'none' }} align="stretch">
          {stats.map(stat => (
            <Card key={stat.dayIndex} variant="outline" bg={useColorModeValue('gray.50', 'gray.700')}>
              <CardBody p={4}>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{stat.dayOfWeek}</Text>
                    <Badge
                      colorScheme={
                        stat.averageReturnPercent > 0
                          ? 'green'
                          : stat.averageReturnPercent < 0
                          ? 'red'
                          : 'gray'
                      }
                    >
                      {stat.averageReturnPercent.toFixed(2)}% Ort
                    </Badge>
                  </HStack>
                  
                  <SimpleGrid columns={2} spacing={2} fontSize="sm">
                    <Text color="gray.500">İşlem Sayısı:</Text>
                    <Text textAlign="right">{stat.tradeCount}</Text>
                    
                    <Text color="gray.500">Toplam Getiri:</Text>
                    <Text textAlign="right" fontWeight="bold" color={stat.totalReturnPercent > 0 ? 'green.500' : 'red.500'}>
                      {stat.totalReturnPercent.toFixed(2)}%
                    </Text>
                    
                    <Text color="gray.500">Kazanma Oranı:</Text>
                    <Text textAlign="right">{stat.winRate.toFixed(1)}%</Text>
                    
                    <Text color="gray.500">Max Kazanç:</Text>
                    <Text textAlign="right" color="green.500">+{stat.largestWinPercent.toFixed(2)}%</Text>
                    
                    <Text color="gray.500">Max Kayıp:</Text>
                    <Text textAlign="right" color="red.500">{stat.largestLossPercent.toFixed(2)}%</Text>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>

        {/* Desktop View */}
        <Box overflowX="auto" display={{ base: 'none', md: 'block' }}>
          <Table size="sm">
            <Thead>
              <Tr bg={headerBg}>
                <Th>Gün</Th>
                <Th>İşlem Sayısı</Th>
                <Th>Ort. Getiri %</Th>
                <Th>Toplam Getiri %</Th>
                <Th>Kazanma Oranı %</Th>
                <Th>Max Kazanç</Th>
                <Th>Max Kayıp</Th>
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
        </Box>
      </VStack>
    </VStack>
  )
}
