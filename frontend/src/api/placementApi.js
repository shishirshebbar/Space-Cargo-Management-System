import axios from "axios";

const BASE_URL = "http://localhost:8000/api/placement";

/**
 * Place items in storage.
 * @param {Object} data - Data required for item placement.
 * @returns {Promise} Axios POST request promise.
 */
export const placeItems = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/place`, data);
    return response.data;
  } catch (error) {
    console.error("Error placing items:", error);
    throw error;
  }
};