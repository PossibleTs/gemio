import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Box } from '@chakra-ui/react';
import { Toaster } from '@app/components/ui/toaster';
import { Providers } from './providers';
import './globals.css';
import Routing from './routing';

export const metadata: Metadata = {
  title: 'Gemio',
  description: 'Gemio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Routing>
            <Suspense>
              <Box h={"full"} minH={'100vh'} position={'relative'}>
                {children}
              </Box>
            </Suspense>
          </Routing>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
