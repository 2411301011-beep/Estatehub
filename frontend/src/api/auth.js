import client from './client';

export const loginUser = async (email, password) => {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password, phone) => {
  const response = await client.post('/auth/register', { name, email, password, phone });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};
