import {
  Box,
  Button,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  HStack,
  Text,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import { formatCurrency, formatPercent } from '@utils/compoundCalculations';
import { useCalculatorStore } from '../../../context/store';
import type { CalculatorResult } from '../../../types';

export default function ResultsHistory() {
  const { results, isLoading, deleteResult } = useCalculatorStore();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const rowBg = useColorModeValue('gray.50', 'gray.700');

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      try {
        await deleteResult(id);
        toast({
          title: 'Başarılı',
          description: 'Kayıt silindi',
          status: 'success',
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Silinirken hata oluştu',
          status: 'error',
          duration: 2000,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  if (results.length === 0) {
    return (
      <Box bg={bgColor} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
        <Text textAlign="center" color="gray.500">
          Henüz kaydedilmiş hesaplama yok
        </Text>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
      <Heading size="md" mb={4}>
        📊 Geçmiş Hesaplamalar
      </Heading>

      <Box overflowX="auto">
        <Table size="sm" variant="simple">
          <Thead>
            <Tr bg={rowBg}>
              <Th>Tarih</Th>
              <Th isNumeric>Başlangıç</Th>
              <Th isNumeric>Son Tutar</Th>
              <Th isNumeric>Getiri %</Th>
              <Th isNumeric>Vade</Th>
              <Th>İşlem</Th>
            </Tr>
          </Thead>
          <Tbody>
            {results.map((result: any) => (
              <Tr key={result.id} _hover={{ bg: rowBg }}>
                <Td fontSize="sm">
                  {new Date(result.created_at || '').toLocaleDateString('tr-TR')}
                </Td>
                <Td isNumeric fontWeight="bold">
                  {formatCurrency(result.input.principal, result.input.currency)}
                </Td>
                <Td isNumeric fontWeight="bold" color="green.500">
                  {formatCurrency(result.finalBalance, result.input.currency)}
                </Td>
                <Td isNumeric color="blue.500">
                  {formatPercent(result.totalReturnPercent)}
                </Td>
                <Td fontSize="sm">
                  {result.input.periodCount}{' '}
                  {result.input.returnPeriod === 'weekly'
                    ? 'Hafta'
                    : result.input.returnPeriod === 'monthly'
                    ? 'Ay'
                    : result.input.returnPeriod === 'quarterly'
                    ? '3 Ay'
                    : 'Yıl'}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDelete(result.id)}
                    isLoading={isLoading}
                  >
                    Sil
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Text fontSize="xs" color="gray.500" mt={4}>
        Toplam {results.length} kayıt
      </Text>
    </Box>
  );
}
