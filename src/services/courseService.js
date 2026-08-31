import api from './api';

export const getCourses = async (params = {}) => {
  const { data } = await api.get('/courses', { params });
  return data;
};

export const getCourse = async (slug) => {
  const { data } = await api.get(`/courses/${slug}`);
  return data;
};

export const createCourse = async (courseData) => {
  const { data } = await api.post('/courses', courseData);
  return data;
};

export const updateCourse = async (id, courseData) => {
  const { data } = await api.patch(`/courses/${id}`, courseData);
  return data;
};

export const deleteCourse = async (id) => {
  const { data } = await api.delete(`/courses/${id}`);
  return data;
};
