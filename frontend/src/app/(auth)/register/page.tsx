"use client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Container,
  useBreakpointValue,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import loginImage from "../../../../public/assets/login_image.jpg";
import { useMutation } from "@tanstack/react-query";
import { myQuery } from "@/api/query";
import Link from "next/link";
import { useThemeColors } from "@/hooks/useThemeColors";

const Register: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { borderColor, textColor,  inputBg, secondaryTextColor } = useThemeColors();
  const toast = useToast();

  // Responsive values
  const showImage = useBreakpointValue({ base: false, md: true });
  const formWidth = useBreakpointValue({ base: '100%', md: '50%' });
  const containerMaxW = useBreakpointValue({ base: '100%', md: 'container.xl' });

  const credentials = { fullName, username, email, password };

  const handleRegister = useMutation({
    mutationFn: () => myQuery.register(credentials),
    onSuccess: () => {
      toast({
        title: 'Registration Successful',
        description: 'Please login with your credentials',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      window.location.href = "/login";
    },
    onError: () => {
      toast({
        title: 'Registration Failed',
        description:  'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleRegister.mutate();
  };

  return (
    <Flex
      minH="100vh"
      w="100%"
      direction={{ base: 'column', md: 'row' }}
      bg={useColorModeValue("gray.50", "black")}
    >
      {showImage && (
        <Box
          width={{ base: '100%', md: '50%' }}
          position="relative"
          display={{ base: 'none', md: 'block' }}
        >
          <Image
            src={loginImage}
            alt="Register background"
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
            Create Account
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color={secondaryTextColor}>Full Name</FormLabel>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  bg={inputBg}
                  border="1px solid"
                  borderColor={borderColor}
                  color={textColor}
                  py="22px"
                  borderRadius="lg"
                  _focus={{
                    borderColor: 'purple.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={secondaryTextColor}>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  bg={inputBg}
                  border="1px solid"
                  borderColor={borderColor}
                  color={textColor}
                  py="22px"
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
                  border="1px solid"
                  borderColor={borderColor}
                  color={textColor}
                  py="22px"
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
                  border="1px solid"
                  borderColor={borderColor}
                  color={textColor}
                  py="22px"
                  borderRadius="lg"
                  _focus={{
                    borderColor: 'purple.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
                  }}
                />
              </FormControl>

              <Button
                type="submit"
                bg={useColorModeValue("black", "white")}
                color={useColorModeValue("white", "black")}
                borderWidth="1px"
                borderColor={useColorModeValue("black", "gray")}
                _hover={{ bg: useColorModeValue("white", "black"), color: useColorModeValue("black", "white") }}
                width="full"
                isLoading={handleRegister.isPending}
                py="22px"
                my={6}
                borderRadius="lg"
                fontSize="md"
                fontWeight="semibold"
                transition="all 0.2s"
              >
                Register
              </Button>

              <Text color={textColor} textAlign="center" fontSize="sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-purple-500 hover:text-purple-600 font-semibold transition-colors"
                >
                  Login
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </Container>
    </Flex>
  );
};

export default Register;
