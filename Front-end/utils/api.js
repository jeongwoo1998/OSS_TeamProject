import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://10.0.2.2:5000', // 서버의 기본 URL 
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt_access_token');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export default api;