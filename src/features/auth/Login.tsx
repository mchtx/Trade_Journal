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
  Link,
  useToast,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
  Card,
  CardBody,
  useColorModeValue,
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
        title: 'ACCESS GRANTED',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      let description = error.message;
      
      if (error.message.includes('Email not confirmed')) {
        description = 'Please confirm your email address.';
      } else if (error.message.includes('Invalid login credentials')) {
        description = 'Invalid credentials.';
      }

      toast({
        title: 'ACCESS DENIED',
        description: description,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const headingColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'rgba(22, 27, 34, 0.8)');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="md">
        <Stack spacing={8} mx={'auto'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} letterSpacing="tight" color={headingColor}>TERMINAL ACCESS</Heading>
            <Text fontSize={'lg'} color={'gray.400'} fontFamily="mono">
              SECURE LOGIN
            </Text>
          </Stack>
          <Card variant="outline" borderColor={borderColor} bg={cardBg}>
            <CardBody p={8}>
              <Stack spacing={4} as="form" onSubmit={handleLogin}>
                <FormControl id="email">
                  <FormLabel color="gray.400" fontSize="xs" letterSpacing="wide">EMAIL ADDRESS</FormLabel>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fontFamily="mono"
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel color="gray.400" fontSize="xs" letterSpacing="wide">PASSWORD</FormLabel>
                  <InputGroup>
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      fontFamily="mono"
                    />
                    <InputRightElement h={'full'}>
                      <IconButton
                        variant={'ghost'}
                        onClick={() => setShowPassword((show) => !show)}
                        aria-label={showPassword ? 'Hide' : 'Show'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        size="sm"
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
                    <Link color={'brand.400'} fontSize="sm">Forgot password?</Link>
                  </Stack>
                  <Button
                    colorScheme="brand"
                    type="submit"
                    isLoading={loading}
                    loadingText="AUTHENTICATING..."
                    boxShadow="0 0 20px rgba(56, 189, 248, 0.2)"
                  >
                    LOGİN
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'} fontSize="sm" color="gray.500">
                    New user? <Link as={RouterLink} to="/signup" color={'brand.400'}>Create account</Link>
                  </Text>
                </Stack>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
