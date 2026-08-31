import api from './api';

export const getBatches = async (params = {}) => {
  const { data } = await api.get('/batches', { params });
  return data;
};

export const getBatch = async (id) => {
  const { data } = await api.get(`/batches/${id}`);
  return data;
};

export const createBatch = async (batchData) => {
  const { data } = await api.post('/batches', batchData);
  return data;
};

export const updateBatch = async (id, batchData) => {
  const { data } = await api.patch(`/batches/${id}`, batchData);
  return data;
};

export const deleteBatch = async (id) => {
  const { data } = await api.delete(`/batches/${id}`);
  return data;
};
