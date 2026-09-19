/**
 * Custom Hook: useAuth
 * Convenient selector for authentication state and user details.
 */

import { useSelector } from 'react-redux';

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isInitializing: auth.isInitializing,
    error: auth.error,
    role: auth.user?.role,
    fullName: auth.user?.fullName || `${auth.user?.firstName || ''} ${auth.user?.lastName || ''}`.trim(),
    companyName: auth.user?.companyName,
    branch: auth.user?.branch,
    email: auth.user?.email,
  };
};

export default useAuth;
