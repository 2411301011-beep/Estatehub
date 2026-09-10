import client from './client';

export const getCities = async () => {
  const response = await client.get('/meta/cities');
  return response.data;
};

export const getPropertyTypes = async () => {
  const response = await client.get('/meta/property-types');
  return response.data;
};
