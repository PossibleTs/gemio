'use client';

import PageLoading from '@app/components/ui/page-loding';
import { useSession } from 'next-auth/react';
import BaseLayout from '@app/components/base-layout';

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
