'use client';
import {
  Box,
  Button,
  Flex,
  Text,
  Grid,
  GridItem,
  Link,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Controller } from 'react-hook-form';
import { Field } from '@app/components/ui/field';
import handleValueMask from '@app/utils/handleValueMask';
import useRegisterController from '@app/hooks/register/useRegisterController';
import PageLoading from '@app/components/ui/page-loding';
import Image from 'next/image';
import logo from '@app/assets/logo-white.svg';
import manufacturer from '@app/assets/register-icons/manufacturer.png';
import mechanic from '@app/assets/register-icons/mechanic.png';
import primaryMarket from '@app/assets/register-icons/primary-market.png';
import wallet from '@app/assets/register-icons/wallet.png';
import addWallet from '@app/assets/register-icons/add_wallet.png';
import { SegmentGroup } from '@chakra-ui/react';
import FormMnemonicPhrase from '@app/components/form-mnemonic-phrase';
import DisplayMnemonicPhrase from '@app/components/display-mnemonic-phrase';
import FormCheckMnemonicPhrase from '@app/components/form-check-mnemonic-phrase';
import Label from '@app/components/ui/label';
import BaseInput from '@app/components/ui/base-input';
import constants from '@app/constants';

export default function ConnectWallet() {
  const {
    isLoading,
    handleSendSubscription,
    selectedCardProfile,
    selectedCardWallet,
    direction,
    formMethods,
    handleCardProfileClick,
    handleCardWalletClick,
    handleNext,
    handleBack,
    handleExistingWallet,
    handleNewWallet,
    variants,
    typeRecoveryExistingAccount,
    setTypeRecoveryExistingAccount,
    com_create_wallet,
    com_hedera_account_id,
    com_hedera_mnemonic_phrase,
    currentStep,
    setMnemonicPhrase,
  } = useRegisterController();

  return (
    <Flex m={'auto'} maxW={'1920px'} position={'relative'} direction={'column'}>
      <Flex
        w={'full'}
        h={'100px'}
        bg={'base_black'}
        boxShadow={`${constants.shadows.headerShadow}`}
        alignItems={'center'}
        justifyContent={'flex-end'}
        zIndex={10}
      >
        <Flex
          m={'auto'}
          h={'full'}
          w={'full'}
          px={'20px'}
          maxW={'1400px'}
          justifyContent={'space-between'}
          alignContent={'center'}
          alignItems={'center'}
        >
          <Link href="/">
            <Image
              src={logo}
              alt="Gemio logo"
              width={180}
              height={38}
              priority
            />
          </Link>
        </Flex>
      </Flex>

      <Flex
        maxW={'90vw'}
        m={'auto'}
        justifyContent={'center'}
        alignItems={'center'}
        minH={'calc(100vh - 100px)'}
      >
        {currentStep === 'profileSelection' ? (
          <Flex direction={'column'} gap={4} minH={'100%'}>
            <Cards
              selectedCardProfile={selectedCardProfile}
              handleCardProfileClick={handleCardProfileClick}
            />

            <NavigationButtons 
              handleNext={handleNext} 
              firstStage={true}
            />
          </Flex>
        ) : null}

        <form onSubmit={formMethods.handleSubmit(handleSendSubscription)}>
          <AnimatePresence custom={direction}>
            {selectedCardProfile !== null && currentStep !== 'profileSelection' && (
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  minHeight: 'calc(100vh - 100px)',
                  background: 'rgba(255, 255, 255, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 20,
                  paddingBottom: 20,
                  top: 100,
                  left: 0,
                  zIndex: 0,
                }}
              >
                {currentStep === 'loginCredential' ? (
                  <>
                    <Box mb={'18px'}>
                      <Label labelText={constants.formConstant.name.label} required={true} />
                      <Controller
                        name="usr_name"
                        control={formMethods.control}
                        render={({ field: { value, onBlur } }) => (
                          <Field
                            invalid
                            errorText={
                              formMethods.formState.errors.usr_name
                                ?.message ?? ''
                            }
                          >
                            <BaseInput
                              {...formMethods.register('usr_name')}
                              type="text"
                              value={value || ''}
                              onBlur={onBlur}
                              placeholder={constants.formConstant.name.placeholder}
                            />
                          </Field>
                        )}
                      />
                    </Box>
                    <Box mb={'18px'}>
                      <Label labelText={constants.formConstant.email.label} required={true} />
                      <Controller
                        name="usr_email"
                        control={formMethods.control}
                        render={({ field: { value, onBlur } }) => (
                          <Field
                            invalid
                            errorText={
                              formMethods.formState.errors.usr_email
                                ?.message ?? ''
                            }
                          >
                            <BaseInput
                              {...formMethods.register('usr_email')}
                              type="email"
                              value={value || ''}
                              onBlur={onBlur}
                              placeholder={constants.formConstant.email.placeholder}
                            />
                          </Field>
                        )}
                      />
                    </Box>
                    <Box mb={'18px'}>
                      <Label labelText={constants.formConstant.password.label} required={true} />
                      <Controller
                        name="usr_password"
                        control={formMethods.control}
                        render={({ field: { value, onBlur } }) => (
                          <Field
                            invalid
                            errorText={
                              formMethods.formState.errors.usr_password
                                ?.message ?? ''
                            }
                          >
                            <BaseInput
                              {...formMethods.register('usr_password')}
                              type="password"
                              value={value || ''}
                              onBlur={onBlur}
                              placeholder={constants.formConstant.password.label}
                            />
                          </Field>
                        )}
                      />
                    </Box>
                    <Box mb={'18px'}>
                      <Label labelText={constants.formConstant.confirmPassword.label} required={true} />
                      <Controller
                        name="com_confirm_password"
                        control={formMethods.control}
                        render={({ field: { value, onBlur } }) => (
                          <Field
                            invalid
                            errorText={
                              formMethods.formState.errors.com_confirm_password
                                ?.message ?? ''
                            }
                          >
                            <BaseInput
                              {...formMethods.register('com_confirm_password')}
                              type="password"
                              value={value || ''}
                              onBlur={onBlur}
                              placeholder={constants.formConstant.confirmPassword.placeholder}
                            />
                          </Field>
                        )}
                      />
                    </Box>
                    <Box w={'377px'}>
                      <NavigationButtons 
                        handleNext={handleNext} 
                        handleBack={handleBack}
                      />
                    </Box>
                  </>
                ) : null}

                {currentStep === 'companyInfo' ? (
                  <>
                    <Box mb={'18px'}>
                      <Label labelText={constants.formConstant.comName.label} required={true} />
                      <Controller
                        name="com_name"
                        control={formMethods.control}
                        render={({ field: { value, onBlur } }) => (
                          <Field
                            invalid
                            errorText={
                              formMethods.formState.errors.com_name
                                ?.message ?? ''
                            }
                          >
                            <BaseInput
                              {...formMethods.register('com_name')}
                              type="text"
                              value={value || ''}
                              onBlur={onBlur}
                              placeholder={constants.formConstant.comName.placeholder}
                            />
                          </Field>
                        )}
                      />
                    </Box>
                    <Box mb={'18px'}>
                      <Label labelText={constants.formConstant.comCNPJ.label} required={true} />
                      <Controller
                        name="com_cnpj"
                        control={formMethods.control}
                        render={({ field: { value, onBlur, onChange } }) => (
                          <Field
                            invalid
                            errorText={
                              formMethods.formState.errors.com_cnpj
                                ?.message ?? ''
                            }
                          >
                            <BaseInput
                              {...formMethods.register('com_cnpj')}
                              type="text"
                              value={value || ''}
                              onChange={(e) =>
                                handleValueMask(
                                  e.target.value,
                                  'cnpj',
                                  onChange
                                )
                              }
                              onBlur={onBlur}
                              placeholder={constants.formConstant.comCNPJ.label}
                            />
                          </Field>
                        )}
                      />
                      <Text
                        fontSize={'10px'}
                        fontWeight={400}
                        color={'text_primary'}
                      >
                        Digite apenas números 99.999.999/9999-99.
                      </Text>
                    </Box>
                    <Box w={'377px'}>
                      <NavigationButtons 
                        handleNext={handleNext} 
                        handleBack={handleBack}
                      />
                    </Box>
                  </>
                ) : null}

                {currentStep === 'newOrExistingWallet' ? (
                  <Flex
                    direction={'column'}
                    gap={4}
                    minH={'100%'}
                    maxW={'90vw'}
                    m={'auto'}
                    justifyContent={'center'}
                  >
                    <CardsNewOrExistingWallet
                      handleNewWallet={handleNewWallet}
                      handleCardWalletClick={handleCardWalletClick}
                      handleExistingWallet={handleExistingWallet}
                      selectedCardWallet={selectedCardWallet}
                    />

                    <NavigationButtons 
                      handleNext={handleNext} 
                      handleBack={handleBack}
                    />
                  </Flex>
                ) : null}

                {currentStep === 'displayMnemonic' ? (
                  <Flex w={'377px'} direction={'column'} gap={2}>
                    <Text
                      fontSize={'18px'}
                      fontWeight={700}
                      color={'text_primary'}
                      mb={'32px'}
                    >
                      {
                        'Anote estas 24 palavras em ordem e guarde-as em um lugar seguro. Você precisará delas para recuperar sua carteira caso perca o acesso.'
                      }
                    </Text>

                    <DisplayMnemonicPhrase
                      recoveryWords={com_hedera_mnemonic_phrase.split(' ')}
                    />

                    <Box mt={8}>
                      <NavigationButtons 
                        handleNext={handleNext} 
                        handleBack={handleBack}
                      />
                    </Box>
                  </Flex>
                ) : null}

                {currentStep === 'validateMnemonic' ? (
                  <Flex w={'377px'} direction={'column'} gap={2}>
                    <Text
                      fontSize={'18px'}
                      fontWeight={700}
                      color={'text_primary'}
                    >
                      {
                        'Preencha as palavras que faltam para verificar se você salvou sua chave de recuperação.'
                      }
                    </Text>

                    <FormCheckMnemonicPhrase
                      recoveryWords={com_hedera_mnemonic_phrase.split(' ')}
                    />
                    <Box mt={8}>
                      <NavigationButtons 
                        handleNext={handleNext} 
                        handleBack={handleBack}
                      />
                    </Box>
                  </Flex>
                ) : null}

                {currentStep === 'walletInfo' ? (
                  <Flex w={'377px'} direction={'column'} gap={2}>
                    <Box mb={'18px'}>
                      <Label labelText={constants.formConstant.hederaAccountId.label} required={true} />
                      <Controller
                        name="com_hedera_account_id"
                        control={formMethods.control}
                        render={({ field: { value, onBlur, onChange } }) => (
                          <Field
                            invalid
                            errorText={
                              formMethods.formState.errors.com_hedera_account_id
                                ?.message ?? ''
                            }
                          >
                            <BaseInput
                              {...formMethods.register('com_hedera_account_id')}
                              type="text"
                              value={value || ''}
                              onBlur={onBlur}
                              onChange={(e) =>
                                handleValueMask(e.target.value, 'hedera_account_id', onChange)
                              }
                              placeholder={constants.formConstant.hederaAccountId.placeholder}
                            />
                          </Field>
                        )}
                      />
                    </Box>

                    <Text
                      fontSize={'18px'}
                      fontWeight={700}
                      color={'text_primary'}
                    >
                      Informe a frase mnemónica ou a chave privada da sua conta
                    </Text>
                    <Box>
                      <SegmentGroup.Root
                        w={'100%'}
                        colorPalette={'red'}
                        value={
                          typeRecoveryExistingAccount === 'private_key'
                            ? 'Chave privada'
                            : 'Frase mnemónica'
                        }
                        onValueChange={({ value }) => {
                          if (value === 'Chave privada')
                            setTypeRecoveryExistingAccount('private_key');

                          if (value === 'Frase mnemónica')
                            setTypeRecoveryExistingAccount('mnemonic_phrase');
                        }}
                      >
                        <SegmentGroup.Items
                          p={3}
                          w={'50%'}
                          items={['Frase mnemónica', 'Chave privada']}
                        />
                        <SegmentGroup.Indicator />
                      </SegmentGroup.Root>
                    </Box>
                    <Box>
                      {typeRecoveryExistingAccount === 'mnemonic_phrase' ? (
                        <FormMnemonicPhrase
                          setMnemonicPhrase={setMnemonicPhrase}
                        />
                      ) : null}

                      {typeRecoveryExistingAccount === 'private_key' ? (
                        <Box mb={'18px'}>
                          <Controller
                            name="com_hedera_private_key"
                            control={formMethods.control}
                            render={({ field: { value, onBlur } }) => (
                              <Field
                                invalid
                                errorText={
                                  formMethods.formState.errors.com_hedera_private_key
                                    ?.message ?? ''
                                }
                              >
                                <BaseInput
                                  {...formMethods.register('com_hedera_private_key')}
                                  type="text"
                                  value={value || ''}
                                  onBlur={onBlur}
                                  placeholder={constants.formConstant.hederaPrivateKey.placeholder}
                                />
                              </Field>
                            )}
                          />
                        </Box>
                      ) : null}
                    </Box>
                    <Box mt={8}>
                      <NavigationButtons 
                        handleBack={handleBack}
                        handleNext={handleNext}
                      />
                    </Box>
                  </Flex>
                ) : null}

                {currentStep === 'sucessMessage' ? (
                  <Box w={'730px'}>
                    <Text fontSize={'42px'} fontWeight={700}>
                      Obrigado por completar o cadastro!
                    </Text>

                    {com_create_wallet === true ? (
                      <Text fontSize={'28px'} fontWeight={700}>
                        ID da conta Hedera: {com_hedera_account_id}
                      </Text>
                    ) : null}

                    <Text fontSize={'13px'} fontWeight={400}>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry s
                      standard dummy text ever since the 1500s.
                    </Text>
                  </Box>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Flex>

      <PageLoading isLoading={isLoading} />
    </Flex>
  );
}

type NavigationButtonsProps = {
  handleNext: () => void;
  handleBack?: () => void;
  firstStage?: boolean;
}

const NavigationButtons = (props: NavigationButtonsProps) => {
  const { handleNext, handleBack, firstStage = false } = props
  return (
    <Flex gap={6} justifyContent={'flex-end'}>
      {!firstStage ? (
        <Button
          w={'94px'}
          h={'45px'}
          variant="outline"
          color={'text_primary'}
          onClick={handleBack}
        >
          Voltar
        </Button>
      ):null}
      <Button
        w={'94px'}
        h={'45px'}
        border={`${constants.border.button_border}`}
        onClick={handleNext}
      >
        Avançar
      </Button>
    </Flex>
  )
}

const cards = [
  {
    title: 'CREATOR',
    description:
      "O Creator é o fabricante do ativo, responsável por registrar sua empresa e mintar NFTs conforme um padrão definido. Ele também gerencia a lista dos Maintainers autorizados.",
    image: manufacturer
  },
  {
    title: 'OWNER',
    description:
      "O Owner é quem possui ou controla o ativo. Ele pode cadastrar sub-usuários, gerenciar os ativos sob sua posse e autorizar Maintainers a registrar eventos técnicos.",
    image: primaryMarket
  },
  {
    title: 'MAINTAINER',
    description:
      "O Maintainer é um prestador de serviço autorizado pelo Owner para registrar manutenções seguindo o padrão técnico da coleção.",
    image: mechanic
  },
];

type CardsProps = {
  selectedCardProfile: number | null;
  handleCardProfileClick: (index: number) => void;
};

function Cards(props: CardsProps) {
  const { selectedCardProfile, handleCardProfileClick } = props;

  return (
    <Grid
      templateColumns={{
        base: '1fr',
        sm: '1fr',
        md: 'repeat(3, 1fr)',
      }}
      gap={8}
    >
      {cards.map((item, index) => (
        <GridItem key={index}>
          <Flex
            maxW={'450px'}
            h={'500px'}
            border={`${constants.border.card_border}`}
            rounded={'13px'}
            bg={
              selectedCardProfile === index
                ? 'rgba(71, 71, 71, 1)'
                : 'rgba(255, 255, 255, 1)'
            }
            flexDirection={'column'}
            alignItems={'center'}
            cursor={'pointer'}
            onClick={() => handleCardProfileClick(index)}
          >
            <Flex
              w={'180px'}
              h={'180px'}
              bg={'rgba(253, 253, 253, 1)'}
              rounded={'100%'}
              mt={'50px'}
              mb={'40px'}
              border={
                selectedCardProfile === index
                  ? '11px solid rgba(255, 255, 255, 1)'
                  : '0px'
              }
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Image src={item.image} alt="Card image" width={100} priority />
            </Flex>

            <Box mr={'34px'} ml={'34px'} mb={'50px'}>
              <Text
                fontWeight={'600'}
                fontSize={'26px'}
                color={
                  selectedCardProfile === index
                    ? 'rgba(255, 255, 255, 1)'
                    : 'rgba(0, 0, 0, 1)'
                }
                mb={'34px'}
                textAlign={'center'}
              >
                {item.title}
              </Text>

              <Text
                fontWeight={'400'}
                fontSize={'13px'}
                color={
                  selectedCardProfile === index
                    ? 'rgba(255, 255, 255, 1)'
                    : 'rgba(0, 0, 0, 1)'
                }
              >
                {item.description}
              </Text>
            </Box>
          </Flex>
        </GridItem>
      ))}
    </Grid>
  );
}

type CardNewOrExistingWalletProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleNewWallet: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleExistingWallet: any;
  selectedCardWallet: number | null;
  handleCardWalletClick: (index: number) => void;
};
function CardsNewOrExistingWallet(props: CardNewOrExistingWalletProps) {
  const { handleNewWallet, handleExistingWallet, selectedCardWallet, handleCardWalletClick } = props;

  const cards = [
    {
      title: 'Criar nova carteira',
      action: handleNewWallet,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      image: addWallet
    },
    {
      title: 'Usar carteira já existente',
      action: handleExistingWallet,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      image: wallet
    },
  ];

  return (
    <Grid
      templateColumns={{
        base: '1fr',
        sm: '1fr',
        md: 'repeat(2, 1fr)',
      }}
      gap={8}
    >
      {cards.map((item, index) => (
        <GridItem key={index}>
          <Flex
            maxW={'450px'}
            h={'500px'}
            border={'1px solid rgba(0, 0, 0, 1)'}
            rounded={'13px'}
            bg={
              selectedCardWallet === index
                ? 'rgba(71, 71, 71, 1)'
                : 'rgba(255, 255, 255, 1)'
            }
            flexDirection={'column'}
            alignItems={'center'}
            key={index}
            cursor={'pointer'}
            onClick={() => {
              handleCardWalletClick(index);
              item.action();
            }}
          >
            <Flex
              w={'180px'}
              h={'180px'}
              bg={'rgba(253, 253, 253, 1)'}
              rounded={'100%'}
              mt={'50px'}
              mb={'40px'}
              border={
                selectedCardWallet === index
                  ? '11px solid rgba(255, 255, 255, 1)'
                  : '0px'
              }
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Image src={item.image} alt="Card image" width={100} priority />
            </Flex>

            <Box mr={'34px'} ml={'34px'} mb={'50px'}>
              <Text
                fontWeight={'600'}
                fontSize={'26px'}
                color={
                  selectedCardWallet === index
                    ? 'rgba(255, 255, 255, 1)'
                    : 'rgba(0, 0, 0, 1)'
                }
                mb={'34px'}
                textAlign={'center'}
              >
                {item.title}
              </Text>

              <Text
                fontWeight={'400'}
                fontSize={'13px'}
                color={
                  selectedCardWallet === index
                    ? 'rgba(255, 255, 255, 1)'
                    : 'rgba(0, 0, 0, 1)'
                }
              >
                {item.description}
              </Text>
            </Box>
          </Flex>
        </GridItem>
      ))}
    </Grid>
  );
}
