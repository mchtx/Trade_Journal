import {
  Box,
  Flex,
  VStack,
  HStack,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Text,
  Divider,
} from '@chakra-ui/react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { useTradeStore } from '@context/store'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'İşlemler', path: '/trades' },
  { label: 'Analitık', path: '/analytics' },
  { label: 'Günlük', path: '/daily-journal' },
  { label: 'Kurallar', path: '/rules' },
  { label: '💰 Hesaplayıcı', path: '/calculator' },
  { label: 'Ayarlar', path: '/settings' },
]

export default function Layout() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const location = useLocation()
  const navigate = useNavigate()
  const { loadTrades, trades } = useTradeStore()
  const { signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTrades()
    setIsLoading(false)
  }, [loadTrades])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(22, 27, 34, 0.6)')
  const borderColor = useColorModeValue('gray.200', 'rgba(255, 255, 255, 0.08)')
  const navBgColor = useColorModeValue('gray.50', 'rgba(22, 27, 34, 0.4)')
  const textColor = useColorModeValue('#1A1A1A', '#E0E0E0')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')

  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Text>Yükleniyor...</Text>
      </Flex>
    )
  }

  const NavContent = () => (
    <VStack spacing={2} align="stretch" w="full">
      {navItems.map((item) => (
        <Link key={item.path} to={item.path}>
          <Button
            w="full"
            variant={location.pathname === item.path ? 'solid' : 'ghost'}
            colorScheme="brand"
            onClick={onClose}
            justifyContent="flex-start"
            _hover={{
              bg: useColorModeValue('gray.200', 'whiteAlpha.100'),
              transform: 'translateX(4px)',
            }}
            transition="all 0.2s"
            color={location.pathname === item.path ? 'white' : textColor}
          >
            {item.label}
          </Button>
        </Link>
      ))}
      <Divider my={2} borderColor={borderColor} />
      <Button
        w="full"
        variant="ghost"
        colorScheme="red"
        onClick={handleLogout}
        justifyContent="flex-start"
        _hover={{ bg: useColorModeValue('red.50', 'whiteAlpha.100') }}
      >
        Çıkış Yap
      </Button>
    </VStack>
  )

  return (
    <Flex h="100vh" flexDirection="column">
      {/* Header */}
      <Box
        bg={bgColor}
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor={borderColor}
        px={6}
        py={4}
        position="sticky"
        top={0}
        zIndex={100}
      >
        <HStack justify="space-between">
          <HStack spacing={4}>
            <IconButton
              aria-label="Menu"
              icon={<HamburgerIcon />}
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              variant="ghost"
            />
            <Text 
              fontSize="2xl" 
              fontWeight="700" 
              letterSpacing="tight"
              bgGradient="linear(to-r, brand.400, brand.200)"
              bgClip="text"
            >
              TRADING TERMINAL
            </Text>
          </HStack>

          <HStack spacing={4}>
            <Box 
              px={3} 
              py={1} 
              bg={useColorModeValue('gray.100', 'whiteAlpha.100')}
              borderRadius="full" 
              border="1px solid" 
              borderColor={borderColor}
            >
              <Text fontSize="xs" fontFamily="mono" color={useColorModeValue('brand.600', 'brand.300')}>
                {trades.length} TRADES
              </Text>
            </Box>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
            />
          </HStack>
        </HStack>
      </Box>

      {/* Main Content */}
      <Flex flex={1} overflow="hidden">
        {/* Desktop Sidebar */}
        <Box
          display={{ base: 'none', md: 'block' }}
          w="260px"
          bg={navBgColor}
          backdropFilter="blur(12px)"
          borderRight="1px solid"
          borderColor={borderColor}
          p={6}
          overflowY="auto"
        >
          <NavContent />
        </Box>

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay backdropFilter="blur(4px)" />
          <DrawerContent bg={useColorModeValue('white', '#161b22')}>
            <DrawerCloseButton />
            <DrawerBody pt={8}>
              <NavContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Page Content */}
        <Box flex={1} overflow="auto" w="full" position="relative">
          <Box p={{ base: 4, md: 8 }} maxW="1800px" mx="auto">
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}
