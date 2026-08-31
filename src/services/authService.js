import api from './api';

export const login = async (login, password) => {
  const { data } = await api.post('/auth/login', { login, password });
  return data;
};

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post('/auth/reset-password', { token, password });
  return data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.patch('/auth/change-password', {
    currentPassword,
    newPassword
  });
  return data;
};
