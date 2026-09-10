import client from './client';

export const getAgents = async (q = '') => {
  const response = await client.get('/agents', { params: { q } });
  return response.data;
};

export const getAgentById = async (id) => {
  const response = await client.get(`/agents/${id}`);
  return response.data;
};

export const getAgentProperties = async (id) => {
  const response = await client.get(`/agents/${id}/properties`);
  return response.data;
};
