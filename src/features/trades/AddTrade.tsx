import { Box, Heading, Card, CardBody, useColorModeValue } from '@chakra-ui/react'
import TradeForm from './TradeForm'

export default function AddTrade() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box maxW="600px">
      <Heading mb={6}>Yeni İşlem Ekle</Heading>
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <TradeForm />
        </CardBody>
      </Card>
    </Box>
  )
}
