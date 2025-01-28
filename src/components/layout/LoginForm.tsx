import React, { useState } from 'react';
import { loginApi } from '@/lib/api/login';
import { useAuth } from '@/lib/utils/AuthContext';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await loginApi.login({ username, password });
      if (result && result.access) {
        await login(result.access);
      } else {
        setError('Access токен отсутствует в ответе');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[500px] bg-white p-12 rounded-lg shadow-sm">
      <h2 className="text-[28px] font-normal text-center mb-8">Вход в систему</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-base text-gray-600 mb-2">
            Имя пользователя
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-[#F8F9FF] rounded-lg text-base
                     outline-none transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-base text-gray-600 mb-2">
            Пароль
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#F8F9FF] rounded-lg text-base
                     outline-none transition-all duration-200"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2563EB] text-white py-3 px-4 rounded-lg text-base
                   hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 