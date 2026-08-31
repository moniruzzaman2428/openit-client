import api from './api';

export const getPayments = async (params = {}) => {
  const { data } = await api.get('/payments', { params });
  return data;
};

export const getPayment = async (id) => {
  const { data } = await api.get(`/payments/${id}`);
  return data;
};

export const createPayment = async (paymentData) => {
  const { data } = await api.post('/payments', paymentData);
  return data;
};

export const getPaymentSummary = async (studentId) => {
  const url = studentId ? `/payments/summary/${studentId}` : '/payments/summary';
  const { data } = await api.get(url);
  return data;
};
