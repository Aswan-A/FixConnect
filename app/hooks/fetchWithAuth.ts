import { useState, useEffect } from 'react';
import { PUBLIC_URL } from 'config';

type User = {
  profilePic?: string;
  name: string;
};

// ✅ Refresh token logic used both in hook and globally
async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token available');

  const res = await fetch(`${PUBLIC_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error('Failed to refresh access token');

  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
}

// 🌍 Main fetch wrapper usable everywhere
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = localStorage.getItem('accessToken');

  const authHeaders = token
    ? { Authorization: `Bearer ${token}`, ...(options.headers || {}) }
    : options.headers;

  let res = await fetch(url, { ...options, headers: authHeaders });

  if (res.status === 401) {
    try {
      token = await refreshAccessToken();
      const retryHeaders = {
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      };
      res = await fetch(url, { ...options, headers: retryHeaders });
    } catch (refreshErr) {
      console.error('Token refresh failed:', refreshErr);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw refreshErr;
    }
  }

  return res;
}

// ✅ React hook for authentication
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const res = await fetchWithAuth(`${PUBLIC_URL}/api/profile/`);
      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return { user, isLoading, logout, refreshAuth: checkAuth, fetchWithAuth };
}
