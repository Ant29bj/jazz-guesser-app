import axios from 'axios';

export const dreezerApi = axios.create({
  baseURL: import.meta.env.VITE_DREEZER_API_URL
});