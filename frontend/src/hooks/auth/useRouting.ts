import services from '@app/services';
import { UseSessionReturn } from '@app/types/Session';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const useRouting = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession() as UseSessionReturn;

  const token = session?.user?.token ?? null;
  const user = session?.user ?? null;

  const isAdminPathname = pathname.includes('/admin');
  const isOwnerPathname = pathname.includes('/owner');
  const isMaintainerPathname = pathname.includes('/maintainer');
  const isCreatorPathname = pathname.includes('/creator');

  useEffect(() => {
    if (
      session !== undefined &&
      token &&
      (
        (!isAdminPathname && user?.usr_permission === 'admin') ||
        (!isOwnerPathname && user?.usr_permission === 'company' && user.com_type === 'owner') ||
        (!isMaintainerPathname && user?.usr_permission === 'company' && user.com_type === 'maintainer') ||
        (!isCreatorPathname && user?.usr_permission === 'company' && user.com_type === 'creator')
      )
    ) {
      router.push(
        user?.usr_permission === 'admin'
          ? '/admin/companies'
          : user?.usr_permission === 'company' && user.com_type === 'owner'
          ? '/owner/assets'
          : user?.usr_permission === 'company' && user.com_type === 'maintainer'
          ? '/maintainer/assets'
          : user?.usr_permission === 'company' && user.com_type === 'creator'
          ? '/creator/assets'
          : ''
      );
    }
  }, [
    user, 
    token, 
    router, 
    session, 
    isAdminPathname, 
    isOwnerPathname, 
    isMaintainerPathname, 
    isCreatorPathname
  ]);

  useEffect(() => {
    if (session && session.user && session.user?.token) {
      const token = session.user.token;
      services.localStorage.saveToken(token);
    }
  }, [session]);
};

export default useRouting;
