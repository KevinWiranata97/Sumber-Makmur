import axios from 'axios';

export const fetchProducts = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get('http://localhost:5000/products', {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};
