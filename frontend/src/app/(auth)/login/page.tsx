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

interface LoginResponse {
  statusCode: number
  data: any
  message: string
  success: boolean,
  accessToken: string
}

const Login: React.FC = () => {

  const toast = useToast()
  const dispatch = useDispatch()
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const {textColor, secondaryTextColor, inputBg, inputTextColor, borderColor} = useThemeColors()


  const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => myQuery.login(credentials),
    onSuccess: (data) => {
      const user = data?.data?.user
      dispatch(setAuth({ user: { username: user?.username, email: user?.email, fullName: user?.fullName, avatarImage: user?.avatar }, token: data?.data?.accessToken }))
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

    onError: (error) => {
      toast({
        title: 'Login Failed',
        description: error.message,
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
    <Flex>
      <Box width={'50%'} p={0}>
        <Image src={loginImage} alt='' width={1000} className='w-full' />
      </Box>
      <Box w="50%" mx="auto" mt={8} className='flex flex-col justify-center'>
        <Text textAlign={'center'} fontSize={'3xl'} color={textColor}>Login</Text>
        <form onSubmit={handleSubmit} className='px-20'  >
          <VStack spacing={4} alignContent={'center'} >
            <FormControl isRequired>
              <FormLabel color={secondaryTextColor}>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg={inputBg}
                py={"22px"}
                                color={inputTextColor}


              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color={secondaryTextColor}>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg={inputBg}
                py={"22px"}
                color={inputTextColor}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color={secondaryTextColor}>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg={inputBg}
                py={"22px"}
                                color={inputTextColor}
              />
            </FormControl>
            <Button
              type="submit"
              bg={'black'}
              textColor={'white'}
              border={borderColor}
              _hover={{ bg: 'white', textColor: 'black' }}
              width="full"
              isLoading={loginMutation.isPending}
              py={"23px"}
              my={6}
            >
              Login
            </Button>
            <Text color={textColor}>Dont&apos;have an account? <Link className='underline font-semibold' href={'/register'}>Register</Link></Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  )
}

export default Login
