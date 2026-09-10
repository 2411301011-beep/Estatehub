import client from './client';

export const submitInquiry = async (inquiryData) => {
  const response = await client.post('/inquiries', inquiryData);
  return response.data;
};

export const getMyInquiries = async () => {
  const response = await client.get('/users/me/inquiries');
  return response.data;
};
