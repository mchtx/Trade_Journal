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
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useTradeStore, TradeFilters } from '@context/store'
import { useState } from 'react'
import { calculateNetPnL, calculateRealizedRR } from '@utils/calculations'
import { format, parseISO } from 'date-fns'
import { FiArrowUp, FiArrowDown, FiFilter, FiTrash2, FiEdit2 } from 'react-icons/fi'

export default function TradesList() {
  const navigate = useNavigate()
  const { trades, deleteTrade } = useTradeStore()
  const [filters, setFilters] = useState<TradeFilters>({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null)

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

  const filterBg = useColorModeValue('gray.50', 'whiteAlpha.50')
  const filterLabelColor = useColorModeValue('gray.600', 'gray.400')
  const tableHeaderBg = useColorModeValue('gray.100', 'whiteAlpha.50')
  const rowHoverBg = useColorModeValue('gray.50', 'whiteAlpha.50')
  const cellTextColor = useColorModeValue('gray.600', 'gray.300')
  const priceColor = useColorModeValue('gray.800', 'gray.300')
  const stopLossColor = useColorModeValue('red.600', 'red.300')
  const takeProfitColor = useColorModeValue('green.600', 'green.300')
  const modalBg = useColorModeValue('white', 'bg.800')
  const modalTextColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" align="center">
        <Heading size="lg" letterSpacing="tight">İŞLEM GEÇMİŞİ</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="brand"
          size="md"
          onClick={() => navigate('/trades/new')}
          boxShadow="0 0 15px rgba(56, 189, 248, 0.3)"
        >
          YENİ GİRİŞ
        </Button>
      </HStack>

      {/* Filters */}
      <Card variant="outline" borderWidth="0px" bg={filterBg}>
        <CardBody py={4}>
          <HStack spacing={4} flexWrap="wrap">
            <HStack color={filterLabelColor}>
              <Icon as={FiFilter} />
              <Text fontSize="sm" fontWeight="bold">FİLTRELER:</Text>
            </HStack>
            <Input
              placeholder="SEMBOL ARA..."
              size="sm"
              w="180px"
              value={filters.symbol || ''}
              onChange={e => setFilters({ ...filters, symbol: e.target.value })}
              fontFamily="mono"
            />

            <Select
              placeholder="YÖN"
              size="sm"
              w="140px"
              value={filters.direction || ''}
              onChange={e => setFilters({ ...filters, direction: e.target.value as 'long' | 'short' || undefined })}
              fontFamily="mono"
            >
              <option value="">TÜMÜ</option>
              <option value="long">LONG</option>
              <option value="short">SHORT</option>
            </Select>

            <Select
              placeholder="STRATEJİ"
              size="sm"
              w="180px"
              value={filters.strategyTag || ''}
              onChange={e => setFilters({ ...filters, strategyTag: e.target.value || undefined })}
              fontFamily="mono"
            >
              <option value="">TÜMÜ</option>
              {uniqueStrategies.map(strategy => (
                <option key={strategy} value={strategy}>
                  {strategy}
                </option>
              ))}
            </Select>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setFilters({})}
              color="gray.400"
              _hover={{ color: useColorModeValue('brand.600', 'white') }}
            >
              SIFIRLA
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Table */}
      <Card overflow="hidden">
        <Box overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead bg={tableHeaderBg}>
              <Tr>
                <Th>#</Th>
                <Th>TARİH</Th>
                <Th>PARİTE</Th>
                <Th>YÖN</Th>
                <Th>Strateji</Th>
                <Th isNumeric>GİRİŞ</Th>
                <Th isNumeric>STOP</Th>
                <Th isNumeric>ÇIKIŞ</Th>
                <Th isNumeric>BÜYÜKLÜK</Th>
                <Th isNumeric>K/Z</Th>
                <Th>DURUM</Th>
                <Th>R:R</Th>
                <Th>İŞLEMLER</Th>
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
                
                return (
                  <Tr 
                    key={trade.id} 
                    _hover={{ bg: rowHoverBg }} 
                    transition="background 0.2s"
                  >
                    <Td fontFamily="mono" color="gray.500">{filteredTrades.length - index}</Td>
                    <Td fontFamily="mono" fontSize="xs" color="gray.400">
                      {format(parseISO(trade.entryTime), 'dd.MM.yyyy')}
                    </Td>
                    <Td fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>{trade.symbol}</Td>
                    <Td>
                      <Badge 
                        bg={trade.direction === 'long' ? useColorModeValue('green.100', 'green.900') : useColorModeValue('red.100', 'red.900')} 
                        color={trade.direction === 'long' ? useColorModeValue('green.800', 'green.200') : useColorModeValue('red.800', 'red.200')}
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        w="fit-content"
                      >
                        <Icon as={trade.direction === 'long' ? FiArrowUp : FiArrowDown} mr={1} />
                        {trade.direction === 'long' ? 'LONG' : 'SHORT'}
                      </Badge>
                    </Td>
                    <Td fontSize="xs" fontFamily="mono">{trade.strategyTag}</Td>
                    <Td isNumeric fontFamily="mono" color={priceColor}>{trade.entryPrice}</Td>
                    <Td isNumeric fontFamily="mono" color={stopLossColor}>{trade.stopLoss || '-'}</Td>
                    <Td isNumeric fontFamily="mono" color={takeProfitColor}>{trade.exitPrice}</Td>
                    <Td isNumeric fontFamily="mono">{trade.positionSize || '-'}</Td>
                    <Td isNumeric fontFamily="mono" fontWeight="bold" color={netPnL > 0 ? 'trade.profit' : netPnL < 0 ? 'trade.loss' : 'gray.400'}>
                      {netPnL > 0 ? '+' : ''}{netPnL.toFixed(2)}
                    </Td>
                    <Td>
                      <Badge 
                        variant="subtle" 
                        colorScheme={isWin ? 'green' : isLoss ? 'red' : 'gray'}
                        fontSize="xs"
                      >
                        {isWin ? 'KAZANÇ' : isLoss ? 'KAYIP' : 'BAŞABAŞ'}
                      </Badge>
                    </Td>
                    <Td fontFamily="mono" fontSize="xs">1:{rrRatio.toFixed(2)}</Td>
                    <Td>
                      <HStack spacing={0}>
                        <IconButton
                          aria-label="Edit"
                          icon={<FiEdit2 />}
                          size="sm"
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: 'brand.400', bg: 'whiteAlpha.100' }}
                          onClick={() => navigate(`/trades/${trade.id}/edit`)}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<FiTrash2 />}
                          size="sm"
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: 'red.400', bg: 'whiteAlpha.100' }}
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
      </Card>

      {/* Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={modalBg} borderColor="whiteAlpha.200" borderWidth="1px">
          <ModalHeader>İŞLEMİ SİL</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text color={modalTextColor}>Bu işlem kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</Text>
            <HStack spacing={4} pt={6} justify="flex-end">
              <Button onClick={onClose} variant="ghost">İPTAL</Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (selectedTradeId) handleDelete(selectedTradeId)
                }}
              >
                SİL
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
