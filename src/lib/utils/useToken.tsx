'use client';
import { useState, useEffect } from 'react';

export function useToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Получаем токен из localStorage при инициализации
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (newToken: string) => {
    console.log('Saving token:', newToken);
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  const removeToken = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  return { token, saveToken, removeToken };
} 