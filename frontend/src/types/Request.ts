type IData<T> = {
  data: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IRequest<T = any> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: (params: any) => Promise<IData<T>>;
};

export type ListPaginationDto = {
  count: number | null;
  page: number | null;
  totalPages: number | null;
  limitPages: number | null;
  withoutPagination?: boolean;
};

export type FetchAllParams = {
  pagination: {
    order: string;
    direction: 'asc' | 'desc';
    filterList?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchFilters: any;
};
