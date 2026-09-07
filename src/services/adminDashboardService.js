import api from './api';

/**
 * Admin dashboard data comes from a dedicated protected aggregate endpoint.
 * This avoids pagination-related wrong totals and always sends the auth token
 * through the project's shared axios instance.
 */
export const getAdminDashboardData = async () => {
  const { data } = await api.get('/dashboard/admin');
  return data?.data || {};
};

export default { getAdminDashboardData };
