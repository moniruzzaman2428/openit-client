import api from './api';

export const getAttendance = async (params = {}) => {
  const { data } = await api.get('/attendance', { params });
  return data;
};

export const markAttendance = async (attendanceData) => {
  const { data } = await api.post('/attendance', attendanceData);
  return data;
};

export const updateAttendance = async (id, updateData) => {
  const { data } = await api.patch(`/attendance/${id}`, updateData);
  return data;
};

export const getBatchStudents = async (batchId, date) => {
  const params = date ? { date } : {};
  const { data } = await api.get(`/attendance/batch/${batchId}/students`, { params });
  return data;
};
