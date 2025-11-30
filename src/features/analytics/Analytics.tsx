import {
  Box,
  Grid,
  GridItem,
  Heading,
  Card,
  CardBody,
  SimpleGrid,
  VStack,
  HStack,
  useColorModeValue,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import { useTradeStore } from '@context/store'
import { useWeekDayStats, useOptimalExit } from '@hooks/useAnalytics'
import WeekDayAnalyticsView from './components/WeekDayAnalyticsView'
import OptimalExitAnalysis from './components/OptimalExitAnalysis'
import RiskRewardDistribution from './components/RiskRewardDistribution'

export default function Analytics() {
  const { trades } = useTradeStore()
  const weekDayStats = useWeekDayStats(trades)
  const exitAnalysis = useOptimalExit(trades)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <VStack spacing={8} align="stretch">
      <Heading>Detaylı Analitik</Heading>

      <Tabs variant="soft-rounded" colorScheme="brand">
        <TabList>
          <Tab>Haftanın Günleri</Tab>
          <Tab>Optimum Çıkış</Tab>
          <Tab>Risk/Ödül</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <WeekDayAnalyticsView stats={weekDayStats} />
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <OptimalExitAnalysis analysis={exitAnalysis} />
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <RiskRewardDistribution trades={trades} />
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}
