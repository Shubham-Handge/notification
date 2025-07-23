import axios from 'axios';
import { loginUser } from '../services/api'; // ✅ CORRECT


// Backend base URL — update this to match your backend URL
const API_BASE_URL = 'http://localhost:8080/api/auth';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------
// 🔐 Login as USER
// ----------------------------
export const loginUser = async (firebaseToken) => {
  const response = await api.post('/login/user', { token: firebaseToken });
  return response.data; // returns AppUser object from backend
};

// ----------------------------
// 🔐 Login as ADMIN
// ----------------------------
export const loginAdmin = async (firebaseToken) => {
  const response = await api.post('/login/admin', { token: firebaseToken });
  return response.data;
};

// ----------------------------
// 🚪 Logout as ADMIN
// ----------------------------
export const logoutAdmin = async (uid) => {
  const response = await api.post('/logout/admin', { uid });
  return response.data;
};

export default api;
