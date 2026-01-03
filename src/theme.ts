import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
    mono: `'JetBrains Mono', monospace`,
  },
  colors: {
    bg: {
      900: '#0A0E14', // Deep Navy Blue
      800: '#161b22', // Slightly lighter for cards
    },
    trade: {
      profit: '#4ADE80', // Muted Green
      loss: '#F43F5E',   // Soft Crimson
      accent: '#38BDF8', // Light Blue for highlights
    },
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c3d66',
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('gray.50', 'transparent')(props),
        color: mode('#1A1A1A', '#E0E0E0')(props), // Adaptive Text Color
      },
    }),
  },
  components: {
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: mode('white', 'rgba(22, 27, 34, 0.6)')(props),
          backdropFilter: 'blur(12px)',
          border: '1px solid',
          borderColor: mode('gray.200', 'rgba(255, 255, 255, 0.08)')(props),
          boxShadow: mode('sm', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)')(props),
          borderRadius: '12px',
          color: mode('#1A1A1A', '#E0E0E0')(props),
        },
      }),
    },
    Button: {
      baseStyle: {
        borderRadius: '8px',
        fontWeight: '600',
        _focus: {
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
        },
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s',
        }),
        ghost: (props: any) => ({
          color: mode('gray.600', 'gray.300')(props),
          _hover: {
            bg: mode('gray.100', 'whiteAlpha.100')(props),
            color: mode('brand.600', 'white')(props),
          },
        }),
      },
    },
    Input: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: mode('gray.100', 'rgba(0, 0, 0, 0.2)')(props),
            border: '1px solid',
            borderColor: mode('gray.200', 'rgba(255, 255, 255, 0.05)')(props),
            color: mode('#1A1A1A', '#E0E0E0')(props),
            _hover: {
              bg: mode('gray.200', 'rgba(0, 0, 0, 0.3)')(props),
            },
            _focus: {
              bg: mode('white', 'rgba(0, 0, 0, 0.4)')(props),
              borderColor: 'brand.400',
            },
            borderRadius: '8px',
            _placeholder: {
              color: mode('gray.500', 'gray.500')(props),
            },
          },
        }),
        outline: (props: any) => ({
          field: {
            bg: mode('white', 'rgba(0, 0, 0, 0.2)')(props),
            border: '1px solid',
            borderColor: mode('gray.200', 'rgba(255, 255, 255, 0.1)')(props),
            color: mode('#1A1A1A', '#E0E0E0')(props),
            borderRadius: '8px',
            _focus: {
              borderColor: 'brand.400',
              boxShadow: '0 0 0 1px #38bdf8',
            },
          },
        }),
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Select: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: mode('gray.100', 'rgba(0, 0, 0, 0.2)')(props),
            border: '1px solid',
            borderColor: mode('gray.200', 'rgba(255, 255, 255, 0.05)')(props),
            color: mode('#1A1A1A', '#E0E0E0')(props),
            borderRadius: '8px',
            _hover: {
              bg: mode('gray.200', 'rgba(0, 0, 0, 0.3)')(props),
            },
            _focus: {
              bg: mode('white', 'rgba(0, 0, 0, 0.4)')(props),
              borderColor: 'brand.400',
            },
          },
        }),
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Stat: {
      baseStyle: (props: any) => ({
        label: {
          color: mode('gray.600', 'gray.400')(props),
          fontSize: 'sm',
          fontWeight: 'medium',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
        },
        number: {
          fontFamily: 'mono',
          fontWeight: 'bold',
          color: mode('#1A1A1A', '#E0E0E0')(props),
        },
        helpText: {
          color: mode('gray.500', 'gray.500')(props),
        },
      }),
    },
    Table: {
      variants: {
        simple: (props: any) => ({
          th: {
            borderColor: mode('gray.200', 'whiteAlpha.100')(props),
            color: mode('gray.600', 'gray.400')(props),
            fontFamily: 'Inter',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            fontSize: 'xs',
          },
          td: {
            borderColor: mode('gray.200', 'whiteAlpha.100')(props),
            fontFamily: 'mono',
            color: mode('#1A1A1A', '#E0E0E0')(props),
          },
        }),
      },
    },
    Modal: {
      baseStyle: (props: any) => ({
        dialog: {
          bg: mode('white', '#161b22')(props),
          border: '1px solid',
          borderColor: mode('gray.200', 'rgba(255, 255, 255, 0.1)')(props),
          color: mode('#1A1A1A', '#E0E0E0')(props),
        },
      }),
    },
    Menu: {
      baseStyle: (props: any) => ({
        list: {
          bg: mode('white', '#161b22')(props),
          border: '1px solid',
          borderColor: mode('gray.200', 'rgba(255, 255, 255, 0.1)')(props),
          boxShadow: mode('lg', 'dark-lg')(props),
        },
        item: {
          bg: 'transparent',
          color: mode('#1A1A1A', '#E0E0E0')(props),
          _hover: {
            bg: mode('gray.100', 'whiteAlpha.100')(props),
          },
        },
      }),
    },
  },
})

export default theme

