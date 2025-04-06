import axios from "axios";

const BASE_URL = "http://localhost:8000/api/placement";

/**
 * Send placement request with items and containers
 */
export const placeItems = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};
