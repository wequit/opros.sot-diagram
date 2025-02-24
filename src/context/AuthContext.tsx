'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, getCookie, deleteCookie } from '@/api/login';
import { getCurrentUser } from '@/api/login';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
  user: { first_name: string; last_name: string; court: string; role: string } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  getToken: () => null,
  user: null
});
// const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ first_name: string; last_name: string; court: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie('access_token');
      setIsAuthenticated(!!token);
      if (token) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Ошибка при получении текущего пользователя:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (token: string) => {
    try {
      setCookie('access_token', token);
      setIsAuthenticated(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Ошибка при логине:', error);
    }
  };

  const logout = () => {
    deleteCookie('access_token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const getToken = () => {
    return getCookie('access_token');
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getToken, user }}>
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