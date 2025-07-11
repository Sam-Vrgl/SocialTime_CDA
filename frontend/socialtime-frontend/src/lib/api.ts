// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,       // if your backend uses cookies
  headers: { 'Content-Type': 'application/json' },
});

// Optional: intercept requests to attach auth tokens
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' && localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
