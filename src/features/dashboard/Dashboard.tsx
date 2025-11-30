import {
  Box,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  HStack,
  Button,
  useColorModeValue,
  Select,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useTradeStore } from '@context/store'
import {
  usePerformanceStats,
  useWeekDayStats,
  useHourlyPerformance,
} from '@hooks/useAnalytics'
import PerformanceChart from './components/PerformanceChart'
import WeekDayStatsChart from './components/WeekDayStatsChart'
import HourlyPerformanceChart from './components/HourlyPerformanceChart'
import TopTradesChart from './components/TopTradesChart'

export default function Dashboard() {
  const { trades } = useTradeStore()
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week')

  const stats = usePerformanceStats(trades, period)
  const weekDayStats = useWeekDayStats(trades)
  const hourlyPerf = useHourlyPerformance(trades)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const getStatColor = (value: number) => {
    if (value > 0) return 'green'
    if (value < 0) return 'red'
    return 'gray'
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Başlık ve Dönem Seçimi */}
      <HStack justify="space-between">
        <Heading size="lg">Dashboard</Heading>
        <HStack spacing={2}>
          {(['week', 'month', 'all'] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? 'solid' : 'outline'}
              colorScheme="brand"
              onClick={() => setPeriod(p)}
            >
              {p === 'week' ? 'Hafta' : p === 'month' ? 'Ay' : 'Tümü'}
            </Button>
          ))}
        </HStack>
      </HStack>

      {/* Özet Kartları */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>Toplam Getiri %</StatLabel>
              <StatNumber color={getStatColor(stats.totalReturnPercent)}>
                {stats.totalReturnPercent.toFixed(2)}%
              </StatNumber>
              <StatHelpText>{stats.tradeCount} işlem</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>Win Rate %</StatLabel>
              <StatNumber color="blue.500">
                {stats.winRate.toFixed(2)}%
              </StatNumber>
              <StatHelpText>
                {stats.winCount} / {stats.lossCount} / {stats.breakevenCount}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>Ortalama R:R</StatLabel>
              <StatNumber>
                1:{stats.averageRiskRewardRatio.toFixed(2)}
              </StatNumber>
              <StatHelpText>
                Best: {stats.bestTradePercent.toFixed(2)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>Expectancy %</StatLabel>
              <StatNumber color={getStatColor(stats.expectancyPercent)}>
                {stats.expectancyPercent.toFixed(2)}%
              </StatNumber>
              <StatHelpText>
                Streak: {stats.maxWinStreak} / {stats.maxLossStreak}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Grafikler */}
      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        gap={6}
      >
        <GridItem>
          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <Heading size="md" mb={4}>
                Hafta Performansı
              </Heading>
              <PerformanceChart trades={trades} period={period} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <Heading size="md" mb={4}>
                Haftanın Günleri
              </Heading>
              <WeekDayStatsChart stats={weekDayStats} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <Heading size="md" mb={4}>
                En İyi / En Kötü İşlemler
              </Heading>
              <TopTradesChart trades={trades} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <Heading size="md" mb={4}>
                Saatlik Performans
              </Heading>
              <HourlyPerformanceChart hourlyData={hourlyPerf} />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </VStack>
  )
}
