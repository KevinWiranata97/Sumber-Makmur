import axios from 'axios';

const API_URL = 'http://localhost:5000/users/login';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(API_URL, { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};
