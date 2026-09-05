import api from './api';

// Notices
export const getNotices = async (params = {}) => {
  const { data } = await api.get('/notices', { params });
  return data;
};
export const createNotice = async (noticeData) => {
  const { data } = await api.post('/notices', noticeData);
  return data;
};
export const updateNotice = async (id, noticeData) => {
  const { data } = await api.patch(`/notices/${id}`, noticeData);
  return data;
};
export const deleteNotice = async (id) => {
  const { data } = await api.delete(`/notices/${id}`);
  return data;
};

// Gallery
// // Gallery
// export const getGallery = async (params = {}) => {
//   const { data } = await api.get('/gallery', { params });
//   return data;
// };

// export const createGalleryItem = async (formData) => {
//   const { data } = await api.post('/gallery', formData);
//   return data;
// };

// export const deleteGalleryItem = async (id) => {
//   const { data } = await api.delete(`/gallery/${id}`);
//   return data;
// };

// ================================
// Gallery
// ================================

// ================================
// Gallery
// ================================

export const getGallery = async (params = {}) => {
  const { data } = await api.get('/gallery', {
    params
  });

  return data;
};


export const createGalleryItem = async (formData) => {

  console.log('===== FORMDATA DEBUG =====');

  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  console.log('==========================');

  const { data } = await api.post(
    '/gallery',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return data;
};


export const deleteGalleryItem = async (id) => {

  const { data } = await api.delete(
    `/gallery/${id}`
  );

  return data;
};



// Testimonials
export const getTestimonials = async (params = {}) => {
  const { data } = await api.get('/testimonials', { params });
  return data;
};
export const createTestimonial = async (data) => {
  const { data: res } = await api.post('/testimonials', data);
  return res;
};
export const updateTestimonial = async (id, data) => {
  const { data: res } = await api.patch(`/testimonials/${id}`, data);
  return res;
};
export const deleteTestimonial = async (id) => {
  const { data } = await api.delete(`/testimonials/${id}`);
  return data;
};

// Contact
export const sendContactMessage = async (messageData) => {
  const { data } = await api.post('/contact', messageData);
  return data;
};
export const getContactMessages = async (params = {}) => {
  const { data } = await api.get('/contact', { params });
  return data;
};
export const updateContactStatus = async (id, status) => {
  const { data } = await api.patch(`/contact/${id}`, { status });
  return data;
};
