import apiClient from './client';
import { User } from '../types';

export const getMe = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/api/auth/me');
  return data;
};

export const getGoogleLoginUrl = () => {
  return `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/google`;
};
