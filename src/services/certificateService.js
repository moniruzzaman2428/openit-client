import api from './api';

export const getCertificates = async (params = {}) => {
  const { data } = await api.get('/certificates', { params });
  return data;
};

export const createCertificate = async (certData) => {
  const { data } = await api.post('/certificates', certData);
  return data;
};

export const verifyCertificate = async (certificateId) => {
  const { data } = await api.get(`/certificates/verify/${certificateId}`);
  return data;
};

export const revokeCertificate = async (id) => {
  const { data } = await api.patch(`/certificates/${id}/revoke`);
  return data;
};
