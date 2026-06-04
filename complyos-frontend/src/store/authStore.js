import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // API call will be added here
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  logout: () => {
    set({ user: null, token: null, isLoggedIn: false });
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // API call will be added here
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
