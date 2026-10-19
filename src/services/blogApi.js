// আপনার প্রজেক্টে blogApi.js আগে থেকে থাকলে শুধু getBlogStats ফাংশনটা যোগ করুন।
import api from './api'; // <-- আপনার axios instance এর পাথ অনুযায়ী ঠিক করুন

export const getBlogs = (params) => api.get('/blogs', { params });
export const getBlog = (slug) => api.get(`/blogs/${encodeURIComponent(slug)}`);

export const getAdminBlogs = (params) => api.get('/blogs/admin', { params });
export const getAdminBlog = (id) => api.get(`/blogs/admin/${id}`);
export const getBlogStats = () => api.get('/blogs/admin/stats'); // নতুন
export const createBlog = (data) => api.post('/blogs', data);
export const updateBlog = (id, data) => api.patch(`/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);