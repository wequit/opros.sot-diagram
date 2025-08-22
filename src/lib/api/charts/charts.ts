"use client";

import { fetchWithAuth } from "../login";

const cache: { [key: string]: Promise<any> } = {};

const buildQueryAndCacheKey = (baseKey: string, params: { startDate?: string; endDate?: string }) => {
  const queryString = new URLSearchParams();
  if (params.startDate) queryString.append("start_date", params.startDate);
  if (params.endDate) queryString.append("end_date", params.endDate);

  const cacheKey = `${baseKey}_${queryString.toString()}`;
  return { queryString: queryString.toString(), cacheKey };
};

export const getColumnRepublicData = async (params: { startDate?: string; endDate?: string }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey("column_republic", params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/column/republic/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getColumnRegionData = async (params: { startDate?: string; endDate?: string }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey("column_region", params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/column/region/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getColumnCourtData = async (courtId: string, params: { startDate?: string; endDate?: string }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey(`column_court_${courtId}`, params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/column/${courtId}/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getAnswerCourtsData = async (answerId: number) => {
  const cacheKey = `answer_courts_${answerId}`;
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`answers/${answerId}/courts/`);
  }
  
  return await cache[cacheKey];
};