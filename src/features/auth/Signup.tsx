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
  Card,
  CardBody,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: 'ERROR',
        description: 'Password must be at least 6 characters.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      if (data.session) {
        toast({
          title: 'REGISTRATION SUCCESSFUL',
          description: 'Access granted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/');
      } else {
        toast({
          title: 'REGISTRATION SUCCESSFUL',
          description: 'Please confirm your email address.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: 'REGISTRATION FAILED',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const headingColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'rgba(22, 27, 34, 0.8)');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const labelColor = useColorModeValue('gray.600', 'gray.400');

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
            <Heading fontSize={'4xl'} letterSpacing="tight" color={headingColor}>NEW TRADER</Heading>
            <Text fontSize={'lg'} color={subTextColor} fontFamily="mono">
              INITIALIZE ACCOUNT
            </Text>
          </Stack>
          <Card variant="outline" borderColor={borderColor} bg={cardBg}>
            <CardBody p={8}>
              <Stack spacing={4} as="form" onSubmit={handleSignup}>
                <FormControl id="email">
                  <FormLabel color={labelColor} fontSize="xs" letterSpacing="wide">EMAIL ADDRESS</FormLabel>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fontFamily="mono"
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel color={labelColor} fontSize="xs" letterSpacing="wide">PASSWORD</FormLabel>
                  <InputGroup>
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      fontFamily="mono"
                    />
                    <InputRightElement h={'full'}>
                      <IconButton
                        variant={'ghost'}
                        onClick={() => setShowPassword((show) => !show)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    bg={'blue.500'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.600',
                    }}
                    type="submit"
                    isLoading={loading}
                    fontFamily="mono"
                    fontWeight="normal"
                  >
                    REGISTER
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'} fontSize="sm" color={subTextColor}>
                    Already have an account? <Link as={RouterLink} to="/login" color={'blue.400'}>Login</Link>
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
