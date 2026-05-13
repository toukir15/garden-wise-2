import { io } from "socket.io-client";
import { envConfig } from "../config/envConfig";
export const socket = io(envConfig.baseUrl, {
    transports: ["websocket"],
    withCredentials: true,
    secure: true
});
