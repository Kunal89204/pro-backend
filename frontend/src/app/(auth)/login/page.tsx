'use client'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
  Container,
  useBreakpointValue,
} from '@chakra-ui/react'
import { myQuery } from '../../../api/query'
import { useDispatch } from 'react-redux'
import { setAuth } from '@/lib/slices/authSlice'
import Image from 'next/image'
import loginImage from "../../../../public/assets/login_image.jpg"
import Link from 'next/link'
import { useThemeColors } from '@/hooks/useThemeColors'

interface LoginCredentials {
  username: string
  email: string
  password: string
}

interface User {
  _id: string
  fullName: string
  username: string
  email: string
  avatar: string
  coverImage: string
  createdAt: string
  updatedAt: string
  wathcedVideos: string[]
  __v: number
}

interface UserData {
  accessToken: string
  user: User
}

interface LoginResponse {
  statusCode: number
  data: UserData
  message: string
  success: boolean
  accessToken: string
}

// Custom type for Axios error shape
interface AxiosErrorData {
  message?: string
}

interface AxiosErrorResponse {
  data?: AxiosErrorData
}

interface TypedError {
  response?: AxiosErrorResponse
}

const Login: React.FC = () => {
  const toast = useToast()
  const dispatch = useDispatch()
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { textColor, secondaryTextColor, inputBg, inputTextColor, borderColor } = useThemeColors()

  // Responsive values
  const showImage = useBreakpointValue({ base: false, md: true })
  const formWidth = useBreakpointValue({ base: '100%', md: '50%' })
  
  const containerMaxW = useBreakpointValue({ base: '100%', md: 'container.xl' })

  const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => myQuery.login(credentials),
    onSuccess: (data) => {
      const user = data?.data?.user
      dispatch(
        setAuth({
          user: {
            username: user?.username,
            email: user?.email,
            fullName: user?.fullName,
            avatarImage: user?.avatar,
            _id: user?._id,
          },
          token: data?.data?.accessToken,
        })
      )
      console.log("i am received data", data)
      window.location.href = '/'
      toast({
        title: 'Login Successful',
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError: (error: unknown) => {
      let errorMessage = 'An unknown error occurred'
      // Type guard for TypedError
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const err = error as TypedError
        if (
          err.response &&
          typeof err.response === 'object' &&
          err.response.data &&
          typeof err.response.data === 'object' &&
          'message' in err.response.data &&
          typeof err.response.data.message === 'string'
        ) {
          errorMessage = err.response.data.message as string
          console.log('There is an error with login', err.response.data)
        } else {
          console.log('There is an error with login', error)
        }
      } else {
        console.log('There is an error with login', error)
      }
      toast({
        title: 'Login Failed',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ username, email, password })
  }

  return (
    <Flex
      minH="100vh"
      w="100%"
      direction={{ base: 'column', md: 'row' }}
      bg={useBreakpointValue({ base: inputBg, md: 'transparent' })}
    >
      {showImage && (
        <Box
          width={{ base: '100%', md: '50%' }}
          position="relative"
          display={{ base: 'none', md: 'block' }}
        >
          <Image
            src={loginImage}
            alt="Login background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </Box>
      )}
      
      <Container
        maxW={containerMaxW}
        w={formWidth}
        mx="auto"
        py={{ base: 8, md: 0 }}
        px={{ base: 4, md: 0 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          w="full"
          maxW="500px"
          // bg={useBreakpointValue({ base: 'transparent', md: inputBg })}
          p={{ base: 4, md: 8 }}
          borderRadius={{ base: 'none', md: 'xl' }}
          shadow={{ base: 'none', md: 'lg' }}
        >
          <Text
            textAlign="center"
            fontSize={{ base: '2xl', md: '3xl' }}
            color={textColor}
            mb={6}
            fontWeight="bold"
          >
            Welcome Back
          </Text>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color={secondaryTextColor}>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  bg={inputBg}
                  py="22px"
                  color={inputTextColor}
                  borderRadius="lg"
                  _focus={{
                    borderColor: 'purple.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
                  }}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel color={secondaryTextColor}>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg={inputBg}
                  py="22px"
                  color={inputTextColor}
                  borderRadius="lg"
                  _focus={{
                    borderColor: 'purple.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
                  }}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel color={secondaryTextColor}>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg={inputBg}
                  py="22px"
                  color={inputTextColor}
                  borderRadius="lg"
                  _focus={{
                    borderColor: 'purple.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
                  }}
                />
              </FormControl>
              
              <Button
                type="submit"
                bg="black"
                color="white"
                border={borderColor}
                _hover={{ bg: 'white', color: 'black' }}
                width="full"
                isLoading={loginMutation.isPending}
                py="23px"
                my={6}
                borderRadius="lg"
                fontSize="md"
                fontWeight="semibold"
                transition="all 0.2s"
              >
                Login
              </Button>
              
              <Text color={textColor} textAlign="center" fontSize="sm">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-purple-500 hover:text-purple-600 font-semibold transition-colors"
                >
                  Register
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </Container>
    </Flex>
  )
}

export default Login
