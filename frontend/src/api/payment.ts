import apiClient from './client';

export const createCheckout = async (): Promise<{ checkout_url: string }> => {
  const { data } = await apiClient.post<{ checkout_url: string }>('/api/payment/checkout');
  return data;
};
