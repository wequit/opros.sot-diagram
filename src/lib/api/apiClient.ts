import { getCookie } from './login';
import { deleteCookie } from './login';

interface ApiClientConfig {
  baseURL: string;
  endpoint: string;
}

export class ApiClient {
  private baseURL: string;
  private endpoint: string;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.endpoint = config.endpoint;
  }

  async fetchData() {
    try {
      const token = getCookie('access_token');

      if (!token) {
        throw new Error('Токен не найден');
      }

      const queryParams = new URLSearchParams({
        start_date: '2025-01-01',
        end_date: '2025-01-31'
      });

      const response = await fetch(`${this.baseURL}${this.endpoint}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        deleteCookie('access_token');
        throw new Error('Токен недействителен или просрочен');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при получении данных');
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      throw error;
    }
  }
} 