import { create } from 'zustand';
import { login as loginService } from '../services/authService';
import { fetchProducts as fetchProductsService } from '../services/apiServices';

interface AuthState {
  isAuthenticated: boolean;
  loginError: string | null;
  login: (username: string, password: string) => Promise<void>;
  products: any[];
  fetchProducts: (searchTerm: any, size: any, page: any) => Promise<void>;
  totalProducts: number;
}

const useStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loginError: null,
  products: [],
  totalProducts: 0,
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
}));

export default useStore;
