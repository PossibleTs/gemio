'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  VStack,
  Text,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import Image from 'next/image';
import logo from '@app/assets/logo-white.svg';
import useAuthController from '@app/hooks/auth/useAuthController';
import { Field } from '@app/components/ui/field';
import BaseInput from '@app/components/ui/base-input';
import constants from '@app/constants';

export default function LoginPage() {
  const { formMethods, signIn, isLoading } = useAuthController();

  const router = useRouter();

  const handleRegister = () => {
    router.push(`/register`);
  };

  return (
    <Box
      position="relative"
      height="100vh"
      mx="auto"
      overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Image
        src={"/Cover.png"}
        alt="Fundo"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <Flex 
        position="absolute" 
        w={{base: "90%", md: "700px"}}
        justifyContent={'center'} 
        alignItems={'center'}
        flexDirection={'column'}
        h={'100%'}
      >
        <Flex
          h={'95%'}
          justifyContent={'center'} 
          alignItems={'center'}
          flexDirection={'column'}
        >
          <Box mb={'10px'}>
          <Image
            src={logo}
            alt="Gemio logo"
            width={700}
            height={38}
            priority
          />
          </Box>
          <Box mb={'10px'}>
            <Text
              color={'white'}
              fontSize={{base: '18px', md: '20px'}}
              fontWeight={'bold'}
              maxW="560px"
              textAlign={'center'}
            >
              GEMIO - Portal de tokenização de ativos industriais
            </Text>
          </Box>
          <Box
            bg="rgba(90, 69, 149, 0.48)"
            borderRadius="30px"
            p="8"
            boxShadow="lg"
            maxW={{base: "100%", md: "560px"}}
            textAlign="center"
            zIndex="1"
            borderStyle={"solid"}
            borderColor="#8b78b2"
            borderWidth={"4px"}
            mb={'10px'}
          >
            <form onSubmit={formMethods.handleSubmit(signIn)}>
              <VStack gap="6" w={{base: "100%", md: "500px"}}>
                <Box mb={'-10px'} width="100%">
                  <Field
                    invalid={!!formMethods.formState.errors.email}
                    errorText={formMethods.formState.errors.email?.message ?? ''}
                  >
                    <BaseInput
                      fullWidthOnly
                      {...formMethods.register('email')}
                      type="text"
                      placeholder={constants.formConstant.email.placeholder}
                      color={'white'}
                      _placeholder={{ color: 'white' }}
                      borderColor="#8b78b2"
                      borderWidth={"4px"}
                      rounded={'10px'}
                      h={'50px'}
                    />
                  </Field>
                </Box>
                <Box mb={'5px'} width="100%">
                  <Field
                    invalid={!!formMethods.formState.errors.password}
                    errorText={formMethods.formState.errors.password?.message ?? ''}
                  >
                    <BaseInput
                      fullWidthOnly
                      {...formMethods.register('password')}
                      type="password"
                      placeholder={constants.formConstant.password.placeholder}
                      color={'white'}
                      _placeholder={{ color: 'white' }}
                      borderColor="#8b78b2"
                      borderWidth={"4px"}
                      rounded={'10px'}
                      h={'50px'}
                    />
                  </Field>
                </Box>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  bgColor={'#8b78b2'}
                  fontWeight={'bold'}
                  fontSize={'18px'}
                >
                  {!isLoading ? (
                    <Text>
                      Entrar
                    </Text>
                  ): (
                    <Spinner color="white" size={'sm'} />
                  )}
                </Button>
                <Flex w={'100%'} justifyContent={'space-between'}>
                  <Text
                    color={'white'}
                    cursor={'pointer'}
                    fontSize={'14px'}
                    _hover={{
                      textDecoration: 'underline',
                    }}
                    _focus={{ boxShadow: 'none', outline: 'none' }}
                  >
                    Esqueci minha senha
                  </Text>
                  <Text
                    color={'white'}
                    cursor={'pointer'}
                    onClick={handleRegister}
                    fontSize={'14px'}
                    _hover={{
                      textDecoration: 'underline',
                    }}
                    _focus={{ boxShadow: 'none', outline: 'none' }}
                  >
                    Criar nova conta
                  </Text>
                </Flex>
              </VStack>
            </form>
          </Box> 

          <Box w={{base: "90%", md: "600px"}}>
            <Text
              color={'white'}
              fontSize={'20px'}
              fontWeight={'bold'}
              mb={'10px'}
              textAlign={'center'}
            >
              Tecnologia que valida confiança.
            </Text>
            <Text
              color={'black'}
              fontSize={'16px'}
              fontWeight={'normal'}
              textAlign={'center'}
              mb={'10px'}
            >
              Versão 1.0
            </Text>
            <Text
              color={'black'}
              fontSize={'16px'}
              fontWeight={'normal'}
              textAlign={'center'}
              cursor={'pointer'}
              _hover={{
                textDecoration: 'underline',
              }}
              _focus={{ boxShadow: 'none', outline: 'none' }}
            >
              Política e Privacidade
            </Text>
          </Box>
        </Flex>

        <Box h={'5%'}>
          <Image
            src={"/BUILT_ON.png"}
            alt="BUILT_ON"
            width={200}
            height={38}
          />
        </Box>

      </Flex>
    </Box>
  );
}
