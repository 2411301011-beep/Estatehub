import client from './client';

export const getProperties = async (params = {}) => {
  const response = await client.get('/properties', { params });
  return response.data;
};

export const getFeaturedProperties = async (limit = 6) => {
  const response = await client.get('/properties/featured', { params: { limit } });
  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await client.get(`/properties/${id}`);
  return response.data;
};
