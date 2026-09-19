import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';
import { fetchCurrentUser, logoutUser } from './store/authSlice';

export const App = () => {
  const dispatch = useDispatch();

  // On initial mount, attempt to fetch current user to restore session from cookie
  useEffect(() => {
    dispatch(fetchCurrentUser());

    // Listen for unauthorized events emitted by Axios interceptor
    const handleUnauthorized = () => {
      dispatch(logoutUser());
    };

    window.addEventListener('bizcore:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('bizcore:unauthorized', handleUnauthorized);
    };
  }, [dispatch]);

  return (
    <>
      {/* Central Application Router */}
      <AppRouter />

      {/* Global Enterprise Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#111827',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#111827',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#111827',
            },
          },
        }}
      />
    </>
  );
};

export default App;
