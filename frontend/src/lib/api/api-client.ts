import axios from 'axios';
import { ApiResponse, PaginatedResponse } from './api-client.type';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const api = {
  get: async <T>(url: string): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url);
    return response.data;
  },

  getPaginated: async <T>(url: string): Promise<PaginatedResponse<T>> => {
    const response = await apiClient.get<PaginatedResponse<T>>(url);
    return response.data;
  },

  post: async <T>(url: string, data: unknown): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data: unknown): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url);
    return response.data;
  },
}; 