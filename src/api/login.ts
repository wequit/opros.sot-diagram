'use client';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Strict`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;  
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Декодируем токен
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const reLogin = async (refreshToken: string): Promise<string | null> => {
  try {
    const response = await fetch('https://opros.sot.kg:443/api/v1/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }), // Отправляем refresh токен
    });

    if (!response.ok) {
      deleteCookie('access_token');
      deleteCookie('refresh_token');
      return null;
    }

    const data: LoginResponse = await response.json();
    setCookie('access_token', data.access);
    setCookie('refresh_token', data.refresh);
    return data.access;
  } catch (error) {
    console.error('Ошибка при обновлении токенов:', error);
    return null;
  }
};

const handleUnauthorized = () => {
  deleteCookie('access_token');
  deleteCookie('refresh_token');
  window.location.href = '/login';
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let accessToken = getCookie('access_token');
  const refreshToken = getCookie('refresh_token');

  if (!accessToken || isTokenExpired(accessToken)) {
    if (refreshToken) {
      const newAccessToken = await reLogin(refreshToken);
      if (newAccessToken) {
        accessToken = newAccessToken;
      } else {
        handleUnauthorized();
        return null;
      }
    } else {
      handleUnauthorized();
      return null;
    }
  }

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    handleUnauthorized();
    return null;
  }

  if (!response.ok) {
    throw new Error('Ошибка выполнения запроса');
  }

  return response.json();
};

export const getAssessmentData = async () => {
  return await fetchWithAuth('https://opros.sot.kg:443/api/v1/assessment/');
};

export const getCurrentUser = async () => {
  return await fetchWithAuth('https://opros.sot.kg:443/api/v1/current_user/');
};

export const getRayonAssessmentData = async () => {
  const token = getCookie('access_token');
  
  try { 
    const response = await fetch('https://opros.sot.kg/api/v1/assessment/rayon/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rayon assessment data:', error);
    throw error;
  }
};

export const loginApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch('https://opros.sot.kg:443/api/v1/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка авторизации');
    }

    const data: LoginResponse = await response.json();
    setCookie('access_token', data.access);
    setCookie('refresh_token', data.refresh);
    return data;
  },

  
};
