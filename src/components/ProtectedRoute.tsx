import React, { useEffect, useState } from 'react';
import AccessCodeForm from './AccessCodeForm';
import { hasAccess } from '@/utils/accessCodes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(hasAccess());
    setIsChecking(false);
  }, []);

  // Show nothing while checking
  if (isChecking) {
    return null;
  }

  // If no access, show the form
  if (!isAuthenticated) {
    return <AccessCodeForm />;
  }

  // If has access, show the protected content
  return <>{children}</>;
} 