import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Stack,
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  InputGroup,
  InputLeftAddon,
  useColorModeValue,
  VStack,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  useToast,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import type { CalculatorInput, CalculatorResult } from '../../types';
import { calculateCompoundInterest, formatCurrency, formatPercent } from '@utils/compoundCalculations';
import { useCalculatorStore } from '../../context/store';
import ResultsChart from './components/ResultsChart';
import ResultsHistory from './components/ResultsHistory';

const periodLabels: Record<string, string> = {
  weekly: 'Haftalık',
  monthly: 'Aylık',
  quarterly: 'Üç Aylık',
  annually: 'Yıllık',
};

const periodUnits: Record<string, string> = {
  weekly: 'Hafta',
  monthly: 'Ay',
  quarterly: 'Üç Ay',
  annually: 'Yıl',
};

export default function ExtraCalculator() {
  const [input, setInput] = useState<CalculatorInput>({
    currency: 'TRY',
    principal: 10000,
    returnRate: 4,
    returnPeriod: 'monthly',
    periodCount: 12,
    contributionType: 'none',
  });

  const toast = useToast();
  const { userId, isLoading, addResult, initUser } = useCalculatorStore();

  // User'ı initialize et
  useEffect(() => {
    initUser();
  }, [initUser]);

  // Otomatik hesaplama
  const result = useMemo(() => {
    return calculateCompoundInterest(input);
  }, [input]);

  // Input değişimini handle et
  const handleInputChange = (field: keyof CalculatorInput, value: any) => {
    setInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Sonucu kaydet
  const handleSaveResult = async () => {
    if (!userId) {
      toast({
        title: 'Hata',
        description: 'Kullanıcı oturumu açılamadı',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      await addResult(result);
      toast({
        title: 'Başarılı',
        description: 'Hesaplama sonucu kaydedildi',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Sonuç kaydedilirken hata oluştu',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="7xl" py={8}>
      <Stack spacing={8}>
        {/* Başlık */}
        <Box>
          <Heading
            size="xl"
            mb={2}
            bgGradient="linear(to-r, brand.500, blue.400)"
            bgClip="text"
          >
            💰 Bileşik Faiz Hesaplayıcı
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Başlangıç tutarı, getiri oranı ve vadeyi belirleyin. Sonuç otomatik olarak hesaplanır.
          </Text>
        </Box>

        {/* Ana Layout: Form Sol, Sonuç Sağ */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* SOL TARAF: FORM */}
          <Box bg={bgColor} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Parametreler</Heading>

              {/* Para Birimi */}
              <FormControl>
                <FormLabel fontWeight="bold">Para Birimi</FormLabel>
                <Select
                  value={input.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  bg={cardBg}
                >
                  {['USD', 'EUR', 'TRY', 'GBP', 'JPY'].map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Başlangıç Tutarı */}
              <FormControl>
                <FormLabel fontWeight="bold">Başlangıç Tutarı</FormLabel>
                <InputGroup>
                  <InputLeftAddon>
                    {input.currency === 'USD' ? '$' : input.currency === 'EUR' ? '€' : '₺'}
                  </InputLeftAddon>
                  <Input
                    type="number"
                    value={input.principal}
                    onChange={(e) =>
                      handleInputChange('principal', parseFloat(e.target.value) || 0)
                    }
                    placeholder="10000"
                    min="0"
                    step="1000"
                  />
                </InputGroup>
              </FormControl>

              {/* Getiri Oranı */}
              <FormControl>
                <FormLabel fontWeight="bold">Getiri Oranı (%)</FormLabel>
                <Input
                  type="number"
                  value={input.returnRate}
                  onChange={(e) => handleInputChange('returnRate', parseFloat(e.target.value) || 0)}
                  placeholder="4"
                  min="0"
                  step="0.5"
                />
              </FormControl>

              {/* Getiri Dönemi */}
              <FormControl>
                <FormLabel fontWeight="bold">Getiri Dönemi</FormLabel>
                <Select
                  value={input.returnPeriod}
                  onChange={(e) => handleInputChange('returnPeriod', e.target.value as any)}
                  bg={cardBg}
                >
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                  <option value="quarterly">Üç Aylık</option>
                  <option value="annually">Yıllık</option>
                </Select>
              </FormControl>

              {/* Vade */}
              <FormControl>
                <FormLabel fontWeight="bold">
                  Vade ({periodUnits[input.returnPeriod]})
                </FormLabel>
                <Input
                  type="number"
                  value={input.periodCount}
                  onChange={(e) => handleInputChange('periodCount', parseInt(e.target.value) || 0)}
                  placeholder="12"
                  min="1"
                  step="1"
                />
              </FormControl>

              {/* Ekleme/Çekim Türü */}
              <FormControl>
                <FormLabel fontWeight="bold">Düzenli İşlem</FormLabel>
                <Select
                  value={input.contributionType}
                  onChange={(e) => handleInputChange('contributionType', e.target.value as any)}
                  bg={cardBg}
                >
                  <option value="none">Yok</option>
                  <option value="addition">Periyodik Ekleme</option>
                  <option value="withdrawal">Periyodik Çekim</option>
                </Select>
              </FormControl>

              {/* Ekleme/Çekim Tutarı */}
              {input.contributionType !== 'none' && (
                <FormControl>
                  <FormLabel fontWeight="bold">
                    {input.contributionType === 'addition' ? 'Periyodik Ekleme' : 'Periyodik Çekim'} Tutarı ({periodUnits[input.returnPeriod]})
                  </FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      {input.currency === 'USD' ? '$' : input.currency === 'EUR' ? '€' : '₺'}
                    </InputLeftAddon>
                    <Input
                      type="number"
                      value={input.contributionAmount || 0}
                      onChange={(e) =>
                        handleInputChange('contributionAmount', parseFloat(e.target.value) || 0)
                      }
                      placeholder="500"
                      min="0"
                      step="100"
                    />
                  </InputGroup>
                </FormControl>
              )}
            </VStack>
          </Box>

          {/* SAĞ TARAF: SONUÇLAR */}
          <VStack spacing={6} align="stretch">
            {/* Özet Kartları */}
            <Stack spacing={4}>
              <Box bg="blue.50" _dark={{ bg: 'blue.900' }} p={4} borderRadius="lg" borderLeft="4px" borderColor="blue.500">
                <Stat>
                  <StatLabel>Son Para</StatLabel>
                  <StatNumber fontSize="2xl" color="blue.600">
                    {formatCurrency(result.finalBalance, result.input.currency)}
                  </StatNumber>
                  <StatHelpText>Vade sonunda beklenen tutar</StatHelpText>
                </Stat>
              </Box>

              <Box bg="green.50" _dark={{ bg: 'green.900' }} p={4} borderRadius="lg" borderLeft="4px" borderColor="green.500">
                <Stat>
                  <StatLabel>Kazanılan Getiri</StatLabel>
                  <StatNumber fontSize="2xl" color="green.600">
                    {formatCurrency(result.totalInterestEarned, result.input.currency)}
                  </StatNumber>
                  <StatHelpText>Başlangıç tutarı hariç kazanç</StatHelpText>
                </Stat>
              </Box>

              <Box bg="purple.50" _dark={{ bg: 'purple.900' }} p={4} borderRadius="lg" borderLeft="4px" borderColor="purple.500">
                <Stat>
                  <StatLabel>Toplam Getiri Oranı</StatLabel>
                  <StatNumber fontSize="2xl" color="purple.600">
                    {formatPercent(result.totalReturnPercent)}
                  </StatNumber>
                  <StatHelpText>Yüzdesel toplam kazanç</StatHelpText>
                </Stat>
              </Box>

              <Box bg="orange.50" _dark={{ bg: 'orange.900' }} p={4} borderRadius="lg" borderLeft="4px" borderColor="orange.500">
                <Stat>
                  <StatLabel>Toplam Yatırılan</StatLabel>
                  <StatNumber fontSize="2xl" color="orange.600">
                    {formatCurrency(result.totalPrincipalInvested, result.input.currency)}
                  </StatNumber>
                  <StatHelpText>Başlangıç + ekleme - çekim</StatHelpText>
                </Stat>
              </Box>
            </Stack>

            {/* Özet Tablo */}
            <Box bg={cardBg} p={4} borderRadius="lg">
              <VStack spacing={2} align="start" fontSize="sm">
                <HStack justify="space-between" w="full">
                  <Text>Başlangıç:</Text>
                  <Text fontWeight="bold">{formatCurrency(input.principal, input.currency)}</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text>Vade:</Text>
                  <Text fontWeight="bold">{input.periodCount} {periodUnits[input.returnPeriod]}</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text>Getiri Oranı:</Text>
                  <Text fontWeight="bold">{input.returnRate}% / {periodLabels[input.returnPeriod]}</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text>Yatırılan Total:</Text>
                  <Text fontWeight="bold">{formatCurrency(result.totalPrincipalInvested, input.currency)}</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Kaydet Butonu */}
            <Button
              w="full"
              colorScheme="green"
              size="lg"
              onClick={handleSaveResult}
              isLoading={isLoading}
              loadingText="Kaydediliyor..."
              fontSize="md"
            >
              💾 Veritabanına Kaydet
            </Button>
          </VStack>
        </SimpleGrid>

        {/* Grafik ve Geçmiş - Tab'lar */}
        <Tabs colorScheme="blue" variant="soft-rounded">
          <TabList>
            <Tab>📈 Grafik</Tab>
            <Tab>📊 Geçmiş Hesaplamalar</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box bg={bgColor} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
                <ResultsChart yearlyData={result.yearlyData} currency={result.input.currency} />
              </Box>
            </TabPanel>
            <TabPanel>
              <ResultsHistory />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}
