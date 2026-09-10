import client from './client';

export const getFavorites = async () => {
  const response = await client.get('/users/me/favorites');
  return response.data;
};

export const addFavorite = async (propertyId) => {
  const response = await client.post(`/users/me/favorites/${propertyId}`);
  return response.data;
};

export const removeFavorite = async (propertyId) => {
  const response = await client.delete(`/users/me/favorites/${propertyId}`);
  return response.data;
};
