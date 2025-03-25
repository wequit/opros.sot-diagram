import { getCookie } from './login';
import { deleteCookie } from './login';

interface ApiClientConfig {
  baseURL: string;
  endpoint: string;
}

interface FetchParams {
  startDate?: string;
  endDate?: string;
  year?: string;
  quarter?: number;
  month?: number;
}

export class ApiClient {
  private baseURL: string;
  private endpoint: string;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.endpoint = config.endpoint;
  }

  async fetchData(courtId: number | string | null, params: FetchParams = { year: '2025' }) {
    try {
      const token = getCookie('access_token');

      if (!token) {
        throw new Error('Токен не найден');
      }

      const queryParams = new URLSearchParams();
      
      if (params.year && !params.quarter && !params.month && !params.startDate && !params.endDate) {
        queryParams.append('year', params.year);
      } else if (params.quarter !== undefined) {
        queryParams.append('year', params.year || '2025');
        queryParams.append('quarter', params.quarter.toString());
      } else if (params.month !== undefined) {
        queryParams.append('year', params.year || '2025');
        queryParams.append('month', params.month.toString());
      } else {
        queryParams.append('start_date', params.startDate || '2025-01-01');
        queryParams.append('end_date', params.endDate || '2025-12-31');
      }

      let path = this.endpoint;
      if (courtId) {
        const effectiveCourtId = typeof courtId === 'string' ? parseInt(courtId, 10) || courtId : courtId;
        path += `${effectiveCourtId}/`;
      }

      let url = `${this.baseURL}${path}`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }


      const response = await fetch(url, {
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