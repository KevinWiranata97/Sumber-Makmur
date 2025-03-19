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

export const addProduct = async (data: any) => {
  const token = localStorage.getItem('authorization');
  try {
    const response = await axios({
      method: "POST",
      url: `http://localhost:5000/products`,
      headers: {
        authorization: token,
      },
      data: data,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const fetchUnits = async (searchTerm = "", pageSize = 10, page = 0) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios({
      method: "GET",
      url: `http://localhost:5000/units?search=${searchTerm}&limit=${pageSize}&page=${page + 1}`,
      headers: {
        Authorization: `${token}`,
      },
    });
    return {
      data: response.data.data,
      totalItems: response.data.pagination.totalItems,
    };
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
};

export const fetchStorages = async (searchTerm = "", pageSize = 10, page = 0) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios({
      method: "GET",
      url: `http://localhost:5000/storages?search=${searchTerm}&limit=${pageSize}&page=${page + 1}`,
      headers: {
        Authorization: `${token}`,
      },
    });
    return {
      data: response.data.data,
      totalItems: response.data.pagination.totalItems,
    };
  } catch (error) {
    console.error("Error fetching storages:", error);
    throw error;
  }
};

export const fetchProductById = async (id: string) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios({
      method: "GET",
      url: `http://localhost:5000/products/${id}`,
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

export const editProduct = async (id: string, data: any) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios({
      method: "PUT",
      url: `http://localhost:5000/products/${id}`,
      headers: {
        Authorization: `${token}`,
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error editing product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios({
      method: "DELETE",
      url: `http://localhost:5000/products/${id}`,
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
