// src/features/auth/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuthStore();
  const location = useLocation();

  // 🐛 Debug logging
  console.log('🔒 ProtectedRoute Debug:', {
    isAuthenticated,
    user: user,
    'user.role': user?.role,
    'user.userType': user?.userType,
    'user.type': user?.type,
    requiredRoles: roles,
    location: location.pathname
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to /login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check roles (case-insensitive)
  // Try different property names that backend might use
  if (roles.length > 0) {
    // Get the role from any possible property
    // Also handle roles array (take first role)
    let rawUserRole = user?.role || user?.userType || user?.type || user?.accountType || user?.userRole;
    
    // If roles is an array, take the first one
    if (!rawUserRole && user?.roles && Array.isArray(user.roles)) {
      rawUserRole = user.roles[0];
      console.log('📋 Found roles array, using first role:', rawUserRole);
    }
    
    const userRole = rawUserRole?.toLowerCase();
    
    console.log('🔍 Role Check:', {
      rawUserRole,
      userRoleLowerCase: userRole,
      requiredRoles: roles,
      requiredRolesLowerCase: roles.map(r => r.toLowerCase())
    });
    
    const hasAccess = roles.some(role => role.toLowerCase() === userRole);
    
    console.log('🎯 Access Check Result:', {
      hasAccess,
      userRoleType: typeof userRole,
      userRoleValue: userRole,
      userRoleLength: userRole?.length,
      comparison: roles.map(role => ({
        required: role,
        requiredLower: role.toLowerCase(),
        requiredType: typeof role,
        userRole: userRole,
        userRoleType: typeof userRole,
        match: role.toLowerCase() === userRole,
        strictEqual: role.toLowerCase() === userRole,
        includes: userRole?.includes(role.toLowerCase())
      }))
    });
    
    if (!hasAccess) {
      console.log('❌ Role mismatch! Access DENIED', {
        user: user,
        userRole: userRole,
        requiredRoles: roles,
        hasAccess,
        checkedProperties: {
          role: user?.role,
          userType: user?.userType,
          type: user?.type,
          accountType: user?.accountType,
          userRole: user?.userRole
        }
      });
      return <Navigate to="/unauthorized" replace />;
    }
    
    console.log('✅ Role match! Access GRANTED');
  }

  console.log('✅ Access granted!');
  return children;
};

export default ProtectedRoute;