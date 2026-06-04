import { create } from "zustand";
import { getToken, getRole, getUserId, setToken, setRole, setUserId, clearAuth } from "../utils/helpers";

const useAuthStore = create((set) => ({
  token: getToken(),
  role: getRole(),
  userId: getUserId(),
  isAuthenticated: !!getToken(),

  login: (token, role, userId) => {
    setToken(token);
    setRole(role);
    setUserId(userId);
    set({ token, role, userId, isAuthenticated: true });
  },

  logout: () => {
    clearAuth();
    set({ token: null, role: null, userId: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
