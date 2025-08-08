import { ChakraProvider } from '@app/components/ui/chakra-provider';
import { type ReactNode } from 'react';
import NextAuthProvider from './common/NextAuthProvider';

type ProvidersProps = {
  children: ReactNode;
};
export function Providers(props: ProvidersProps) {
  const { children } = props;

  return (
    <NextAuthProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </NextAuthProvider>
  );
}
