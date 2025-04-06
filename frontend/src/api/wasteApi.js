import axios from "axios";

const BASE_URL = "http://localhost:8000/api/waste";

export const identifyWaste = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/identify`);
    return response.data;
  } catch (error) {
    console.error("Error identifying waste:", error);
    throw error;
  }
};


export const generateReturnPlan = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/return-plan`, data);
    return response.data;
  } catch (error) {
    console.error("Error generating waste return plan:", error);
    throw error;
  }
};

export const completeUndocking = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/complete-undocking`, data);
    return response.data;
  } catch (error) {
    console.error("Error completing waste undocking:", error);
    throw error;
  }
};
