import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

/**
 * Search for an item.
 * @param {Object} query - Search query parameters.
 * @returns {Promise} Axios POST request promise.
 */
export const searchItem = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: query, // ✅ Send itemId or itemName as query params
    });
    return response.data;
  } catch (error) {
    console.error("Error searching for item:", error);
    throw error;
  }
};


/**
 * Retrieve an item.
 * @param {Object} data - Data required for item retrieval.
 * @returns {Promise} Axios POST request promise.
 */
export const retrieveItem = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/retrieve`, data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving item:", error);
    throw error;
  }
};

/**
 * Place an item after retrieval.
 * @param {Object} data - Data required for item placement.
 * @returns {Promise} Axios POST request promise.
 */
export const placeItem = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/place`, data);
    return response.data;
  } catch (error) {
    console.error("Error placing item:", error);
    throw error;
  }
};
