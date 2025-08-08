import { useCallback, useState } from 'react';
import type { IRequest } from '@app/types/Request';
import handleErrorMessage from '@app/utils/handleErrorMessage';

type IUseFetchProps<T> = {
  request: IRequest<T>;
};

function useFetch<T>(props: IUseFetchProps<T>) {
  const { request } = props;

  const [data, setData] = useState<T>([] as T);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (params?: any) => {
      try {
        setIsLoading(true);
        const response = await request.get(params);

        setData(response.data);
      } catch (err) {
        handleErrorMessage(err);
      } finally {
        setIsLoading(false);
      }
    },
    [request]
  );

  return {
    data,
    isLoading,
    fetchData,
  };
}

export default useFetch;
