import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Giriş başarılı',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/');
    } catch (error: any) {
      let description = error.message;
      
      if (error.message.includes('Email not confirmed')) {
        description = 'Lütfen email adresinize gelen onay linkine tıklayın. (Geliştirme ortamındaysanız Supabase panelinden "Confirm email" ayarını kapatabilirsiniz)';
      } else if (error.message.includes('Invalid login credentials')) {
        description = 'Email veya şifre hatalı.';
      }

      toast({
        title: 'Giriş hatası',
        description: description,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgImage="url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2064&auto=format&fit=crop')"
      bgSize="cover"
      bgPosition="center"
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.600"
        backdropFilter="blur(5px)"
      />
      
      <Container maxW="lg" position="relative" zIndex="1">
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} color="white">Trading Journal</Heading>
            <Text fontSize={'lg'} color={'gray.300'}>
              İşlemlerinizi profesyonelce yönetin
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={4} as="form" onSubmit={handleLogin}>
              <FormControl id="email">
                <FormLabel>Email adresi</FormLabel>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Şifre</FormLabel>
                <InputGroup>
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <InputRightElement h={'full'}>
                    <IconButton
                      variant={'ghost'}
                      onClick={() => setShowPassword((show) => !show)}
                      aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                >
                  <Link color={'blue.400'}>Şifremi unuttum?</Link>
                </Stack>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type="submit"
                  isLoading={loading}
                >
                  Giriş Yap
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Hesabınız yok mu? <Link as={RouterLink} to="/signup" color={'blue.400'}>Kayıt Ol</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
