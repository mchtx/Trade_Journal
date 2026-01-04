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
  Stack,
  Text,
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
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align={{ base: 'stretch', md: 'center' }}>
        <HStack justify="space-between">
          <Button onClick={handlePrevDay} variant="outline" flex={1}>
            ← PREV
          </Button>
          <Button onClick={handleNextDay} variant="outline" flex={1}>
            NEXT →
          </Button>
        </HStack>

        <Input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          maxW={{ base: 'full', md: '200px' }}
        />

        <Box flex={1} textAlign={{ base: 'center', md: 'left' }}>
          <Heading size="md">
            {format(parseISO(selectedDate), 'EEEE, dd MMMM yyyy')}
          </Heading>
        </Box>
      </Stack>

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

            {/* Mobile View */}
            <VStack spacing={4} display={{ base: 'flex', md: 'none' }} align="stretch">
              {dayTrades.map((trade) => {
                const metrics = calculateTradeMetrics(trade)
                return (
                  <Card key={trade.id} variant="outline" bg={useColorModeValue('gray.50', 'gray.700')}>
                    <CardBody p={4}>
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Text fontWeight="bold">{trade.symbol}</Text>
                          <Badge colorScheme={trade.direction === 'long' ? 'green' : 'red'}>
                            {trade.direction === 'long' ? 'LONG' : 'SHORT'}
                          </Badge>
                        </HStack>
                        
                        <SimpleGrid columns={2} spacing={2} fontSize="sm">
                          <Text color="gray.500">Giriş:</Text>
                          <Text textAlign="right">{trade.entryPrice.toFixed(4)}</Text>
                          
                          <Text color="gray.500">Çıkış:</Text>
                          <Text textAlign="right">{trade.exitPrice.toFixed(4)}</Text>
                          
                          <Text color="gray.500">Getiri:</Text>
                          <Badge
                            w="fit-content"
                            justifySelf="end"
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
                          
                          <Text color="gray.500">R:R:</Text>
                          <Text textAlign="right">1:{metrics.riskRewardRatio.toFixed(2)}</Text>
                        </SimpleGrid>
                        
                        {trade.notes && (
                          <Box pt={2} borderTopWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                            <Text fontSize="xs" color="gray.500" noOfLines={2}>
                              {trade.notes}
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                )
              })}
            </VStack>

            {/* Desktop View */}
            <Box overflowX="auto" display={{ base: 'none', md: 'block' }}>
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
