import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from './theme'
import Routes from './routes'
import { useSettingsStore, useCalculatorStore, useTradeStore, useRuleStore } from '@context/store'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'

function App() {
  const { loadSettings } = useSettingsStore()
  const { initUser } = useCalculatorStore()
  const { loadTrades } = useTradeStore()
  const { loadRules } = useRuleStore()

  useEffect(() => {
    loadSettings()
    initUser()
    loadTrades()
    loadRules()
  }, [loadSettings, initUser, loadTrades, loadRules])

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
