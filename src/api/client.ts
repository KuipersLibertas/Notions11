import axios from 'axios';

type CreateRequestParams = {
  endpoint: string;
  method: string;
  headers?: Record<string, string>;
  body?: Record<string, any> | FormData;
};

// Browser-side HTTP client for calling Next.js API routes.
// All requests use relative URLs — no external backend dependency.
export const createRequest = async ({ endpoint, method, headers, body }: CreateRequestParams) => {
  const isFormData = body instanceof FormData;

  return axios({
    url: endpoint,
    method,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    data: body,
    responseType: 'json',
  })
    .then((response) => response.data)
    .catch((error) => {
      if (error?.code === 'ERR_NETWORK') {
        throw new Error('Network connection failed');
      } else if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('An error occurred');
      }
    });
};
