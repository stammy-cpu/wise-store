import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { API_BASE_URL } from '@/lib/api';

export interface SessionUser {
  id: string;
  username: string;
  isAdmin: boolean;
}

/**
 * Hook for managing user session
 * Fetches current session from server and provides logout functionality
 */
export function useSession() {
  const { data: user, isLoading } = useQuery<SessionUser | null>({
    queryKey: ['/api/auth/session'],
    retry: false,
    // Return null on 401 instead of throwing
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/session`, {
          credentials: 'include',
        });
        if (res.status === 401) return null;
        if (!res.ok) throw new Error('Session check failed');
        return await res.json();
      } catch {
        return null;
      }
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/logout', {});
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/session'], null);
      window.location.href = '/auth';
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isLoading,
    logout: logout.mutate,
  };
}
