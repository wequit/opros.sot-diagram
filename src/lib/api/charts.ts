"use client";

import { fetchWithAuth } from "./login"; 

const cache: { [key: string]: Promise<any> } = {};

const buildQueryAndCacheKey = (baseKey: string, params: { year?: string; quarter?: number; month?: number }) => {
  const queryString = new URLSearchParams();
  if (params.year) queryString.append("year", params.year);
  if (params.quarter) queryString.append("quarter", params.quarter.toString());
  if (params.month) queryString.append("month", params.month.toString());

  const cacheKey = `${baseKey}_${queryString.toString()}`;
  return { queryString: queryString.toString(), cacheKey };
};

export const getRadarRepublicData = async (params: { year?: string; quarter?: number; month?: number }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey("radar_republic", params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/radar/republic/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getRadarCourtData = async (courtId: string, params: { year?: string; quarter?: number; month?: number }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey(`radar_court_${courtId}`, params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/radar/${courtId}/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getBarRepublicData = async (params: { year?: string; quarter?: number; month?: number }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey("bar_republic", params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/bar/republic/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getBarCourtData = async (courtId: string, params: { year?: string; quarter?: number; month?: number }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey(`bar_court_${courtId}`, params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/bar/${courtId}/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getCircleRepublicData = async (params: { year?: string; quarter?: number; month?: number }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey("circle_republic", params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/circle/republic/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getCircleCourtData = async (courtId: string, params: { year?: string; quarter?: number; month?: number }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey(`circle_court_${courtId}`, params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/circle/${courtId}/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getColumnRepublicData = async (params: { year?: string; quarter?: number; month?: number }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey("column_republic", params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/column/republic/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getColumnCourtData = async (courtId: string, params: { year?: string; quarter?: number; month?: number }) => {
  const { queryString, cacheKey } = buildQueryAndCacheKey(`column_court_${courtId}`, params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/column/${courtId}/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getProgressRepublicData = async (params: { year?: string; quarter?: number; month?: number }) => {
   const { queryString, cacheKey } = buildQueryAndCacheKey("progress_republic", params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/progress/republic/?${queryString}`);
  }
  return await cache[cacheKey];
};

export const getProgressCourtData = async (courtId: string, params: { year?: string; quarter?: number; month?: number }) => {
   const { queryString, cacheKey } = buildQueryAndCacheKey(`progress_court_${courtId}`, params);
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/progress/${courtId}/?${queryString}`);
  }
  return await cache[cacheKey];
};