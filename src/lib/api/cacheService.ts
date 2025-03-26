import { getCookie } from "./login";

const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

interface CachedData {
  data: any;
  timestamp: number;
}

const cache: Record<string, CachedData> = {};

export const fetchWithCache = async (url: string, options?: RequestInit) => {
  const cacheKey = `${url}_${JSON.stringify(options || {})}`;
  
  // Проверяем наличие данных в кэше
  const cachedData = cache[cacheKey];
  const now = Date.now();
  
  // Если данные есть и они не устарели, возвращаем их
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    return { ...cachedData.data };
  }
  
  // Иначе выполняем запрос
  const response = await fetch(url, options);
  
  // Проверяем, что ответ успешный и это JSON
  if (!response.ok) {
    throw new Error(`API ответил с ошибкой: ${response.status}`);
  }
  
  // Проверяем, что Content-Type содержит application/json
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Ответ API не в формате JSON: ${contentType}`);
  }
  
  const data = await response.json();
  
  // Сохраняем в кэш
  cache[cacheKey] = {
    data,
    timestamp: now
  };
  
  return data;
};

// Специализированные функции для частых запросов
export const fetchCurrentUser = async () => {
  try {
    return await fetchWithCache("https://opros.sot.kg/api/v1/current_user/", {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    return null; // Возвращаем null вместо ошибки, чтобы не блокировать приложение
  }
};

export const fetchRemarks = async () => {
  try {
    return await fetchWithCache("https://opros.sot.kg/api/v1/feedback/", {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
  } catch (error) {
    console.error("Ошибка при получении замечаний:", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};