import axios from 'axios';

export const fetchProducts = async (searchTerm = "", pageSize = 10, page = 0) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios({
      method: "GET",
      url: `http://localhost:5000/products?search=${searchTerm}&limit=${pageSize}&page=${page + 1}`,
      headers: {
        Authorization: `${token}`,
      },
    });
    return {
      data: response.data.data,
      totalItems: response.data.pagination.totalItems,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
