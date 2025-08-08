'use client';

import BaseLayout from '@app/components/base-layout';
import PageLoading from '@app/components/ui/page-loding';
import { useSession } from 'next-auth/react';

export default function ClientAuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();

  return session === undefined ? (
    <PageLoading isLoading={true} />
  ) : (
    <BaseLayout>
      {children}
    </BaseLayout>
  );
}
