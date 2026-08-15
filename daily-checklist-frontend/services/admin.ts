import api from "./api";

export async function getAllChecklistHistory() {
  const { data } = await api.get("/checklist/history");

  return data;
}

export async function getUserChecklistHistory(id: string) {
  const { data } = await api.get(`/checklist/user/${id}`);

  return data;
}

export async function getAllAppointmentHistory() {
  const response = await api.get("/appointment/history");

  return response.data;
}

export async function getAllDailyExpanseHistory() {
  const response = await api.get("/dailyexpanse/history");

  return response.data;
}

// ==========================================
// ADMIN HISTORY
// ==========================================

export async function getAdminHistory(params?: {
  type?: string;
  userId?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}) {
  const response = await api.get("/admin/history", {
    params,
  });

  return response.data;
}

// ==========================================
// DELETE HISTORY
// ==========================================

export async function deleteAdminHistory(type: string, id: string) {
  const response = await api.delete(`/admin/history/${type}/${id}`);

  return response.data;
}

export async function getAdminUsers() {
  const response = await api.get("/admin/users");

  return response.data;
}
