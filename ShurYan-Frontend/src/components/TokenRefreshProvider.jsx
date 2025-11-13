import { useEffect } from 'react';
import useTokenRefresh from '@/features/auth/hooks/useTokenRefresh';
import useAuth from '@/features/auth/hooks/useAuth';
import { isTokenExpired, getTokenRemainingTime, formatRemainingTime } from '@/utils/tokenManager';

/**
 * Token Refresh Provider Component
 * 
 * Wraps the app to enable automatic token refresh for authenticated users.
 * This component should be placed high in the component tree (e.g., in App.jsx).
 * 
 * Features:
 * - Auto-enables refresh for authenticated users
 * - Auto-disables on logout
 * - Optional debug mode to show token status
 * 
 * @param {object} props
 * @param {boolean} props.debug - Show debug info in console (default: false)
 * @param {number} props.bufferMinutes - Refresh buffer time in minutes (default: 5)
 * @param {React.ReactNode} props.children - Child components
 */
const TokenRefreshProvider = ({ 
  debug = false, 
  bufferMinutes = 5,
  children 
}) => {
  const { isAuthenticated, accessToken } = useAuth();

  // Enable auto refresh for authenticated users
  useTokenRefresh({ 
    enabled: isAuthenticated,
    bufferMinutes 
  });

  // Debug mode: Log token status every minute
  useEffect(() => {
    if (!debug || !isAuthenticated || !accessToken) return;

    const debugInterval = setInterval(() => {
      const remainingTime = getTokenRemainingTime(accessToken);
      const isExpired = isTokenExpired(accessToken, bufferMinutes);
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 Token Status Debug:');
      console.log('  • Authenticated:', isAuthenticated);
      console.log('  • Remaining Time:', formatRemainingTime(remainingTime));
      console.log('  • Needs Refresh:', isExpired);
      console.log('  • Buffer:', bufferMinutes, 'minutes');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }, 60000); // Every minute

    return () => clearInterval(debugInterval);
  }, [debug, isAuthenticated, accessToken, bufferMinutes]);

  return <>{children}</>;
};

export default TokenRefreshProvider;
