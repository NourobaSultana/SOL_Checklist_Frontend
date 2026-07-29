import api from './api';
import {
  Checklist,
  CreateChecklistDto,
} from '@/types/checklist';


export async function submitChecklist(
  data: CreateChecklistDto,
) {
  const response = await api.post(
    '/checklist',
    data,
  );

  return response.data;
}


export async function getMyHistory(): Promise<Checklist[]> {
  const response = await api.get<Checklist[]>('/checklist/my-history');

  return response.data;
}

export async function getChecklistByDate(
  date: string,
): Promise<Checklist> {
  const response = await api.get<Checklist>(
    `/checklist/my-history/${date}`,
  );

  return response.data;
}
 export async function getAllHistory() {
  const response = await api.get("/checklist/admin/history");
  return response.data;
}