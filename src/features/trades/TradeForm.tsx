import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  FormErrorMessage,
  useToast,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Grid,
  GridItem,
  Divider,
  Badge,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Icon,
} from '@chakra-ui/react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Trade } from '../../types'
import { useTradeStore } from '@context/store'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { calculateNetPnL, calculateRealizedRR } from '@utils/calculations'
import { FiActivity, FiTarget, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const TradeSchema = z.object({
  entryTime: z.string().min(1, 'Tarih gereklidir'),
  symbol: z.string().min(1, 'Sembol gereklidir'),
  direction: z.enum(['long', 'short']),
  strategyTag: z.string().min(1, 'Strateji gereklidir'),
  entryPrice: z.coerce.number().positive('Giriş fiyatı pozitif olmalıdır'),
  stopLoss: z.coerce.number().positive('Stop loss pozitif olmalıdır'),
  exitPrice: z.coerce.number().positive('Çıkış fiyatı pozitif olmalıdır'),
  positionSize: z.coerce.number().positive('Büyüklük pozitif olmalıdır'),
  notes: z.string().optional(),
  emotionScore: z.coerce.number().min(1).max(5).optional(),
  disciplineScore: z.coerce.number().min(1).max(5).optional(),
  excludeFromStats: z.boolean().optional(),
})

type TradeFormData = z.infer<typeof TradeSchema>

interface Props {
  tradeId?: string
  onSuccess?: () => void
}

export default function TradeForm({ tradeId, onSuccess }: Props) {
  const { addTrade, updateTrade, getTrade } = useTradeStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [setupSelection, setSetupSelection] = useState<string>('Darvas')

  const trade = tradeId ? getTrade(tradeId) : null

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<TradeFormData>({
    resolver: zodResolver(TradeSchema),
    defaultValues: trade
      ? {
          symbol: trade.symbol,
          direction: trade.direction,
          entryPrice: trade.entryPrice,
          exitPrice: trade.exitPrice,
          positionSize: trade.positionSize || 1,
          entryTime: trade.entryTime.slice(0, 10),
          stopLoss: trade.stopLoss || 0,
          strategyTag: trade.strategyTag,
          notes: trade.notes,
          emotionScore: trade.emotionScore,
          disciplineScore: trade.disciplineScore,
          excludeFromStats: trade.excludeFromStats,
        }
      : {
          direction: 'long',
          positionSize: 1,
          entryTime: new Date().toISOString().slice(0, 10),
          emotionScore: 3,
          disciplineScore: 3,
          excludeFromStats: false,
          strategyTag: 'Darvas',
        },
  })

  const watchedValues = useWatch({ control })
  const { direction, entryPrice, exitPrice, stopLoss, positionSize, entryTime } = watchedValues

  useEffect(() => {
    if (trade?.strategyTag) {
      if (['Darvas', 'İkinci Talep'].includes(trade.strategyTag)) {
        setSetupSelection(trade.strategyTag)
      } else {
        setSetupSelection('Other')
      }
    }
  }, [trade])

  const handleSetupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSetupSelection(val)
    if (val !== 'Other') {
      setValue('strategyTag', val)
    } else {
      setValue('strategyTag', '')
    }
  }

  const netPnL = calculateNetPnL(
    direction as 'long' | 'short' || 'long',
    Number(entryPrice) || 0,
    Number(exitPrice) || 0,
    Number(positionSize) || 0
  )

  const rrRatio = calculateRealizedRR(
    Number(entryPrice) || 0,
    Number(exitPrice) || 0,
    Number(stopLoss) || 0
  )

  const onSubmit = (data: TradeFormData) => {
    try {
      const tradeData = {
        ...data,
        entryTime: new Date(data.entryTime).toISOString(),
        exitTime: new Date(data.entryTime).toISOString(),
        entryPrice: Number(data.entryPrice),
        exitPrice: Number(data.exitPrice),
        stopLoss: Number(data.stopLoss),
        positionSize: Number(data.positionSize),
        takeProfit: 0,
      }

      if (trade) {
        updateTrade(trade.id, tradeData)
        toast({ title: 'BAŞARILI', description: 'İşlem başarıyla güncellendi', status: 'success' })
      } else {
        const newTrade: Trade = {
          id: Date.now().toString(),
          ...tradeData,
          takeProfit: 0,
          screenshots: [],
          excludeFromStats: data.excludeFromStats ?? false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          notes: data.notes || '',
          emotionScore: data.emotionScore || 3,
          disciplineScore: data.disciplineScore || 3,
        }
        addTrade(newTrade)
        toast({ title: 'BAŞARILI', description: 'İşlem başarıyla eklendi', status: 'success' })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/trades')
      }
    } catch (error) {
      console.error(error)
      toast({ title: 'HATA', description: 'İşlem kaydedilemedi', status: 'error' })
    }
  }

  const inputBg = useColorModeValue('white', 'gray.900')
  const labelColor = useColorModeValue('gray.500', 'gray.400')
  const statBg = useColorModeValue('gray.50', 'whiteAlpha.50')
  const pnlColor = netPnL >= 0 ? 'green.500' : 'red.500'

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={6}>
      <VStack spacing={8} align="stretch">
        
        {/* SECTION 1: CORE INFO */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
          <GridItem>
            <FormControl isInvalid={!!errors.entryTime}>
              <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} letterSpacing="wide">TARİH</FormLabel>
              <Input type="date" {...register('entryTime')} bg={inputBg} fontFamily="mono" />
              <FormErrorMessage>{errors.entryTime?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.symbol}>
              <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} letterSpacing="wide">SEMBOL</FormLabel>
              <Input placeholder="BTCUSDT" {...register('symbol')} bg={inputBg} fontFamily="mono" textTransform="uppercase" />
              <FormErrorMessage>{errors.symbol?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} letterSpacing="wide">YÖN</FormLabel>
              <Select {...register('direction')} bg={inputBg} fontFamily="mono">
                <option value="long">LONG</option>
                <option value="short">SHORT</option>
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.strategyTag}>
              <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} letterSpacing="wide">STRATEJİ</FormLabel>
              <Select value={setupSelection} onChange={handleSetupChange} bg={inputBg} fontFamily="mono" mb={2}>
                <option value="Darvas">Darvas</option>
                <option value="İkinci Talep">İkinci Talep</option>
                <option value="Other">Diğer</option>
              </Select>
              {setupSelection === 'Other' && (
                <Input placeholder="Strateji Adı" {...register('strategyTag')} bg={inputBg} size="sm" />
              )}
              <FormErrorMessage>{errors.strategyTag?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <Divider />

        {/* SECTION 2: EXECUTION */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
          <GridItem>
            <FormControl isInvalid={!!errors.entryPrice}>
              <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} letterSpacing="wide">GİRİŞ FİYATI</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register('entryPrice')} bg={inputBg} fontFamily="mono" />
              </NumberInput>
              <FormErrorMessage>{errors.entryPrice?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.stopLoss}>
              <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} letterSpacing="wide">STOP LOSS</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register('stopLoss')} bg={inputBg} fontFamily="mono" color="red.400" />
              </NumberInput>
              <FormErrorMessage>{errors.stopLoss?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.exitPrice}>
              <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} letterSpacing="wide">ÇIKIŞ FİYATI</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register('exitPrice')} bg={inputBg} fontFamily="mono" color="green.400" />
              </NumberInput>
              <FormErrorMessage>{errors.exitPrice?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.positionSize}>
              <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} letterSpacing="wide">BÜYÜKLÜK</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register('positionSize')} bg={inputBg} fontFamily="mono" />
              </NumberInput>
              <FormErrorMessage>{errors.positionSize?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        {/* LIVE STATS BAR */}
        <Box bg={statBg} p={4} borderRadius="md" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}>
          <HStack spacing={8} justify="center" divider={<Divider orientation="vertical" height="40px" />}>
            <HStack>
              <Icon as={netPnL >= 0 ? FiTrendingUp : FiTrendingDown} color={pnlColor} boxSize={6} />
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">TAHMİNİ K/Z</Text>
                <Text fontSize="2xl" fontWeight="bold" color={pnlColor} fontFamily="mono">
                  {netPnL > 0 ? '+' : ''}{netPnL.toFixed(2)}
                </Text>
              </Box>
            </HStack>
            
            <HStack>
              <Icon as={FiTarget} color="blue.400" boxSize={6} />
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">R:R ORANI</Text>
                <Text fontSize="2xl" fontWeight="bold" fontFamily="mono">
                  1:{rrRatio.toFixed(2)}
                </Text>
              </Box>
            </HStack>
          </HStack>
        </Box>

        <Divider />

        {/* SECTION 3: PSYCHOLOGY & NOTES */}
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
          <GridItem>
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} letterSpacing="wide">İŞLEM NOTLARI</FormLabel>
              <Textarea 
                {...register('notes')} 
                placeholder="Analiz, düşünceler, hatalar..." 
                bg={inputBg} 
                minH="120px" 
                fontFamily="mono"
                fontSize="sm"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <VStack spacing={6} align="stretch" h="full" justify="center">
              <FormControl>
                <HStack justify="space-between" mb={2}>
                  <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} m={0}>DUYGU PUANI</FormLabel>
                  <Badge colorScheme={watch('emotionScore') && watch('emotionScore')! >= 4 ? 'green' : 'yellow'}>
                    {watch('emotionScore')}/5
                  </Badge>
                </HStack>
                <Slider 
                  defaultValue={3} 
                  min={1} 
                  max={5} 
                  step={1} 
                  onChange={(v) => setValue('emotionScore', v)}
                >
                  <SliderTrack bg={useColorModeValue('gray.200', 'gray.700')}>
                    <SliderFilledTrack bg="brand.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={4} />
                </Slider>
              </FormControl>

              <FormControl>
                <HStack justify="space-between" mb={2}>
                  <FormLabel fontSize="xs" fontWeight="bold" color={labelColor} m={0}>DİSİPLİN PUANI</FormLabel>
                  <Badge colorScheme={watch('disciplineScore') && watch('disciplineScore')! >= 4 ? 'green' : 'yellow'}>
                    {watch('disciplineScore')}/5
                  </Badge>
                </HStack>
                <Slider 
                  defaultValue={3} 
                  min={1} 
                  max={5} 
                  step={1} 
                  onChange={(v) => setValue('disciplineScore', v)}
                >
                  <SliderTrack bg={useColorModeValue('gray.200', 'gray.700')}>
                    <SliderFilledTrack bg="purple.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={4} />
                </Slider>
              </FormControl>
            </VStack>
          </GridItem>
        </Grid>

        {/* ACTIONS */}
        <HStack spacing={4} justify="flex-end" pt={4}>
          <Button variant="ghost" size="lg" onClick={() => navigate('/trades')}>
            İPTAL
          </Button>
          <Button 
            type="submit" 
            colorScheme="brand" 
            size="lg" 
            px={8}
            boxShadow="0 0 15px rgba(56, 189, 248, 0.3)"
            _hover={{ boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)", transform: "translateY(-1px)" }}
          >
            {trade ? 'İŞLEMİ GÜNCELLE' : 'İŞLEMİ KAYDET'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
