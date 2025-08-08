import { Button, Flex, Link } from '@chakra-ui/react';
import Image from 'next/image';
import logo from '@app/assets/logo-black.svg';
import { IconButton } from '@chakra-ui/react';
import { IoLogOutOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import services from '@app/services';
import { UseSessionReturn } from '@app/types/Session';

export const Header = () => {
  const router = useRouter();
  const session = useSession() as UseSessionReturn;

  const onClickMyAccount = () => {
    router.push(`/login`);
  };

  return (
    <Flex justifyContent={'space-between'} mt={2}>
      <Link
        href={
          session.status === 'unauthenticated'
            ? '/'
            : session.data?.user?.usr_permission === 'admin'
              ? '/admin/companies'
              : '/owner/assets'
        }
      >
        <Image src={logo} alt="Gemio logo" width={180} height={38} priority />
      </Link>

      <Flex gap={2}>
        {session.status === 'unauthenticated' && (
          <Button onClick={onClickMyAccount} px={2}>
            {'Minha conta'}
          </Button>
        )}

        {session.status === 'authenticated' && (
          <IconButton aria-label="Logout" onClick={services.auth.logOut}>
            <IoLogOutOutline />
          </IconButton>
        )}
      </Flex>
    </Flex>
  );
};
