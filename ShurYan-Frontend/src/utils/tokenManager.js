/**
 * Token Manager Utility
 * Handles JWT token validation, expiry check, and proactive refresh
 */

/**
 * Decode JWT token payload
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token, bufferMinutes = 5) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  
  const expiryTime = payload.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const bufferTime = bufferMinutes * 60 * 1000;
  
  // Token is expired if: current time + buffer >= expiry time
  return (currentTime + bufferTime) >= expiryTime;
};

/**
 * Get token expiry time in milliseconds
 */
export const getTokenExpiry = (token) => {
  const payload = decodeToken(token);
  return payload?.exp ? payload.exp * 1000 : null;
};

/**
 * Get remaining time until token expires
 */
export const getTokenRemainingTime = (token) => {
  const expiryTime = getTokenExpiry(token);
  if (!expiryTime) return 0;
  
  const remainingTime = expiryTime - Date.now();
  return Math.max(0, remainingTime);
};

/**
 * Format remaining time to human-readable string
 */
export const formatRemainingTime = (milliseconds) => {
  if (milliseconds <= 0) return 'منتهي';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) return `${hours}س ${minutes}د`;
  if (minutes > 0) return `${minutes}د ${seconds}ث`;
  return `${seconds}ث`;
};

/**
 * Get user info from token
 */
export const getUserFromToken = (token) => {
  const payload = decodeToken(token);
  if (!payload) return null;
  
  return {
    id: payload.sub || payload.userId || payload.id,
    email: payload.email,
    role: payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    name: payload.name || payload.given_name,
    // other claims as needed
  };
};