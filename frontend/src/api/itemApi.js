import axios from "axios";

const BASE_URL = "http://localhost:8000/api";


export const searchItem = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: query, 
    });
    return response.data;
  } catch (error) {
    console.error("Error searching for item:", error);
    throw error;
  }
};



export const retrieveItem = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/retrieve`, data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving item:", error);
    throw error;
  }
};


export const placeItem = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/place`, data);
    return response.data;
  } catch (error) {
    console.error("Error placing item:", error);
    throw error;
  }
};
