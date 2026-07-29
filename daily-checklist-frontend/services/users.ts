import api from "./api";

// =======================
// Profile
// =======================

export async function getProfile() {
  const { data } = await api.get("/users/profile");
  return data;
}

export async function updateProfile(data: {
  name: string;
}) {
  const response = await api.patch(
    "/users/profile",
    data,
  );

  return response.data;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const response = await api.patch(
    "/users/change-password",
    data,
  );

  return response.data;
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();

  formData.append("avatar", file);

  const { data } = await api.patch(
    "/users/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
}

// =======================
// Admin
// =======================

export async function getUsers() {
  const { data } = await api.get("/users");

  return data;
}

export async function updateUserRole(
  id: string,
  role: string,
) {
  const { data } = await api.patch(
    `/users/${id}/role`,
    {
      role,
    },
  );

  return data;
}

export async function deleteUser(
  id: string,
) {
  const { data } = await api.delete(
    `/users/${id}`,
  );

  return data;
}