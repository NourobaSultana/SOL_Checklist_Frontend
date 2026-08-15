export type UserRole =
  | 'admin'
  | 'sub_admin'
  | 'user';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  name: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}