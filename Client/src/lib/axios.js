import axios from "axios";

const api = axios.create({
  // URL ko trim karein taake extra spaces ya slashes ka masla na ho
  baseURL: `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}/api`,
  withCredentials: true, 
});

export default api;