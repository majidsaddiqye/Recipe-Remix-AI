import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, ""); 

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling'] // Railway par stability ke liye dono allow karein
});