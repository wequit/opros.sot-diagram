"use client";

import { fetchWithAuth } from "./login"; 

// Объект для кэширования результатов запросов
const cache: { [key: string]: Promise<any> } = {};

export const getRadarRepublicData = async () => {
  const cacheKey = "radar_republic";
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth("chart/radar/republic/");
  }
  return await cache[cacheKey];
};

export const getRadarCourtData = async (courtId: string) => {
  const cacheKey = `radar_court_${courtId}`;
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/radar/${courtId}/`);
  }
  return await cache[cacheKey];
};

export const getBarRepublicData = async () => {
  const cacheKey = "bar_republic";
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth("chart/bar/republic/");
  }
  return await cache[cacheKey];
};

export const getBarCourtData = async (courtId: string) => {
  const cacheKey = `bar_court_${courtId}`;
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/bar/${courtId}/`);
  }
  return await cache[cacheKey];
};

export const getCircleRepublicData = async () => {
  const cacheKey = "circle_republic";
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth("chart/circle/republic/");
  }
  return await cache[cacheKey];
};

export const getCircleCourtData = async (courtId: string) => {
  const cacheKey = `circle_court_${courtId}`;
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/circle/${courtId}/`);
  }
  return await cache[cacheKey];
};

export const getColumnRepublicData = async () => {
  const cacheKey = "column_republic";
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth("chart/column/republic/");
  }
  return await cache[cacheKey];
};

export const getColumnCourtData = async (courtId: string) => {
  const cacheKey = `column_court_${courtId}`;
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/column/${courtId}/`);
  }
  return await cache[cacheKey];
};

export const getProgressRepublicData = async () => {
  const cacheKey = "progress_republic";
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth("chart/progress/republic/");
  }
  return await cache[cacheKey];
};

export const getProgressCourtData = async (courtId: string) => {
  const cacheKey = `progress_court_${courtId}`;
  if (!cache[cacheKey]) {
    cache[cacheKey] = fetchWithAuth(`chart/progress/${courtId}/`);
  }
  return await cache[cacheKey];
};