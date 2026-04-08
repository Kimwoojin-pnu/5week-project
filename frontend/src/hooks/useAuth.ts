import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getMe } from '../api/auth';

export const useAuth = () => {
  const { user, token, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      setLoading(true);
      getMe()
        .then(setUser)
        .catch(() => {
          useAuthStore.getState().logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  return { user, token, isLoading };
};
