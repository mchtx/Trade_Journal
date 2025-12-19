import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import theme from './theme'
import Routes from './routes'
import { useSettingsStore, useCalculatorStore } from '@context/store'
import { useEffect } from 'react'

function App() {
  const { loadSettings } = useSettingsStore()
  const { initUser } = useCalculatorStore()

  useEffect(() => {
    loadSettings()
    initUser() // Supabase'e bağlan
  }, [loadSettings, initUser])

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
