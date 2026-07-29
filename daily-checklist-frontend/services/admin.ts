import api from './api';

export async function getAllChecklistHistory() {
  const { data } = await api.get(
    '/checklist/history',
  );

  return data;
}

export async function getUserChecklistHistory(
  id: string,
) {
  const { data } = await api.get(
    `/checklist/user/${id}`,
  );

  return data;
}