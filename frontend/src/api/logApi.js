import axios from "axios";

const BASE_URL = "http://localhost:8000/api/log";

/**
 * Log an event in the system.
 * @param {string} action - The action to be logged.
 * @param {string} category - The category of the log (default: GENERAL).
 * @returns {Promise} Axios POST request promise.
 */
export const logEvent = async (action, category = "GENERAL") => {
  try {
    const response = await axios.post(`${BASE_URL}/log`, { action, category });
    return response.data;
  } catch (error) {
    console.error("Error logging event:", error);
    throw error;
  }
};

/**
 * Retrieve all logs, optionally filtering by category.
 * @returns {Promise} Axios GET request promise.
 */
export const getLogs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/logs`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving logs:", error);
    throw error;
  }
};

/**
 * Clear all logs from the system.
 * @returns {Promise} Axios DELETE request promise.
 */
export const clearLogs = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/logs`);
    return response.data;
  } catch (error) {
    console.error("Error clearing logs:", error);
    throw error;
  }
};