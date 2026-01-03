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
import { calculateNetPnL, calculateRealizedRR } from '@utils/calculations'
import { format, parseISO } from 'date-fns'
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
              <Th>İŞLEM NO</Th>
              <Th>TARİH</Th>
              <Th>PARİTE</Th>
              <Th>YÖN</Th>
              <Th>SETUP</Th>
              <Th isNumeric>GİRİŞ FİYATI</Th>
              <Th isNumeric>STOP LOSS</Th>
              <Th isNumeric>ÇIKIŞ FİYATI</Th>
              <Th isNumeric>MİKTAR</Th>
              <Th isNumeric>NET KÂR/ZARAR</Th>
              <Th>DURUM</Th>
              <Th>RİSK/ÖDÜL</Th>
              <Th>İşlemler</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTrades.map((trade, index) => {
              const netPnL = calculateNetPnL(
                trade.direction,
                trade.entryPrice,
                trade.exitPrice,
                trade.positionSize || 0
              )
              const rrRatio = calculateRealizedRR(
                trade.entryPrice,
                trade.exitPrice,
                trade.stopLoss
              )
              const isWin = netPnL > 0
              const isLoss = netPnL < 0
              
              const rowBg = isLoss ? 'red.50' : isWin ? 'green.50' : undefined
              const darkRowBg = isLoss ? 'red.900' : isWin ? 'green.900' : undefined
              const finalRowBg = useColorModeValue(rowBg, darkRowBg)

              return (
                <Tr key={trade.id} _hover={{ bg: hoverBg }} bg={finalRowBg}>
                  <Td>{filteredTrades.length - index}</Td>
                  <Td>{format(parseISO(trade.entryTime), 'dd.MM.yyyy (EEEE)', { locale: tr })}</Td>
                  <Td fontWeight="bold">{trade.symbol}</Td>
                  <Td>
                    <Badge colorScheme={trade.direction === 'long' ? 'green' : 'red'}>
                      {trade.direction === 'long' ? 'Long' : 'Short'}
                    </Badge>
                  </Td>
                  <Td>{trade.strategyTag}</Td>
                  <Td isNumeric>{trade.entryPrice}</Td>
                  <Td isNumeric>{trade.stopLoss || '-'}</Td>
                  <Td isNumeric>{trade.exitPrice}</Td>
                  <Td isNumeric>{trade.positionSize || '-'}</Td>
                  <Td isNumeric fontWeight="bold" color={netPnL > 0 ? 'green.500' : netPnL < 0 ? 'red.500' : undefined}>
                    {netPnL.toFixed(2)}
                  </Td>
                  <Td>
                    <Badge colorScheme={isWin ? 'green' : isLoss ? 'red' : 'gray'}>
                      {isWin ? 'Win' : isLoss ? 'Loss' : 'BE'}
                    </Badge>
                  </Td>
                  <Td>1:{rrRatio.toFixed(2)}</Td>
                  <Td>
                    <HStack spacing={1}>
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
          <ModalHeader>İşlem Sil</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Bu işlemi silmek istediğinize emin misiniz?</Text>
            <HStack spacing={4} pt={4} justify="flex-end">
              <Button onClick={onClose}>İptal</Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (selectedTradeId) handleDelete(selectedTradeId)
                }}
              >
                Sil
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
