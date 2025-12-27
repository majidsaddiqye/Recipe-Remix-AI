import { io } from "socket.io-client";

// Backend URL (Apne port ke mutabiq change karein)
const SOCKET_URL = "http://localhost:3000"; 

export const socket = io(SOCKET_URL, {
    autoConnect: false, // Dashboard mount hone par manually connect karenge
    withCredentials: true,
});