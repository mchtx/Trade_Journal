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
  VStack,
  Text,
  Badge,
  Icon,
  useColorModeValue,
  Stack,
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
import { FiTrendingUp, FiTrendingDown, FiActivity, FiTarget } from 'react-icons/fi'

export default function Dashboard() {
  const { trades } = useTradeStore()
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week')

  const stats = usePerformanceStats(trades, period)
  const weekDayStats = useWeekDayStats(trades)
  const hourlyPerf = useHourlyPerformance(trades)

  const getStatColor = (value: number) => {
    if (value > 0) return 'trade.profit'
    if (value < 0) return 'trade.loss'
    return 'gray.400'
  }

  const periodBg = useColorModeValue('gray.100', 'whiteAlpha.50')
  const headingColor = useColorModeValue('gray.600', 'gray.400')
  const labelColor = useColorModeValue('gray.600', 'gray.400')
  const subTextColor = useColorModeValue('gray.500', 'gray.500')

  return (
    <VStack spacing={6} align="stretch">
      {/* Header Section */}
      <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} spacing={4}>
        <VStack align="start" spacing={1}>
          <Heading size="lg" letterSpacing="tight">PİYASA GENEL BAKIŞ</Heading>
          <HStack>
            <Badge colorScheme="green" variant="subtle" px={2} borderRadius="full">CANLI</Badge>
            <Text fontSize="xs" color={subTextColor} fontFamily="mono">
              SON GÜNCELLEME: {new Date().toLocaleTimeString()}
            </Text>
          </HStack>
        </VStack>
        
        <HStack spacing={2} bg={periodBg} p={1} borderRadius="lg" w={{ base: 'full', md: 'auto' }} overflowX="auto">
          {(['week', 'month', 'all'] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? 'solid' : 'ghost'}
              colorScheme={period === p ? 'brand' : 'gray'}
              onClick={() => setPeriod(p)}
              fontSize="xs"
              textTransform="uppercase"
              flex={{ base: 1, md: 'initial' }}
            >
              {p === 'week' ? 'Hafta' : p === 'month' ? 'Ay' : 'Tüm Zamanlar'}
            </Button>
          ))}
        </HStack>
      </Stack>

      {/* Primary Stats - High Hierarchy */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card variant="outline" borderColor={stats.totalReturnPercent >= 0 ? 'trade.profit' : 'trade.loss'} borderWidth="0px" borderLeftWidth="4px">
          <CardBody>
            <Stat>
              <HStack justify="space-between" mb={2}>
                <StatLabel color={labelColor}>Net K/Z</StatLabel>
                <Icon as={stats.totalReturnPercent >= 0 ? FiTrendingUp : FiTrendingDown} color={getStatColor(stats.totalReturnPercent)} />
              </HStack>
              <StatNumber fontSize="3xl" color={getStatColor(stats.totalReturnPercent)}>
                {stats.totalReturnPercent > 0 ? '+' : ''}{stats.totalReturnPercent.toFixed(2)}%
              </StatNumber>
              <StatHelpText mb={0} fontSize="xs" color={subTextColor}>
                {stats.tradeCount} GERÇEKLEŞEN İŞLEM
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <HStack justify="space-between" mb={2}>
                <StatLabel>Kazanma Oranı</StatLabel>
                <Icon as={FiActivity} color="brand.400" />
              </HStack>
              <StatNumber fontSize="3xl" color="brand.400">
                {stats.winRate.toFixed(2)}%
              </StatNumber>
              <StatHelpText mb={0} fontSize="xs">
                <Text as="span" color="trade.profit">{stats.winCount} K</Text> / 
                <Text as="span" color="trade.loss"> {stats.lossCount} Z</Text> / 
                <Text as="span" color="gray.500"> {stats.breakevenCount} BB</Text>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <HStack justify="space-between" mb={2}>
                <StatLabel>Risk : Ödül</StatLabel>
                <Icon as={FiTarget} color="purple.400" />
              </HStack>
              <StatNumber fontSize="3xl" color="purple.400">
                1:{stats.averageRiskRewardRatio.toFixed(2)}
              </StatNumber>
              <StatHelpText mb={0} fontSize="xs" color="gray.500">
                EN İYİ İŞLEM: <Text as="span" color="trade.profit">+{stats.bestTradePercent.toFixed(2)}%</Text>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <HStack justify="space-between" mb={2}>
                <StatLabel>Beklenti</StatLabel>
                <Badge colorScheme={stats.expectancyPercent > 0 ? 'green' : 'red'}>
                  {stats.expectancyPercent > 0 ? 'POZİTİF' : 'NEGATİF'}
                </Badge>
              </HStack>
              <StatNumber fontSize="3xl" color={getStatColor(stats.expectancyPercent)}>
                {stats.expectancyPercent.toFixed(2)}%
              </StatNumber>
              <StatHelpText mb={0} fontSize="xs" color="gray.500">
                MAKS SERİ: <Text as="span" color="trade.profit">{stats.maxWinStreak}K</Text> / <Text as="span" color="trade.loss">{stats.maxLossStreak}Z</Text>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Charts Grid */}
      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        gap={6}
      >
        <GridItem>
          <Card h="full">
            <CardBody>
              <Heading size="sm" mb={6} color={headingColor} textTransform="uppercase" letterSpacing="wide">
                Performans Eğrisi
              </Heading>
              <Box h="300px">
                <PerformanceChart trades={trades} period={period} />
              </Box>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card h="full">
            <CardBody>
              <Heading size="sm" mb={6} color={headingColor} textTransform="uppercase" letterSpacing="wide">
                Günlük Dağılım
              </Heading>
              <Box h="300px">
                <WeekDayStatsChart stats={weekDayStats} />
              </Box>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Card>
            <CardBody>
              <Heading size="sm" mb={6} color={headingColor} textTransform="uppercase" letterSpacing="wide">
                En İyi Performanslar
              </Heading>
              <TopTradesChart trades={trades} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Card>
            <CardBody>
              <Heading size="sm" mb={6} color={headingColor} textTransform="uppercase" letterSpacing="wide">
                Saatlik Analiz
              </Heading>
              <HourlyPerformanceChart hourlyData={hourlyPerf} />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </VStack>
  )
}
