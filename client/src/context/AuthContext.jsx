import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('whms_token');
      const storedUser = localStorage.getItem('whms_user');

      if (token && storedUser) {
        try {
          const { data } = await authAPI.getMe();
          setUser(data.data);
          localStorage.setItem('whms_user', JSON.stringify(data.data));
        } catch (error) {
          localStorage.removeItem('whms_token');
          localStorage.removeItem('whms_refresh_token');
          localStorage.removeItem('whms_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    const userData = data.data;

    localStorage.setItem('whms_token', userData.token);
    localStorage.setItem('whms_refresh_token', userData.refreshToken);
    localStorage.setItem('whms_user', JSON.stringify(userData));

    setUser(userData);
    return userData;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('whms_token');
    localStorage.removeItem('whms_refresh_token');
    localStorage.removeItem('whms_user');
    setUser(null);
  }, []);

  // Check if user has permission for a module
  const hasPermission = useCallback((module, access = 'read') => {
    if (!user || !user.role) return false;

    // Admin always has access
    if (user.role.name === 'Admin' && user.role.isSystem) return true;

    const permission = user.role.permissions?.find(p => p.module === module);
    if (!permission || permission.access === 'none') return false;
    if (access === 'full') return permission.access === 'full';
    return true; // 'read' is satisfied by both 'read' and 'full'
  }, [user]);

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
