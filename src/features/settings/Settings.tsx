import {
  VStack,
  Box,
  Heading,
  Card,
  CardBody,
  Button,
  HStack,
  FormControl,
  FormLabel,
  Switch,
  useColorModeValue,
  useToast,
  Text,
  SimpleGrid,
} from '@chakra-ui/react'
import { useSettingsStore } from '@context/store'
import { tradesStorage } from '@utils/storage'
import { useTradeStore } from '@context/store'
import { useRef } from 'react'

export default function Settings() {
  const { settings, updateSettings } = useSettingsStore()
  const { trades, loadTrades } = useTradeStore()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleExportJSON = () => {
    const data = tradesStorage.export()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trading-journal-${new Date().toISOString().split('T')[0]}.json`
    a.click()

    toast({
      title: 'Başarılı',
      description: 'İşlemler dışa aktarıldı',
      status: 'success',
    })
  }

  const handleImportJSON = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const content = e.target?.result as string
        const success = tradesStorage.import(content)

        if (success) {
          loadTrades()
          toast({
            title: 'Başarılı',
            description: 'İşlemler içe aktarıldı',
            status: 'success',
          })
        } else {
          throw new Error('Geçersiz dosya formatı')
        }
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Dosya içe aktarılamadı',
          status: 'error',
        })
      }
    }
    reader.readAsText(file)
  }

  const handleBackupData = () => {
    const backup = {
      trades: trades,
      settings: settings,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trading-journal-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()

    toast({
      title: 'Başarılı',
      description: 'Yedek alındı',
      status: 'success',
    })
  }

  return (
    <VStack spacing={8} align="stretch">
      <Heading>Ayarlar</Heading>

      {/* Veri Yönetimi */}
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" mb={2}>
                💾 Veri Yönetimi
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                İşlemlerinizi yedekleyin ve başka cihazlardan içe aktarın
              </Text>
            </Box>

            <SimpleGrid columns={2} spacing={4}>
              <Button
                colorScheme="blue"
                onClick={handleExportJSON}
              >
                JSON Olarak Dışa Aktar
              </Button>

              <Button
                colorScheme="blue"
                variant="outline"
                onClick={handleImportJSON}
              >
                JSON Dosyasından İçe Aktar
              </Button>

              <Button
                colorScheme="green"
                onClick={handleBackupData}
              >
                Tam Yedek Al
              </Button>

              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => {
                  if (window.confirm('Tüm işlemler silinecek. Emin misiniz?')) {
                    tradesStorage.clear()
                    loadTrades()
                    toast({
                      title: 'Başarılı',
                      description: 'Tüm işlemler silindi',
                      status: 'success',
                    })
                  }
                }}
              >
                Tüm İşlemleri Sil
              </Button>
            </SimpleGrid>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              hidden
              onChange={handleFileSelect}
            />
          </VStack>
        </CardBody>
      </Card>

      {/* İstatistikler */}
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md">📊 İstatistikler</Heading>
            <HStack justify="space-between">
              <Text>Toplam İşlem Sayısı:</Text>
              <Text fontWeight="bold">{trades.length}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Son Güncelleme:</Text>
              <Text fontSize="sm">
                {trades.length > 0
                  ? new Date(trades[trades.length - 1].createdAt).toLocaleDateString('tr-TR')
                  : 'Henüz işlem yok'}
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Sistem Bilgileri */}
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md">ℹ️ Sistem Bilgileri</Heading>
            <HStack justify="space-between">
              <Text>LocalStorage Kullanımı:</Text>
              <Text fontSize="sm">
                {Math.round(
                  new Blob([JSON.stringify(localStorage)]).size / 1024
                )}{' '}
                KB
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              Trading Journal v1.0.0
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
