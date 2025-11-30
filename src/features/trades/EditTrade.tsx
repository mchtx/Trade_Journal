import { Box, Heading, Card, CardBody, useColorModeValue } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import TradeForm from './TradeForm'

export default function EditTrade() {
  const { id } = useParams<{ id: string }>()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (!id) {
    return <Box>İşlem ID bulunamadı</Box>
  }

  return (
    <Box maxW="600px">
      <Heading mb={6}>İşlem Düzenle</Heading>
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <TradeForm tradeId={id} />
        </CardBody>
      </Card>
    </Box>
  )
}
