import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // Use environment variable

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For sending cookies with requests
});

export default api;
