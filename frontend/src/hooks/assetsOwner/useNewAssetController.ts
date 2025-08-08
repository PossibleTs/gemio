import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { toaster } from '@app/components/ui/toaster';

import constants from '@app/constants';
import handleErrorMessage from '@app/utils/handleErrorMessage';
import services from '@app/services';
import { useRouter } from 'next/navigation';
import { newAssetFormSchema } from '@app/app/(authenticated)/owner/assets/new/newAssetFormSchema';
import useFetch from '../useFetch';
import { CollectionDto } from '@app/types/Collection';

export type NewAssetFormDto = {
  ass_col_id: number;
  ass_name: string;
  ass_machine_type: string;
  ass_serial_number: string;
  ass_manufacturer: string;
  ass_model: string;
  ass_manufacture_year: number;
};

const useNewAssetController = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const { data, fetchData, isLoading: isLoadingCollection } = useFetch<CollectionDto[]>({
    request: { get: services.collections.fetchAll },
  });

  const selectOptions = data.map((item) => ({
    label: `${item.col_hedera_token_id} - ${item.col_name}`,
    value: `${item.col_id}`,
  }));

  const formMethods = useForm<NewAssetFormDto>({
    resolver: yupResolver(newAssetFormSchema),
    defaultValues: {
      ass_col_id: undefined,
      ass_name: '',
      ass_machine_type: '',
      ass_serial_number: '',
      ass_manufacturer: '',
      ass_model: '',
      ass_manufacture_year: undefined,
    },
  });

  const handleCancel = () => {
    router.push('/owner/assets');
  };

  const handleNewAssetResponse = async () => {
    router.push('/owner/assets');
    toaster.create({
      title: 'Novo equipamento criado com sucesso!',
      type: 'success',
      duration: constants.api.POP_UP_TIMEOUT,
    });
  };

  const handleNewAsset = async (data: NewAssetFormDto) => {
    try {
      setIsLoading(true);
      const response = await services.assets.createOne(data);

      if (response.status === 201) {
        handleNewAssetResponse();
      }
    } catch (err) {
      handleErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    formMethods,
    handleCancel,
    handleNewAsset,
    formRef,
    isLoadingCollection,
    data,
    selectOptions
  };
};

export default useNewAssetController;
