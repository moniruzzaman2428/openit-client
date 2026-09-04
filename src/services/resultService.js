import api from './api';

export const getResults = async (params = {}) => {
  const { data } = await api.get('/results', { params });
  return data;
};

// নতুন: নির্দিষ্ট স্টুডেন্ট আইডি দিয়ে রেজাল্ট খোঁজা (Backend এ এন্ডপয়েন্ট থাকলে)
export const getResultByStudentId = async (studentId) => {
  const { data } = await api.get(`/results/student/${studentId}`);
  return data;
};

export const createResult = async (resultData) => {
  const { data } = await api.post('/results', resultData);
  return data;
};

export const updateResult = async (id, updateData) => {
  const { data } = await api.patch(`/results/${id}`, updateData);
  return data;
};

export const publishExamResults = async (examId) => {
  const { data } = await api.post(`/results/publish/${examId}`);
  return data;
};