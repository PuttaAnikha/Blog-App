import axios from "axios";

// Create an axios instance with default configurations
const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error: Backend might be down.");
    }
    return Promise.reject(error);
  }
);

export default api;
