import axios from "axios";

const BASE_URL = "http://localhost:8000/api/import";

/**
 * Import items from a CSV file.
 * @param {File} file - CSV file containing item data.
 * @returns {Promise} Axios POST request promise.
 */
export const importItems = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${BASE_URL}/items`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error importing items:", error);
    throw error;
  }
};

/**
 * Import containers from a CSV file.
 * @param {File} file - CSV file containing container data.
 * @returns {Promise} Axios POST request promise.
 */
export const importContainers = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${BASE_URL}/containers`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error importing containers:", error);
    throw error;
  }
};