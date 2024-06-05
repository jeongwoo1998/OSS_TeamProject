import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // 서버의 기본 URL 
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;