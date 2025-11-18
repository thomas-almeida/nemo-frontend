'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useUserStore from '@/app/store/user-store';
import { getUserById } from '@/app/service/user-service';

export function useAuth() {
  const { data: session, status } = useSession();
  const { setUser, clearUser, setLoading, setError } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setLoading(true);
          setError(null);

          const userData = await getUserById(session.user.id);
          console.log(userData)

          if (userData) {

            setUser({
              id: session.user?.id,
              username: session.user?.name || '',
              email: session.user?.email || '',
              sessionId: userData.user.sessionId,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('User data not found');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data';
          console.error(errorMessage, error);
          setError(errorMessage);
          setUser({
            id: '',
            username: '',
            email: '',
            sessionId: '',
            isLoading: false,
            error: errorMessage,
          });
        } finally {
          setLoading(false);
        }
      } else if (status === 'unauthenticated') {
        clearUser();
      }
    };

    fetchUserData();
  }, [session, status, setUser, clearUser, setLoading, setError]);

  // Retorna o estado atual do usuário e funções úteis
  return {
    session,
    status,
    isLoading: useUserStore((state) => state.isLoading),
    error: useUserStore((state) => state.error),
    user: {
      id: useUserStore((state) => state.id),
      username: useUserStore((state) => state.username),
      email: useUserStore((state) => state.email),
      sessionId: useUserStore((state) => state.sessionId),
    },
  };
}
