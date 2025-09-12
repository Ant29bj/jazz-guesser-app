import axios from 'axios';

export const gameApi = axios.create({
  baseURL: import.meta.env.VITE_GAME_API_URL
});