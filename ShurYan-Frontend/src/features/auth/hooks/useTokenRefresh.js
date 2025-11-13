import { useEffect, useRef, useCallback } from 'react';
import useAuth from './useAuth';
import { isTokenExpired, getTokenRemainingTime } from '@/utils/tokenManager';
import authService from '@/api/services/auth.service';

/**
 * Custom Hook for Automatic Token Refresh
 * 
 * Features:
 * - Proactive refresh (before token expires)
 * - Automatic scheduling based on token expiry
 * - Cleanup on unmount
 * 
 * @param {object} options - Configuration options
 * @param {boolean} options.enabled - Enable/disable auto refresh (default: true)
 * @param {number} options.bufferMinutes - Refresh buffer time in minutes (default: 5)
 */
const useTokenRefresh = ({ enabled = true, bufferMinutes = 5 } = {}) => {
  const { accessToken, refreshToken, setTokens, logout } = useAuth();
  const refreshTimerRef = useRef(null);
  const isRefreshingRef = useRef(false);

  /**
   * Schedule the next token refresh
   */
  const scheduleTokenRefresh = useCallback((token) => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!token || !enabled) return;

    // Calculate when to refresh (buffer minutes before expiry)
    const remainingTime = getTokenRemainingTime(token);
    const bufferTime = bufferMinutes * 60 * 1000;
    const refreshTime = Math.max(0, remainingTime - bufferTime);

    console.log('📅 Token refresh scheduled in:', refreshTime / 1000 / 60, 'minutes');

    // Schedule refresh
    refreshTimerRef.current = setTimeout(() => {
      console.log('⏰ Token refresh timer triggered');
      // Call refresh directly to avoid circular dependency
      if (!isRefreshingRef.current) {
        isRefreshingRef.current = true;
        authService.refreshToken(accessToken, refreshToken)
          .then(response => {
            if (response.isSuccess && response.data) {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
              setTokens(newAccessToken, newRefreshToken);
              console.log('✅ Token refreshed successfully');
              scheduleTokenRefresh(newAccessToken);
            } else {
              throw new Error(response.message || 'Failed to refresh token');
            }
          })
          .catch(error => {
            console.error('❌ Token refresh failed:', error);
            logout();
          })
          .finally(() => {
            isRefreshingRef.current = false;
          });
      }
    }, refreshTime);
  }, [enabled, bufferMinutes, accessToken, refreshToken, setTokens, logout]);

  /**
   * Refresh the access token
   */
  const refreshAccessToken = useCallback(async () => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshingRef.current) {
      console.log('🔄 Token refresh already in progress...');
      return;
    }

    // Check if we have required tokens
    if (!accessToken || !refreshToken) {
      console.warn('⚠️ Missing tokens for refresh');
      return;
    }

    // Check if token actually needs refresh
    if (!isTokenExpired(accessToken, bufferMinutes)) {
      console.log('✅ Token still valid, no refresh needed');
      return;
    }

    console.log('🔄 Starting token refresh...');
    isRefreshingRef.current = true;

    try {
      const response = await authService.refreshToken(accessToken, refreshToken);
      
      if (response.isSuccess && response.data) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        // Update tokens in auth store
        setTokens(newAccessToken, newRefreshToken);
        
        console.log('✅ Token refreshed successfully');
        console.log('⏰ New token expires in:', getTokenRemainingTime(newAccessToken) / 1000 / 60, 'minutes');
        
        // Schedule next refresh
        scheduleTokenRefresh(newAccessToken);
      } else {
        throw new Error(response.message || 'Failed to refresh token');
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      
      // If refresh fails, logout user
      console.log('🚪 Logging out due to refresh failure...');
      logout();
    } finally {
      isRefreshingRef.current = false;
    }
  }, [accessToken, refreshToken, bufferMinutes, setTokens, logout, scheduleTokenRefresh]);

  /**
   * Initialize token refresh on mount and when token changes
   */
  useEffect(() => {
    if (!enabled || !accessToken) return;

    console.log('🔐 Initializing token refresh system...');
    
    // Check if token is already expired
    if (isTokenExpired(accessToken, 0)) {
      console.log('⚠️ Token already expired, refreshing immediately...');
      refreshAccessToken();
    } else {
      // Schedule refresh
      scheduleTokenRefresh(accessToken);
    }

    // Cleanup on unmount
    return () => {
      if (refreshTimerRef.current) {
        console.log('🧹 Cleaning up token refresh timer');
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [enabled, accessToken, scheduleTokenRefresh, refreshAccessToken]);

  /**
   * Manual refresh trigger (for testing or forced refresh)
   */
  const manualRefresh = useCallback(() => {
    console.log('🔄 Manual token refresh triggered');
    refreshAccessToken();
  }, [refreshAccessToken]);

  return {
    refreshAccessToken: manualRefresh,
    isRefreshing: isRefreshingRef.current,
  };
};

export default useTokenRefresh;
