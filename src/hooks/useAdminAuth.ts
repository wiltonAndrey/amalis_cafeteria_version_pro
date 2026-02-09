import { useCallback, useEffect, useMemo, useState } from 'react';

interface AdminUser {
  id: string;
  email: string;
}

interface AuthResponse {
  ok: boolean;
  admin?: AdminUser;
  error?: string;
}

const parseJson = async (response: Response): Promise<any> => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const useAdminAuth = (autoVerify: boolean = true) => {
  const [loading, setLoading] = useState<boolean>(autoVerify);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async (): Promise<AuthResponse> => {
    if (typeof fetch !== 'function') {
      const fallback = { ok: false, error: 'fetch_unavailable' };
      setLoading(false);
      setIsAuthenticated(false);
      setAdmin(null);
      setError(fallback.error);
      return fallback;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify.php', {
        credentials: 'same-origin',
      });
      const data = await parseJson(response);

      if (!response.ok || !data?.ok) {
        setIsAuthenticated(false);
        setAdmin(null);
        const authError = data?.error || 'unauthorized';
        setError(authError);
        return { ok: false, error: authError };
      }

      const nextAdmin = {
        id: String(data.admin?.id ?? ''),
        email: String(data.admin?.email ?? ''),
      };
      setIsAuthenticated(true);
      setAdmin(nextAdmin);
      return { ok: true, admin: nextAdmin };
    } catch {
      setIsAuthenticated(false);
      setAdmin(null);
      setError('network_error');
      return { ok: false, error: 'network_error' };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    if (typeof fetch !== 'function') {
      const fallback = { ok: false, error: 'fetch_unavailable' };
      setError(fallback.error);
      return fallback;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });
      const data = await parseJson(response);

      if (!response.ok || !data?.ok) {
        const authError = data?.error || 'invalid_credentials';
        setIsAuthenticated(false);
        setAdmin(null);
        setError(authError);
        return { ok: false, error: authError };
      }

      const nextAdmin = {
        id: String(data.admin?.id ?? ''),
        email: String(data.admin?.email ?? email),
      };
      setIsAuthenticated(true);
      setAdmin(nextAdmin);
      return { ok: true, admin: nextAdmin };
    } catch {
      setIsAuthenticated(false);
      setAdmin(null);
      setError('network_error');
      return { ok: false, error: 'network_error' };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoVerify) {
      void verify();
    } else {
      setLoading(false);
    }
  }, [autoVerify, verify]);

  return useMemo(
    () => ({
      loading,
      isAuthenticated,
      admin,
      error,
      verify,
      login,
    }),
    [loading, isAuthenticated, admin, error, verify, login]
  );
};

