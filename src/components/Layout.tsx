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
  { label: 'Analitik', path: '/analytics' },
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

  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const navBgColor = useColorModeValue('gray.50', 'gray.800')

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
          >
            {item.label}
          </Button>
        </Link>
      ))}
      <Divider my={2} />
      <Button
        w="full"
        variant="ghost"
        colorScheme="red"
        onClick={handleLogout}
        justifyContent="flex-start"
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
        borderBottomWidth="1px"
        borderColor={borderColor}
        px={4}
        py={4}
      >
        <HStack justify="space-between">
          <HStack>
            <IconButton
              aria-label="Menu"
              icon={<HamburgerIcon />}
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
            />
            <Text fontSize="2xl" fontWeight="bold" color="brand.500">
              📊 Trading Journal
            </Text>
          </HStack>

          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.500">
              {trades.length} işlem
            </Text>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </HStack>
        </HStack>
      </Box>

      {/* Main Content */}
      <Flex flex={1} overflow="hidden">
        {/* Desktop Sidebar */}
        <Box
          display={{ base: 'none', md: 'block' }}
          w="250px"
          bg={navBgColor}
          borderRightWidth="1px"
          borderColor={borderColor}
          p={4}
          overflowY="auto"
        >
          <NavContent />
        </Box>

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody pt={8}>
              <NavContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Page Content */}
        <Box flex={1} overflow="auto" w="full">
          <Box p={{ base: 4, md: 6 }} maxW="2000px">
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}
