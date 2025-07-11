// src/components/RequireAuth.tsx
'use client';

import { useContext, ReactNode, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user } = useContext(AuthContext)!;
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  if (user === undefined || user === null) {
    router.replace('/401')
  }

  return <>{children}</>;
}
