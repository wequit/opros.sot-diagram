interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

export const loginApi = {
  login: async (credentials: LoginCredentials): Promise<{ token: string }> => {
    try {
      const response = await fetch('https://opros.sot.kg/api/v1/login/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка авторизации');
      }

      const rawResponse = await response.text();
      console.log('Raw server response:', rawResponse);

      let data;
      try {
        data = JSON.parse(rawResponse);
        console.log('Parsed response:', data);
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Неверный формат ответа от сервера');
      }

      if (data.access) {
        return { token: data.access };
      } else if (data.token) {
        return { token: data.token };
      } else if (typeof data === 'string') {
        return { token: data };
      }

      console.error('Unexpected response structure:', data);
      throw new Error('Токен отсутствует в ответе');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
}; 