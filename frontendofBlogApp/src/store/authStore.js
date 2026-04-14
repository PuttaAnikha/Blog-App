import { create } from "zustand";
import api from "../api/axios";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: true,
  isAuthenticated: false,
  error: null,
  
  login: async (userCred) => {
    try {
      set({ loading: true, currentUser: null, isAuthenticated: false, error: null });
      const res = await api.post("/auth/login", userCred);
      
      if (res.status === 200) {
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
        }
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          error: null,
        });
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Login failed. Please check your connection.";
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: errorMessage,
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/auth/logout");
      
      if (res.status === 200) {
        localStorage.removeItem("token");
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });
      }
    } catch (err) {
      console.error("Logout Error:", err);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: "Logout failed",
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/auth/check-auth");

      if (res.status === 200) {
        set({
          currentUser: res.data.payload,
          isAuthenticated: true,
          loading: false,
        });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      console.error("Auth check failed:", err);
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));