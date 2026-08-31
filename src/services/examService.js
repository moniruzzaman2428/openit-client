import api from './api';

export const getExams = async (params = {}) => {
  const { data } = await api.get('/exams', { params });
  return data;
};

export const createExam = async (examData) => {
  const { data } = await api.post('/exams', examData);
  return data;
};

export const updateExam = async (id, examData) => {
  const { data } = await api.patch(`/exams/${id}`, examData);
  return data;
};

export const deleteExam = async (id) => {
  const { data } = await api.delete(`/exams/${id}`);
  return data;
};
