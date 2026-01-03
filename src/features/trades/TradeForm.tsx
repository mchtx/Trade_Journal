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
} from '@chakra-ui/react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Trade } from '../../types'
import { useTradeStore } from '@context/store'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'
import { calculateNetPnL, calculateRealizedRR } from '@utils/calculations'

const TradeSchema = z.object({
  entryTime: z.string().min(1, 'Tarih gerekli'),
  symbol: z.string().min(1, 'Parite gerekli'),
  direction: z.enum(['long', 'short']),
  strategyTag: z.string().min(1, 'Setup seçimi gerekli'),
  entryPrice: z.coerce.number().positive('Giriş fiyatı pozitif olmalı'),
  stopLoss: z.coerce.number().positive('Stop Loss pozitif olmalı'),
  exitPrice: z.coerce.number().positive('Çıkış fiyatı pozitif olmalı'),
  positionSize: z.coerce.number().positive('Miktar pozitif olmalı'),
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
          entryTime: trade.entryTime.slice(0, 10), // YYYY-MM-DD for date input
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

  // Watch values for live calculations
  const watchedValues = useWatch({ control })
  const { direction, entryPrice, exitPrice, stopLoss, positionSize, entryTime } = watchedValues

  // Initialize setup selection
  useEffect(() => {
    if (trade?.strategyTag) {
      if (['Darvas', 'İkinci Talep'].includes(trade.strategyTag)) {
        setSetupSelection(trade.strategyTag)
      } else {
        setSetupSelection('Diğer')
      }
    }
  }, [trade])

  // Handle Setup Change
  const handleSetupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSetupSelection(val)
    if (val !== 'Diğer') {
      setValue('strategyTag', val)
    } else {
      setValue('strategyTag', '')
    }
  }

  // Calculations
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

  const dayName = entryTime ? format(parseISO(entryTime), 'EEEE', { locale: tr }) : ''

  const onSubmit = (data: TradeFormData) => {
    try {
      const tradeData = {
        ...data,
        entryTime: new Date(data.entryTime).toISOString(), // Convert back to ISO
        exitTime: new Date(data.entryTime).toISOString(), // Using same date for simplicity or add exit date field if needed
        // Ensure numbers
        entryPrice: Number(data.entryPrice),
        exitPrice: Number(data.exitPrice),
        stopLoss: Number(data.stopLoss),
        positionSize: Number(data.positionSize),
        takeProfit: 0, // Not used in new form but required by type?
      }

      if (trade) {
        updateTrade(trade.id, tradeData)
        toast({ title: 'Başarılı', description: 'İşlem güncellendi', status: 'success' })
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
        toast({ title: 'Başarılı', description: 'İşlem eklendi', status: 'success' })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/trades')
      }
    } catch (error) {
      console.error(error)
      toast({ title: 'Hata', description: 'İşlem kaydedilemedi', status: 'error' })
    }
  }

  const pnlColor = netPnL >= 0 ? 'green.500' : 'red.500'
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} bg={bgColor} p={6} borderRadius="lg" shadow="sm">
      <VStack spacing={6} align="stretch">
        
        {/* 1. Tarih */}
        <FormControl isInvalid={!!errors.entryTime}>
          <FormLabel>Tarih</FormLabel>
          <HStack>
            <Input type="date" {...register('entryTime')} />
            <Text fontWeight="bold" minW="100px">{dayName}</Text>
          </HStack>
          <FormErrorMessage>{errors.entryTime?.message}</FormErrorMessage>
        </FormControl>

        {/* 2. Parite */}
        <FormControl isInvalid={!!errors.symbol}>
          <FormLabel>Parite (Hisse/Varlık)</FormLabel>
          <Input placeholder="THYAO, GARAN, BTCUSDT..." {...register('symbol')} />
          <FormErrorMessage>{errors.symbol?.message}</FormErrorMessage>
        </FormControl>

        {/* 3. Yön */}
        <FormControl>
          <FormLabel>Yön</FormLabel>
          <Select {...register('direction')}>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </Select>
        </FormControl>

        {/* 4. Setup */}
        <FormControl isInvalid={!!errors.strategyTag}>
          <FormLabel>Setup (Strateji)</FormLabel>
          <VStack align="stretch">
            <Select value={setupSelection} onChange={handleSetupChange}>
              <option value="Darvas">Darvas</option>
              <option value="İkinci Talep">İkinci Talep</option>
              <option value="Diğer">Diğer</option>
            </Select>
            {setupSelection === 'Diğer' && (
              <Input placeholder="Strateji adını giriniz" {...register('strategyTag')} />
            )}
          </VStack>
          <FormErrorMessage>{errors.strategyTag?.message}</FormErrorMessage>
        </FormControl>

        {/* 5. Fiyatlar ve Miktar */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl isInvalid={!!errors.entryPrice}>
            <FormLabel>Giriş Fiyatı</FormLabel>
            <NumberInput min={0}>
              <NumberInputField {...register('entryPrice')} />
            </NumberInput>
            <FormErrorMessage>{errors.entryPrice?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.stopLoss}>
            <FormLabel>Stop Loss</FormLabel>
            <NumberInput min={0}>
              <NumberInputField {...register('stopLoss')} />
            </NumberInput>
            <FormErrorMessage>{errors.stopLoss?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.exitPrice}>
            <FormLabel>Çıkış Fiyatı</FormLabel>
            <NumberInput min={0}>
              <NumberInputField {...register('exitPrice')} />
            </NumberInput>
            <FormErrorMessage>{errors.exitPrice?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.positionSize}>
            <FormLabel>Miktar (Lot/Adet)</FormLabel>
            <NumberInput min={1}>
              <NumberInputField {...register('positionSize')} />
            </NumberInput>
            <FormErrorMessage>{errors.positionSize?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        {/* Canlı Hesaplamalar */}
        <SimpleGrid columns={2} spacing={4} p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
          <Stat>
            <StatLabel>Net Kâr/Zarar</StatLabel>
            <StatNumber color={pnlColor}>{netPnL.toFixed(2)}</StatNumber>
            <StatHelpText>Tahmini</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Risk/Ödül (R:R)</StatLabel>
            <StatNumber>1:{rrRatio.toFixed(2)}</StatNumber>
            <StatHelpText>Gerçekleşen</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Notlar (Opsiyonel ama iyi olur) */}
        <FormControl>
          <FormLabel>Notlar</FormLabel>
          <Textarea {...register('notes')} placeholder="İşlem notları..." />
        </FormControl>

        {/* Butonlar */}
        <HStack spacing={4} pt={4}>
          <Button type="submit" colorScheme="brand" size="lg" width="full">
            {trade ? 'Güncelle' : 'Kaydet'}
          </Button>
          <Button variant="outline" size="lg" width="full" onClick={() => navigate('/trades')}>
            İptal
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
