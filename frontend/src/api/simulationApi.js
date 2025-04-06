import axios from "axios";

const BASE_URL = "http://localhost:8000/api/simulate";


export const simulateTime = async (days) => {
  try {
    const response = await axios.post(`${BASE_URL}/day`, { days });
    return response.data;
  } catch (error) {
    console.error("Error simulating time:", error);
    throw error;
  }
};

