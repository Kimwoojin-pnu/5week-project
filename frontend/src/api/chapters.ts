import apiClient from './client';
import { Chapter, ChapterDetail } from '../types';

export const getChapters = async (): Promise<Chapter[]> => {
  const { data } = await apiClient.get<Chapter[]>('/api/chapters');
  return data;
};

export const getChapter = async (id: number): Promise<ChapterDetail> => {
  const { data } = await apiClient.get<ChapterDetail>(`/api/chapters/${id}`);
  return data;
};
