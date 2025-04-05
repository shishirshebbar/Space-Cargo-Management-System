import axios from "axios";

const BASE_URL = "http://localhost:8000/api/simulate";

/**
 * Simulate time passage for stored items.
 * @param {number} days - Number of days to simulate.
 * @returns {Promise} Axios POST request promise.
 */
export const simulateTime = async (days) => {
  try {
    const response = await axios.post(`${BASE_URL}/day`, { days });
    return response.data;
  } catch (error) {
    console.error("Error simulating time:", error);
    throw error;
  }
};

/**
 * Get the current state of all items.
 * @returns {Promise} Axios GET request promise.
 */
export const getCurrentState = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/current-state`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving current state:", error);
    throw error;
  }
};