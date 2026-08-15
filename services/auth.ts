import api from './api';

import {
  LoginDto,
  RegisterDto,
} from '@/types/auth';

export const registerUser = async (
  data: RegisterDto,
) => {
  const response = await api.post(
    '/auth/register',
    data,
  );

  return response.data;
};

export const loginUser = async (
  data: LoginDto,
) => {
  const response = await api.post(
    '/auth/login',
    data,
  );

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/me');

  return response.data;
};