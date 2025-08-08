export type UseSessionReturn = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  data: null | {
    user?: {
      token?: string | null;
      usr_id: number | null;
      usr_name?: string | null;
      usr_email?: string | null;
      usr_permission?: string | null;
      com_type?: string | null
    };
    expires?: string;
  };
};
