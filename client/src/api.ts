// src/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust if your server runs on a different port

export const getGreeting = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};
