import {jwtDecode } from 'jwt-decode';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

interface AssessmentData {
  assessment_data: CourtData[];
}

interface CourtData {
  court_id: number;
  court: string;
  instantiation: string;
  overall_assessment: number;
  assessment: Assessment[];
  assessment_count: string;
}

interface Assessment {
  aspect: string;
  court_avg: number;
  assessment_count: string;
}

export const loginApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch('https://opros.sot.kg:443/api/v1/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка авторизации');
    }

    const data = await response.json();
    const userId = jwtDecode<{ user_id: string }>(data.access).user_id;
    setCookie('refresh_token', data.refresh);
    return { ...data, userId };
  },
};

export const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Strict`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const getCurrentUser = async (token: string) => {
  const response = await fetch('https://opros.sot.kg:443/api/v1/current_user/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка получения данных пользователя');
  }

  return response.json();
};

export const getAssessmentData = async (token: string) => {
  const response = await fetch('https://opros.sot.kg:443/api/v1/assessment/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка получения данных оценки');
  }

  return response.json();
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getCookie('refresh_token');
  if (!refreshToken) {
    throw new Error("Refresh token is not available");
  }

  const response = await fetch('https://opros.sot.kg:443/api/v1/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка обновления токена');
  }

  const data = await response.json();
  setCookie('access_token', data.access); // Сохраняем новый access_token
  return data.access; // Возвращаем новый access_token
};