import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RoleGateProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
