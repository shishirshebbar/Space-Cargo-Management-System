import axios from "axios";

// Backend Base URL (Loaded from Environment Variables)
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Signup API Call
export const signupUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/register`, { username, password });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Signup failed" };
  }
};

// Login API Call
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/login`, { username, password });
    return { success: true, token: response.data.token };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};

// Fetch User Profile API Call
export const fetchUserProfile = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: "Failed to fetch user profile" };
  }
};