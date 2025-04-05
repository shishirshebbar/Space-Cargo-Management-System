import axios from "axios";

const BASE_URL = "http://localhost:8000/api/waste";

/**
 * Identify expired or depleted items as waste.
 * @returns {Promise} Axios GET request promise.
 */
export const identifyWaste = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/identify`);
    return response.data;
  } catch (error) {
    console.error("Error identifying waste:", error);
    throw error;
  }
};

/**
 * Generate a return plan for waste disposal.
 * @param {Object} data - Waste return plan data.
 * @returns {Promise} Axios POST request promise.
 */
export const generateReturnPlan = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/return-plan`, data);
    return response.data;
  } catch (error) {
    console.error("Error generating waste return plan:", error);
    throw error;
  }
};

/**
 * Complete the waste undocking process.
 * @param {Object} data - Waste undocking completion data.
 * @returns {Promise} Axios POST request promise.
 */
export const completeUndocking = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/complete-undocking`, data);
    return response.data;
  } catch (error) {
    console.error("Error completing waste undocking:", error);
    throw error;
  }
};