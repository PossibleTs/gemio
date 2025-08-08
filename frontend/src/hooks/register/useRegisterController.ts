import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import { registerFormSchema } from '@app/app/(authentication)/register/registerFormSchema';
import services from '@app/services';
import handleErrorMessage from '@app/utils/handleErrorMessage';
import { CompanyDto } from '@app/types/Company';
import useWindowSize from '../useWindowSize';
import { Mnemonic, PrivateKey } from '@hashgraph/sdk';
import { CreateCompanyParams } from '@app/services/register';

export type RegistrationFormDto = {
  usr_name: string;
  usr_email: string;
  usr_password: string;
  com_confirm_password: string;
  com_name: CompanyDto['com_name'];
  com_cnpj: CompanyDto['com_cnpj'];
  com_type: CompanyDto['com_type'];
  com_create_wallet: boolean;
  com_hedera_account_id: CompanyDto['com_hedera_account_id'];
  com_hedera_private_key: string;
  com_hedera_mnemonic_phrase: string;
};

const useRegisterController = () => {
  const flows = {
    newWallet: [
      'profileSelection',
      'loginCredential',
      'companyInfo',
      'newOrExistingWallet',
      'displayMnemonic',
      'validateMnemonic',
      'sucessMessage',
    ],
    existingWallet: [
      'profileSelection',
      'loginCredential',
      'companyInfo',
      'newOrExistingWallet',
      'walletInfo',
      'sucessMessage',
    ],
  };

  const [isLoading, setIsLoading] = useState(false);
  const [typeRecoveryExistingAccount, setTypeRecoveryExistingAccount] =
    useState<'private_key' | 'mnemonic_phrase'>('mnemonic_phrase');
  const router = useRouter();
  const { windowWidth } = useWindowSize();

  const [selectedCardProfile, setSelectedCardProfile] = useState<number | null>(null);
  const [selectedCardWallet, setselectedCardWallet] = useState<number | null>(null);
  const [direction, setDirection] = useState<boolean>(true); // true: direita -> esquerda, false: esquerda -> direita
  const [currentStep, setCurrentStep] = useState<string>(
    flows.existingWallet[0]
  );

  const formMethods = useForm<RegistrationFormDto>({
    resolver: yupResolver(registerFormSchema),
    defaultValues: {
      com_cnpj: '',
      com_name: '',
      com_type: '',
      com_hedera_account_id: '',
      com_hedera_private_key: '',
      com_hedera_mnemonic_phrase: '',
      com_create_wallet: undefined,
    },
  });

  const com_create_wallet = formMethods.watch('com_create_wallet');
  const com_hedera_account_id = formMethods.watch('com_hedera_account_id');
  const com_hedera_mnemonic_phrase = formMethods.watch(
    'com_hedera_mnemonic_phrase'
  );
  const com_hedera_private_key = formMethods.watch('com_hedera_private_key');

  const handleCardProfileClick = async (index: number) => {
    const types = ['creator', 'owner', 'maintainer'];
    formMethods.setValue('com_type', types[index]);
    setSelectedCardProfile(index);
  };

  const handleCardWalletClick = async (index: number) => {
    setselectedCardWallet(index);
  };

  const handleNext = async () => {
    setDirection(true);

    const currentFlow =
      com_create_wallet === true ? flows.newWallet : flows.existingWallet;

    if (currentStep === 'profileSelection') {
      const isValid = await formMethods.trigger('com_type');
      if (!isValid) return;
    }

    if (currentStep === 'loginCredential') {
      const isValidName = await formMethods.trigger('usr_name');
      const isValidEmail = await formMethods.trigger('usr_email');
      const isValidPassword = await formMethods.trigger('usr_password');
      const isValidConfirmPassword = await formMethods.trigger(
        'com_confirm_password'
      );
      if (!isValidEmail || !isValidPassword || !isValidConfirmPassword || !isValidName) return;
    }

    if (currentStep === 'companyInfo') {
      const isValidName = await formMethods.trigger('com_name');
      const isValidCNPJ = await formMethods.trigger('com_cnpj');
      if (!isValidName || !isValidCNPJ) return;
    }

    if (currentStep === 'newOrExistingWallet') {
      if (com_create_wallet === undefined) return;
    }

    if (
      currentFlow.findIndex((el) => el === currentStep) ===
      currentFlow.length - 2
    ) {
      // Last step before success screen
      formMethods.handleSubmit(handleSendSubscription)();
    } else {
      setCurrentStep(
        currentFlow[currentFlow.findIndex((el) => el === currentStep) + 1]
      );
    }
  };

  const handleBack = () => {
    setDirection(false);
    const currentFlow =
      com_create_wallet === true ? flows.newWallet : flows.existingWallet;

    setCurrentStep(
      currentFlow[currentFlow.findIndex((el) => el === currentStep) - 1]
    );
  };

  useEffect(() => {
    if (typeRecoveryExistingAccount === 'private_key')
      formMethods.setValue('com_hedera_mnemonic_phrase', '');

    if (typeRecoveryExistingAccount === 'mnemonic_phrase')
      formMethods.setValue('com_hedera_private_key', '');
  }, [typeRecoveryExistingAccount, formMethods]);

  const handleExistingWallet = async () => {
    formMethods.setValue('com_create_wallet', false);
    formMethods.setValue('com_hedera_mnemonic_phrase', '');
    formMethods.setValue('com_hedera_private_key', '');
  };

  const setMnemonicPhrase = async (mnemonic: string) => {
    formMethods.setValue('com_hedera_mnemonic_phrase', mnemonic);
    const mnemonicObj = await Mnemonic.fromString(mnemonic);
    const privateKey = await mnemonicObj.toLegacyPrivateKey();
    formMethods.setValue('com_hedera_private_key', privateKey.toStringDer());
  };

  const handleNewWallet = async () => {
    formMethods.setValue('com_create_wallet', true);

    await PrivateKey.generateED25519();

    const mnemonic = await Mnemonic.generate();
    const privateKey = await mnemonic.toLegacyPrivateKey();

    formMethods.setValue('com_hedera_account_id', '');
    formMethods.setValue('com_hedera_mnemonic_phrase', mnemonic.toString());
    formMethods.setValue('com_hedera_private_key', privateKey.toStringDer());

    let displayMnemonicString = '';
    mnemonic
      .toString()
      .split(' ')
      .map((word: string, index: number) => {
        displayMnemonicString =
          displayMnemonicString +
          `${(index + 1).toString().padStart(2, '0')}. ${word}\n`;
      });

    console.log(displayMnemonicString);
  };

  const width = windowWidth && windowWidth > 1440 ? 1900 : (windowWidth ?? 0);

  const variants = {
    enter: (direction: boolean) => ({
      x: direction === true ? width : width * -0.99,
      // x: direction === true ? 1500 : -1500,
      opacity: 1,
      // y: 160,
    }),
    center: {
      x: 0,
      // y: currentBox !== 2 ? 160 : 150,
      opacity: 1,
    },
    exit: (direction: boolean) => ({
      x: direction === true ? width * -0.99 : width,
      // y: 160,
      opacity: 1,
    }),
  };

  const handleSendSubscription = async (data: RegistrationFormDto) => {
    try {
      setIsLoading(true);

      const formattedValues: CreateCompanyParams = {
        usr_name: data.usr_name,
        usr_email: data.usr_email,
        usr_password: data.usr_password,
        com_name: data.com_name,
        com_cnpj: data.com_cnpj?.replace(/[^\d]/g, ''),
        com_type: data.com_type,
        com_create_wallet: data.com_create_wallet,
        com_hedera_account_id: data.com_hedera_account_id,
        com_hedera_mnemonic_phrase: data.com_hedera_mnemonic_phrase,
        com_hedera_private_key: data.com_hedera_private_key,
      };

      const response = await services.register.create(formattedValues);

      if (response.status === 201) {
        if (response?.data?.com_hedera_account_id) {
          formMethods.setValue(
            'com_hedera_account_id',
            response?.data?.com_hedera_account_id
          );
        }

        setIsLoading(false);
        setDirection(true);
        const currentFlow =
          com_create_wallet === true ? flows.newWallet : flows.existingWallet;
        setCurrentStep(
          currentFlow[currentFlow.findIndex((el) => el === currentStep) + 1]
        );
      }
    } catch (err) {
      handleErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formMethods,
    isLoading,
    handleSendSubscription,
    router,
    selectedCardProfile,
    selectedCardWallet,
    direction,
    handleCardProfileClick,
    handleCardWalletClick,
    handleNext,
    handleBack,
    handleExistingWallet,
    handleNewWallet,
    typeRecoveryExistingAccount,
    setTypeRecoveryExistingAccount,
    width,
    variants,
    com_create_wallet,
    com_hedera_account_id,
    com_hedera_mnemonic_phrase,
    com_hedera_private_key,
    currentStep,
    setMnemonicPhrase,
  };
};

export default useRegisterController;
