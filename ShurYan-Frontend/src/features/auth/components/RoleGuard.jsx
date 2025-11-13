// src/features/auth/components/RoleGuard.jsx
import React from 'react';
import { useAuthStore } from '../store/authStore';
import Alert from '@/components/ui/Alert';

const RoleGuard = ({ children, roles = [], fallback = null }) => {
  const { user } = useAuthStore();

  if (!user || (roles.length > 0 && !roles.includes(user.role))) {
    if (fallback) {
      return fallback;
    }

    return (
      <Alert variant="warning">
        ليس لديك صلاحية للوصول إلى هذا المحتوى
      </Alert>
    );
  }

  return children;
};

export default RoleGuard;