import { Box, Heading, Card, CardBody, useColorModeValue, Container } from '@chakra-ui/react'
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
    <Container maxW="container.xl">
      <Heading mb={6} size="lg" letterSpacing="tight">İŞLEMİ DÜZENLE</Heading>
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px" variant="outline">
        <CardBody p={0}>
          <TradeForm tradeId={id} />
        </CardBody>
      </Card>
    </Container>
  )
}
