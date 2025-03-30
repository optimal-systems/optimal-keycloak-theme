import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#f6f6f6',
      100: '#e6e6e6',
      200: '#d4d4d4',
      300: '#4a5059',
      400: '#50667d',
      500: '#567ca2',
      600: '#5d93c7',
      700: '#5d93c7',
      800: '#5d93c7',
      900: '#5d93c7',
      primary: '#5d93c7',
      secondary: '#4a5059',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          bg: 'brand.primary',
          color: 'white',
          transition: 'all 0.2s ease',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(93, 147, 199, 0.3)',
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0)',
            boxShadow: 'none',
          },
          _disabled: {
            opacity: 0.6,
            cursor: 'not-allowed',
            transform: 'none',
            boxShadow: 'none',
            _hover: {
              bg: 'brand.primary',
              transform: 'none',
              boxShadow: 'none',
            },
          },
        },
      },
    },
  },
});