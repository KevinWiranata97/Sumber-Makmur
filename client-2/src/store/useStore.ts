import { create } from 'zustand';
import { login as loginService } from '../services/authService';
import { fetchProducts as fetchProductsService, addProduct as addProductService, fetchUnits as fetchUnitsService, fetchStorages as fetchStoragesService } from '../services/apiServices';

interface AuthState {
  isAuthenticated: boolean;
  loginError: string | null;
  login: (username: string, password: string) => Promise<void>;
  products: any[];
  fetchProducts: (searchTerm: any, size: any, page: any) => Promise<void>;
  totalProducts: number;
  addProduct: (data: any) => Promise<void>;
  fetchUnits: (searchTerm: any, size: any, page: any) => Promise<void>;
  fetchStorages: (searchTerm: any, size: any, page: any) => Promise<void>;
  units: any[];
  totalUnits: number;
  storages: any[];
  totalStorages: number;
}

const useStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loginError: null,
  products: [],
  totalProducts: 0,
  units: [],
  totalUnits: 0,
  storages: [],
  totalStorages: 0,
  login: async (username, password) => {
    try {
      const data = await loginService(username, password);
      console.log(data);
      const token = data.authorization;
      localStorage.setItem('authToken', token);

      set({ isAuthenticated: true, loginError: null });
    } catch (error) {
      set({ loginError: (error as Error).message });
    }
  },
  fetchProducts: async (searchTerm,page,size) => {
    try {
      const data = await fetchProductsService(searchTerm,size,page);
      set({ products: data.data });
      set({ totalProducts: data.totalItems })
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  },
  addProduct: async (data) => {
    try {
      const response = await addProductService(data);
      console.log("Product added successfully:", response);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  },
  fetchUnits: async (searchTerm, page, size) => {
    try {
      const data = await fetchUnitsService(searchTerm, size, page);
      set({ units: data.data });
      set({ totalUnits: data.totalItems });
    } catch (error) {
      console.error('Failed to fetch units:', error);
    }
  },
  fetchStorages: async (searchTerm, page, size) => {
    try {
      const data = await fetchStoragesService(searchTerm, size, page);
      set({ storages: data.data });
      set({ totalStorages: data.totalItems });
    } catch (error) {
      console.error('Failed to fetch storages:', error);
    }
  },
}));

export default useStore;
