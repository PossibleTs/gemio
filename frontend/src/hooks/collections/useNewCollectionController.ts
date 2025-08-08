import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { toaster } from '@app/components/ui/toaster';

import constants from '@app/constants';
import { newCollectionFormSchema } from '@app/app/(authenticated)/admin/collections/new/newCollectionFormSchema';
import handleErrorMessage from '@app/utils/handleErrorMessage';
import services from '@app/services';
import { CollectionDto } from '@app/types/Collection';
import { useRouter } from 'next/navigation';

export type NewCollectionFormDto = {
  name: CollectionDto['col_name'];
  symbol: CollectionDto['col_symbol'];
  description: CollectionDto['col_description'];
};
const useCollectionsController = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const formMethods = useForm<NewCollectionFormDto>({
    resolver: yupResolver(newCollectionFormSchema),
    defaultValues: {
      name: '',
      symbol: '',
      description: ''
    },
  });

  const handleCancel = () => {
    router.push('/admin/collections');
  };

  const handleNewCollectionResponse = async () => {
    router.push('/admin/collections');
    toaster.create({
      title: 'Nova coleção criada com sucesso!',
      type: 'success',
      duration: constants.api.POP_UP_TIMEOUT,
    });
  };

  const handleNewCollection = async (data: NewCollectionFormDto) => {
    try {
      setIsLoading(true);

      const response = await services.collections.createOne(data);

      if (response.status === 201) {
        handleNewCollectionResponse();
      }
    } catch (err) {
      handleErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    formMethods,
    handleCancel,
    handleNewCollection,
    formRef
  };
};

export default useCollectionsController;