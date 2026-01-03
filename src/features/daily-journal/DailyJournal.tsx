import {
  Box,
  VStack,
  HStack,
  Button,
  Heading,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react'
import { format, parseISO, addDays, subDays } from 'date-fns'
import { useTradeStore } from '@context/store'
import { useDailySummary, useTradeMetrics } from '@hooks/useAnalytics'
import { getTradesByDate, calculateTradeMetrics } from '@utils/calculations'

export default function DailyJournal() {
  const { trades } = useTradeStore()
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState<string>(
    format(today, 'yyyy-MM-dd')
  )

  const dayTrades = getTradesByDate(trades, selectedDate)
  const dailySummary = useDailySummary(trades, selectedDate)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handlePrevDay = () => {
    const current = parseISO(selectedDate)
    const prev = subDays(current, 1)
    setSelectedDate(format(prev, 'yyyy-MM-dd'))
  }

  const handleNextDay = () => {
    const current = parseISO(selectedDate)
    const next = addDays(current, 1)
    setSelectedDate(format(next, 'yyyy-MM-dd'))
  }

  const getStatColor = (value: number) => {
    if (value > 0) return 'green'
    if (value < 0) return 'red'
    return 'gray'
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading>DAILY JOURNAL</Heading>

      {/* Tarih Seçimi */}
      <HStack spacing={4}>
        <Button onClick={handlePrevDay} variant="outline">
          ← PREVIOUS DAY
        </Button>

        <Input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          maxW="200px"
        />

        <Button onClick={handleNextDay} variant="outline">
          NEXT DAY →
        </Button>

        <Box flex={1}>
          <Heading size="md">
            {format(parseISO(selectedDate), 'EEEE, dd MMMM yyyy')}
          </Heading>
        </Box>
      </HStack>

      {/* Günlük Özet Kartları */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>TOTAL RETURN %</StatLabel>
              <StatNumber color={getStatColor(dailySummary.totalReturnPercent)}>
                {dailySummary.totalReturnPercent.toFixed(2)}%
              </StatNumber>
              <StatHelpText>{dailySummary.tradeCount} trades</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>Win Rate %</StatLabel>
              <StatNumber color="blue.500">
                {dailySummary.winRate.toFixed(2)}%
              </StatNumber>
              <StatHelpText>
                {dailySummary.winCount}W / {dailySummary.lossCount}L
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>En İyi Trade</StatLabel>
              <StatNumber color="green.500">
                {dailySummary.bestTrade
                  ? `+${calculateTradeMetrics(dailySummary.bestTrade).tradeReturnPercent.toFixed(2)}%`
                  : 'N/A'}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>En Kötü Trade</StatLabel>
              <StatNumber color="red.500">
                {dailySummary.worstTrade
                  ? `${calculateTradeMetrics(dailySummary.worstTrade).tradeReturnPercent.toFixed(2)}%`
                  : 'N/A'}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Günün İşlemleri */}
      {dayTrades.length > 0 ? (
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Heading size="md" mb={4}>
              {dailySummary.tradeCount} İşlem
            </Heading>
            <Box overflowX="auto">
              <Table size="sm">
                <Thead>
                  <Tr bg={useColorModeValue('gray.100', 'gray.700')}>
                    <Th>Sembol</Th>
                    <Th>Yön</Th>
                    <Th>Giriş</Th>
                    <Th>Çıkış</Th>
                    <Th>Getiri %</Th>
                    <Th>R:R</Th>
                    <Th>Saat</Th>
                    <Th>Not</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dayTrades.map((trade) => {
                    const metrics = calculateTradeMetrics(trade)
                    return (
                      <Tr key={trade.id}>
                        <Td fontWeight="bold">{trade.symbol}</Td>
                        <Td>
                          <Badge colorScheme={trade.direction === 'long' ? 'green' : 'red'}>
                            {trade.direction === 'long' ? 'L' : 'S'}
                          </Badge>
                        </Td>
                        <Td>{trade.entryPrice.toFixed(4)}</Td>
                        <Td>{trade.exitPrice.toFixed(4)}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              metrics.result === 'win'
                                ? 'green'
                                : metrics.result === 'loss'
                                ? 'red'
                                : 'gray'
                            }
                          >
                            {metrics.tradeReturnPercent.toFixed(2)}%
                          </Badge>
                        </Td>
                        <Td>1:{metrics.riskRewardRatio.toFixed(2)}</Td>
                        <Td>{format(parseISO(trade.entryTime), 'HH:mm')}</Td>
                        <Td fontSize="sm" maxW="150px" isTruncated>
                          {trade.notes}
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      ) : (
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody textAlign="center">
            <Heading size="md" color="gray.400">
              Bu gün hiç işlem yapılmadı
            </Heading>
          </CardBody>
        </Card>
      )}

      {/* Günün Notları */}
      {dailySummary.notes.length > 0 && (
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Heading size="md" mb={4}>
              Günün Notları
            </Heading>
            <VStack align="stretch">
              {dailySummary.notes.map((note, idx) => (
                <Box key={idx} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                  {note}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  )
}
