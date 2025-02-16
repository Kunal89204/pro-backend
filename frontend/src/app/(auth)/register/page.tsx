"use client"
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { FormEvent,  useState } from 'react'
import loginImage from "../../../../public/assets/login_image.jpg"
import { useMutation} from '@tanstack/react-query'
import { myQuery } from '@/api/query'
import Link from 'next/link'


const Register: React.FC = () => {
    const [fullName, setFullName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const credentials = { fullName, username, email, password }

    const handleRegister = useMutation({
        mutationFn: () => myQuery.register(credentials),
        onSuccess: () => {
            window.location.href = '/login'
        }
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleRegister.mutate()
    }
    return (
        <Flex>
            <Box width={"50%"} >
                <Image src={loginImage} alt='' width={1000} />
            </Box>

            <Box w="50%" mx="auto" mt={8} className='flex flex-col justify-center'>
                <Text textAlign={'center'} fontSize={'3xl'}>Register</Text>
                <form action="" onSubmit={handleSubmit} className='px-20'>
                    <VStack spacing={4} alignContent={'center'}>
                        <FormControl isRequired>
                            <FormLabel>
                                FullName
                            </FormLabel>
                            <Input
                                type='text'
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                bg={'white'}
                                py={"22px"}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>
                                Username
                            </FormLabel>
                            <Input
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                bg={'white'}
                                py={"22px"}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>
                                Email
                            </FormLabel>
                            <Input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                bg={'white'}
                                py={"22px"}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>
                                Password
                            </FormLabel>
                            <Input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                bg={'white'}
                                py={"22px"}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            bg={'black'}
                            textColor={'white'}
                            border={'1px solid gray'}
                            _hover={{ bg: 'white', textColor: 'black' }}
                            width="full"
                            //   isLoading={loginMutation.isPending}
                            py={"23px"}
                            my={6}
                        >
                            Register
                        </Button>
                        <Text>Dont&apos;have an account? <Link className='underline font-semibold' href={'/login'}>Login</Link></Text>
                    </VStack>

                </form>
            </Box>
        </Flex>
    )
}

export default Register
