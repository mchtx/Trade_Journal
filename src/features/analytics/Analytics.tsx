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
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useColorModeValue,
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

  const tabColor = useColorModeValue('gray.500', 'gray.400');
  const selectedColor = 'white';
  const selectedBg = 'brand.500';

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" letterSpacing="tight">ADVANCED ANALYTICS</Heading>

      <Tabs variant="soft-rounded" colorScheme="brand" isLazy>
        <TabList mb={4} overflowX="auto" pb={2} css={{
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'),
            borderRadius: '4px',
          },
        }}>
          <Tab 
            color={tabColor} 
            _selected={{ color: selectedColor, bg: selectedBg }}
            mr={2}
            fontWeight="medium"
            whiteSpace="nowrap"
          >
            DAILY PERFORMANCE
          </Tab>
          <Tab 
            color={tabColor} 
            _selected={{ color: selectedColor, bg: selectedBg }}
            mr={2}
            fontWeight="medium"
            whiteSpace="nowrap"
          >
            OPTIMAL EXIT
          </Tab>
          <Tab 
            color={tabColor} 
            _selected={{ color: selectedColor, bg: selectedBg }}
            fontWeight="medium"
            whiteSpace="nowrap"
          >
            RISK DISTRIBUTION
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Card>
              <CardBody>
                <WeekDayAnalyticsView stats={weekDayStats} />
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel px={0}>
            <Card>
              <CardBody>
                <OptimalExitAnalysis analysis={exitAnalysis} />
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel px={0}>
            <Card>
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
