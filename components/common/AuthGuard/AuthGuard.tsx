'use client';

import React, { ReactNode } from 'react';
import { useAuthProtection } from '@/hooks/useAuthProtection';
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from '@/lib/config/constants';

interface AuthGuardProps {
  children: ReactNode;
  redirectPath?: string;
  fallback?: ReactNode;
}

/**
 * Компонент для защиты маршрутов, требующих аутентификации
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectPath = DEFAULT_UNAUTHENTICATED_REDIRECT,
  fallback = <div>Загрузка...</div>,
}) => {
  const { isChecking } = useAuthProtection(redirectPath);

  if (isChecking) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuthGuard; 