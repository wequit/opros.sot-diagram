import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchCurrentUser } from '@/lib/api/cacheService';

interface UserContextType {
  currentUser: any | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await fetchCurrentUser();
      setCurrentUser(userData);
    } catch (err) {
      setError('Ошибка загрузки данных пользователя');
      console.error('Ошибка загрузки пользователя:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <UserContext.Provider value={{ currentUser, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
