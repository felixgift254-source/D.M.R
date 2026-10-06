import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Access token stored in memory (not localStorage) to protect against XSS.
  // The refresh token lives in an HTTP-only cookie managed by the browser.
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Attempts to get a new access token using the HTTP-only refresh cookie.
   * Called on app init and automatically on 401 responses.
   */
  const attemptTokenRefresh = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include' // Send the HTTP-only refresh cookie
      });
      if (response.ok) {
        const data = await response.json();
        return data.token;
      }
    } catch (err) {
      // Network error or server down — not a security issue, just unavailable
    }
    return null;
  }, []);

  const fetchCurrentUser = useCallback(async (authToken) => {
    if (!authToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: try to restore session using the refresh cookie (silent re-login)
  useEffect(() => {
    const restoreSession = async () => {
      if (!navigator.onLine) {
        // Offline: restore non-sensitive user profile from sessionStorage cache
        const cached = sessionStorage.getItem('dmr_user_cache');
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch (_) {}
        }
        setLoading(false);
        return;
      }

      const refreshedToken = await attemptTokenRefresh();
      if (refreshedToken) {
        setToken(refreshedToken);
        await fetchCurrentUser(refreshedToken);
      } else {
        setLoading(false);
      }
    };
    restoreSession();
  }, [attemptTokenRefresh, fetchCurrentUser]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    if (userData) {
      sessionStorage.setItem('dmr_user_cache', JSON.stringify({
        id: userData.id,
        role: userData.role,
        currentPhase: userData.currentPhase
      }));
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('dmr_user_cache');
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (_) {
      // Ignore network errors on logout
    }
  };

  /**
   * Returns an Authorization header object for API calls.
   * Returns an empty object if there is no token (caller should redirect to login).
   */
  const getAuthHeader = () => {
    if (!token) return {};
    return { 'Authorization': `Bearer ${token}` };
  };

  /**
   * Wrapper for fetch that automatically retries with a refreshed token on 401.
   * Use this for all authenticated API calls to handle token expiry transparently.
   */
  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { ...options.headers, ...getAuthHeader() };
    let response = await fetch(url, { ...options, headers, credentials: 'include' });

    if (response.status === 401 && token) {
      // Access token expired — try refreshing
      const newToken = await attemptTokenRefresh();
      if (newToken) {
        setToken(newToken);
        const retryHeaders = { ...options.headers, 'Authorization': `Bearer ${newToken}` };
        response = await fetch(url, { ...options, headers: retryHeaders, credentials: 'include' });
      } else {
        // Refresh also failed — user must log in again
        setToken(null);
        setUser(null);
      }
    }

    return response;
  }, [token, attemptTokenRefresh]);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, getAuthHeader, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
