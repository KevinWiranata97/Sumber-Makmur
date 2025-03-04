import { create } from 'zustand';
import { login as loginService } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  loginError: string | null;
  login: (username: string, password: string) => Promise<void>;
}

const useStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loginError: null,
  login: async (username, password) => {
    try {
      const data = await loginService(username, password);
      set({ isAuthenticated: true, loginError: null });
      // Optionally, store the token or user data
    } catch (error) {
      set({ loginError: (error as Error).message });
    }
  },
}));

export default useStore;
