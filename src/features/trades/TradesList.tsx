import {
  Box,
  Button,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Input,
  Select,
  Heading,
  useColorModeValue,
  Card,
  CardBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Text,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useTradeStore, TradeFilters } from '@context/store'
import { useState } from 'react'
import { calculateTradeMetrics } from '@utils/calculations'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function TradesList() {
  const navigate = useNavigate()
  const { trades, deleteTrade } = useTradeStore()
  const [filters, setFilters] = useState<TradeFilters>({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const filteredTrades = trades.filter(trade => {
    if (filters.symbol && !trade.symbol.toLowerCase().includes(filters.symbol.toLowerCase())) {
      return false
    }
    if (filters.direction && trade.direction !== filters.direction) {
      return false
    }
    if (filters.strategyTag && trade.strategyTag !== filters.strategyTag) {
      return false
    }
    if (typeof filters.excludeFromStats === 'boolean' && trade.excludeFromStats !== filters.excludeFromStats) {
      return false
    }
    return true
  }).sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime())

  const handleDelete = (id: string) => {
    deleteTrade(id)
    onClose()
  }

  const uniqueStrategies = [...new Set(trades.map(t => t.strategyTag))]

  const selectedTrade = selectedTradeId ? trades.find(t => t.id === selectedTradeId) : null
  const selectedMetrics = selectedTrade ? calculateTradeMetrics(selectedTrade) : null

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Tüm İşlemler</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="brand"
          onClick={() => navigate('/trades/new')}
        >
          Yeni İşlem
        </Button>
      </HStack>

      {/* Filtreler */}
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <HStack spacing={4} flexWrap="wrap">
            <Input
              placeholder="Sembol ara..."
              size="sm"
              w="150px"
              value={filters.symbol || ''}
              onChange={e => setFilters({ ...filters, symbol: e.target.value })}
            />

            <Select
              placeholder="Yön"
              size="sm"
              w="120px"
              value={filters.direction || ''}
              onChange={e => setFilters({ ...filters, direction: e.target.value as 'long' | 'short' || undefined })}
            >
              <option value="">Tümü</option>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </Select>

            <Select
              placeholder="Strateji"
              size="sm"
              w="150px"
              value={filters.strategyTag || ''}
              onChange={e => setFilters({ ...filters, strategyTag: e.target.value || undefined })}
            >
              <option value="">Tümü</option>
              {uniqueStrategies.map(strategy => (
                <option key={strategy} value={strategy}>
                  {strategy}
                </option>
              ))}
            </Select>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setFilters({})}
            >
              Temizle
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Tablo */}
      <Box
        overflowX="auto"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        bg={bgColor}
      >
        <Table size="sm">
          <Thead>
            <Tr bg={useColorModeValue('gray.100', 'gray.700')}>
              <Th>Sembol</Th>
              <Th>Yön</Th>
              <Th>Giriş</Th>
              <Th>Çıkış</Th>
              <Th>Getiri %</Th>
              <Th>R:R</Th>
              <Th>Süre</Th>
              <Th>Tarih</Th>
              <Th>İşlemler</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTrades.map(trade => {
              const metrics = calculateTradeMetrics(trade)
              const duration = Math.round((new Date(trade.exitTime).getTime() - new Date(trade.entryTime).getTime()) / (1000 * 60))
              const durationStr = duration < 60 ? `${duration}m` : `${Math.round(duration / 60)}h`

              return (
                <Tr key={trade.id} _hover={{ bg: hoverBg }}>
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
                        metrics.result === 'win' ? 'green' : metrics.result === 'loss' ? 'red' : 'gray'
                      }
                    >
                      {metrics.tradeReturnPercent.toFixed(2)}%
                    </Badge>
                  </Td>
                  <Td>1:{metrics.riskRewardRatio.toFixed(2)}</Td>
                  <Td>{durationStr}</Td>
                  <Td>{format(new Date(trade.entryTime), 'dd MMM HH:mm', { locale: tr })}</Td>
                  <Td>
                    <HStack spacing={1}>
                      <IconButton
                        aria-label="Detay"
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTradeId(trade.id)
                          onOpen()
                        }}
                      />
                      <IconButton
                        aria-label="Düzenle"
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/trades/${trade.id}/edit`)}
                      />
                      <IconButton
                        aria-label="Sil"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedTradeId(trade.id)
                          onOpen()
                        }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Box>

      {/* Detay Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>İşlem Detayı</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedTrade && selectedMetrics && (
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="bold">Sembol:</Text>
                  <Text>{selectedTrade.symbol}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Not:</Text>
                  <Text>{selectedTrade.notes}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Getiri %:</Text>
                  <Badge colorScheme={selectedMetrics.result === 'win' ? 'green' : selectedMetrics.result === 'loss' ? 'red' : 'gray'}>
                    {selectedMetrics.tradeReturnPercent.toFixed(2)}%
                  </Badge>
                </HStack>
                <HStack spacing={2} pt={4}>
                  <Button
                    flex={1}
                    colorScheme="blue"
                    onClick={() => {
                      navigate(`/trades/${selectedTrade.id}/edit`)
                      onClose()
                    }}
                  >
                    Düzenle
                  </Button>
                  <Button
                    flex={1}
                    colorScheme="red"
                    onClick={() => {
                      handleDelete(selectedTrade.id)
                    }}
                  >
                    Sil
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
