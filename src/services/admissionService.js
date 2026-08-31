import api from './api';

export const submitAdmission = async (formData) => {
  const { data } = await api.post('/admissions', formData);
  return data;
};

export const getAdmissions = async (params = {}) => {
  const { data } = await api.get('/admissions', { params });
  return data;
};

export const getAdmission = async (id) => {
  const { data } = await api.get(`/admissions/${id}`);
  return data;
};

export const updateAdmission = async (id, updateData) => {
  const { data } = await api.patch(`/admissions/${id}`, updateData);
  return data;
};

export const deleteAdmission = async (id) => {
  const { data } = await api.delete(`/admissions/${id}`);
  return data;
};
