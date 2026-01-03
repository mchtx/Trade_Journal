import { Box, Heading, Card, CardBody, useColorModeValue, Container } from '@chakra-ui/react'
import TradeForm from './TradeForm'

export default function AddTrade() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Container maxW="container.xl">
      <Heading mb={6} size="lg" letterSpacing="tight">YENİ İŞLEM GİRİŞİ</Heading>
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px" variant="outline">
        <CardBody p={0}>
          <TradeForm />
        </CardBody>
      </Card>
    </Container>
  )
}
