'use client';
import { ReactNode } from 'react';

import useRouting from '@app/hooks/auth/useRouting';

type RoutingProps = {
  children: ReactNode;
};

export default function Routing(props: RoutingProps) {
  const { children } = props;

  useRouting();

  return children;
}
