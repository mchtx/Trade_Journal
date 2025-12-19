import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { useColorModeValue, VStack, Box, HStack, Text } from '@chakra-ui/react';
import type { CalculatorYearlyData } from '../../../types';
import { formatCurrency } from '@utils/compoundCalculations';

interface ResultsChartProps {
  yearlyData: CalculatorYearlyData[];
  currency: string;
}

export default function ResultsChart({ yearlyData, currency }: ResultsChartProps) {
  const chartBg = useColorModeValue('white', 'gray.800');
  const gridColor = useColorModeValue('#e2e8f0', '#2d3748');
  const textColor = useColorModeValue('#1a202c', '#cbd5e0');

  // Grafik verilerini hazırla
  const chartData = yearlyData.map((data) => ({
    period: `Y${data.year}M${data.month}`,
    year: data.year,
    balance: Math.round(data.balance),
    interest: Math.round(data.interestEarned),
    cumulative: Math.round(data.cumulativeInterest),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box bg={chartBg} p={2} borderRadius="md" boxShadow="lg" border="1px" borderColor={gridColor}>
          <Text fontSize="sm" fontWeight="bold">
            {data.period}
          </Text>
          {payload.map((entry: any, index: number) => (
            <Text key={index} fontSize="sm" color={entry.color}>
              {entry.name}: {formatCurrency(entry.value, currency)}
            </Text>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Portföy Değeri Trend Grafiği */}
      <Box bg={chartBg} p={4} borderRadius="lg" border="1px" borderColor="gray.200">
        <Text fontWeight="bold" mb={4}>
          📈 Portföy Değeri Eğrisi
        </Text>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="period"
              stroke={textColor}
              style={{ fontSize: '12px' }}
              interval={Math.max(0, Math.floor(chartData.length / 12))}
            />
            <YAxis stroke={textColor} style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
              name="Portföy Değeri"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Faiz Karşılaştırması */}
      <Box bg={chartBg} p={4} borderRadius="lg" border="1px" borderColor="gray.200">
        <Text fontWeight="bold" mb={4}>
          💰 Dönemsel Faiz vs Kümülatif Faiz
        </Text>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="period"
              stroke={textColor}
              style={{ fontSize: '12px' }}
              interval={Math.max(0, Math.floor(chartData.length / 12))}
            />
            <YAxis stroke={textColor} style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="interest" fill="#10b981" name="Dönemsel Faiz" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="Kümülatif Faiz"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      {/* İstatistikler */}
      {chartData.length > 0 && (
        <HStack spacing={4} flex={1} wrap="wrap">
          <Box flex={1} minW="200px" p={3} bg="blue.50" borderRadius="md" borderLeft="4px" borderColor="blue.500">
            <Text fontSize="xs" color="gray.600">
              Başlangıç
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {formatCurrency(chartData[0].balance, currency)}
            </Text>
          </Box>

          <Box flex={1} minW="200px" p={3} bg="green.50" borderRadius="md" borderLeft="4px" borderColor="green.500">
            <Text fontSize="xs" color="gray.600">
              Son Değer
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {formatCurrency(chartData[chartData.length - 1].balance, currency)}
            </Text>
          </Box>

          <Box flex={1} minW="200px" p={3} bg="purple.50" borderRadius="md" borderLeft="4px" borderColor="purple.500">
            <Text fontSize="xs" color="gray.600">
              Toplam Kazanç
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {formatCurrency(
                chartData[chartData.length - 1].balance - chartData[0].balance,
                currency
              )}
            </Text>
          </Box>
        </HStack>
      )}
    </VStack>
  );
}
