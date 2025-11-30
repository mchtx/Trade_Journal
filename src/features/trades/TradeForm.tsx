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
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Trade } from '../../types'
import { useTradeStore } from '@context/store'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const TradeSchema = z.object({
  symbol: z.string().min(1, 'Sembol gerekli'),
  direction: z.enum(['long', 'short']),
  entryPrice: z.coerce.number().positive('Giriş fiyatı pozitif olmalı'),
  exitPrice: z.coerce.number().positive('Çıkış fiyatı pozitif olmalı'),
  positionSize: z.coerce.number().optional(),
  entryTime: z.string().min(1, 'Giriş saati gerekli'),
  exitTime: z.string().min(1, 'Çıkış saati gerekli'),
  stopLoss: z.coerce.number().optional(),
  takeProfit: z.coerce.number().optional(),
  strategyTag: z.string().min(1, 'Strateji etiketi gerekli'),
  notes: z.string().min(5, 'Not minimum 5 karakter olmalı'),
  emotionScore: z.coerce.number().min(1).max(5),
  disciplineScore: z.coerce.number().min(1).max(5),
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

  const trade = tradeId ? getTrade(tradeId) : null

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TradeFormData>({
    resolver: zodResolver(TradeSchema),
    defaultValues: trade
      ? {
          symbol: trade.symbol,
          direction: trade.direction,
          entryPrice: trade.entryPrice,
          exitPrice: trade.exitPrice,
          positionSize: trade.positionSize,
          entryTime: trade.entryTime.slice(0, 16),
          exitTime: trade.exitTime.slice(0, 16),
          stopLoss: trade.stopLoss,
          takeProfit: trade.takeProfit,
          strategyTag: trade.strategyTag,
          notes: trade.notes,
          emotionScore: trade.emotionScore,
          disciplineScore: trade.disciplineScore,
          excludeFromStats: trade.excludeFromStats,
        }
      : {
          direction: 'long',
          emotionScore: 3,
          disciplineScore: 3,
          excludeFromStats: false,
        },
  })

  const onSubmit = (data: TradeFormData) => {
    try {
      if (trade) {
        updateTrade(trade.id, {
          ...data,
          entryTime: new Date(data.entryTime).toISOString(),
          exitTime: new Date(data.exitTime).toISOString(),
        })
        toast({
          title: 'Başarılı',
          description: 'İşlem güncellendi',
          status: 'success',
        })
      } else {
        const newTrade: Trade = {
          id: Date.now().toString(),
          ...data,
          entryTime: new Date(data.entryTime).toISOString(),
          exitTime: new Date(data.exitTime).toISOString(),
          screenshots: [],
          excludeFromStats: data.excludeFromStats ?? false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        addTrade(newTrade)
        toast({
          title: 'Başarılı',
          description: 'İşlem eklendi',
          status: 'success',
        })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/trades')
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'İşlem kaydedilemedi',
        status: 'error',
      })
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align="stretch">
        {/* Sembol */}
        <FormControl isInvalid={!!errors.symbol}>
          <FormLabel>Sembol/Çift</FormLabel>
          <Input placeholder="EURUSD, AAPL" {...register('symbol')} />
          <FormErrorMessage>{errors.symbol?.message}</FormErrorMessage>
        </FormControl>

        {/* Yön */}
        <FormControl>
          <FormLabel>Yön</FormLabel>
          <Select {...register('direction')}>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </Select>
        </FormControl>

        {/* Fiyatlar */}
        <HStack spacing={4}>
          <FormControl isInvalid={!!errors.entryPrice}>
            <FormLabel>Giriş Fiyatı</FormLabel>
            <NumberInput>
              <NumberInputField {...register('entryPrice')} />
            </NumberInput>
            <FormErrorMessage>{errors.entryPrice?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.exitPrice}>
            <FormLabel>Çıkış Fiyatı</FormLabel>
            <NumberInput>
              <NumberInputField {...register('exitPrice')} />
            </NumberInput>
            <FormErrorMessage>{errors.exitPrice?.message}</FormErrorMessage>
          </FormControl>
        </HStack>

        {/* SL/TP */}
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Stop Loss (İsteğe bağlı)</FormLabel>
            <NumberInput>
              <NumberInputField {...register('stopLoss')} />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Take Profit (İsteğe bağlı)</FormLabel>
            <NumberInput>
              <NumberInputField {...register('takeProfit')} />
            </NumberInput>
          </FormControl>
        </HStack>

        {/* Pozisyon Boyutu */}
        <FormControl>
          <FormLabel>Pozisyon Boyutu (İsteğe bağlı)</FormLabel>
          <NumberInput>
            <NumberInputField {...register('positionSize')} />
          </NumberInput>
        </FormControl>

        {/* Saatler */}
        <HStack spacing={4}>
          <FormControl isInvalid={!!errors.entryTime}>
            <FormLabel>Giriş Saati</FormLabel>
            <Input type="datetime-local" {...register('entryTime')} />
            <FormErrorMessage>{errors.entryTime?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.exitTime}>
            <FormLabel>Çıkış Saati</FormLabel>
            <Input type="datetime-local" {...register('exitTime')} />
            <FormErrorMessage>{errors.exitTime?.message}</FormErrorMessage>
          </FormControl>
        </HStack>

        {/* Strateji */}
        <FormControl isInvalid={!!errors.strategyTag}>
          <FormLabel>Strateji Etiketi</FormLabel>
          <Input placeholder="Scalping, Swing, vb." {...register('strategyTag')} />
          <FormErrorMessage>{errors.strategyTag?.message}</FormErrorMessage>
        </FormControl>

        {/* Notlar */}
        <FormControl isInvalid={!!errors.notes}>
          <FormLabel>Notlar (Zorunlu)</FormLabel>
          <Textarea
            placeholder="İşlem hakkında detaylı notlar..."
            minH="120px"
            {...register('notes')}
          />
          <FormErrorMessage>{errors.notes?.message}</FormErrorMessage>
        </FormControl>

        {/* Puanlar */}
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Duygu Puanı (1-5)</FormLabel>
            <Select {...register('emotionScore')}>
              {[1, 2, 3, 4, 5].map(i => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Disiplin Puanı (1-5)</FormLabel>
            <Select {...register('disciplineScore')}>
              {[1, 2, 3, 4, 5].map(i => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </FormControl>
        </HStack>

        {/* Butonlar */}
        <HStack spacing={4} pt={4}>
          <Button type="submit" colorScheme="brand">
            {trade ? 'Güncelle' : 'Kaydet'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/trades')}>
            İptal
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
