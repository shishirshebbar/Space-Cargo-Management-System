import axios from "axios";

const BASE_URL = "http://localhost:8000/api";


export const getLogs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/logs`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving logs:", error);
    throw error;
  }
};
