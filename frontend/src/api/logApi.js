import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Updated function to accept itemId and fetch logs based on it
export const getLogs = async (itemId) => {
  try {
    // Check if itemId is provided
    if (!itemId) {
      throw new Error("Item ID is required to fetch logs.");
    }

    const response = await axios.get(`${BASE_URL}/logs`, {
      params: { itemId }, // Pass itemId as a query parameter
    });

    return response.data; // Return the logs data from the response
  } catch (error) {
    console.error("Error retrieving logs:", error.message || error);
    // Optional: Provide a default message or custom error handling based on status
    throw new Error("Failed to retrieve logs. Please try again later.");
  }
};
