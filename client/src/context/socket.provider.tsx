import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { socket } from "../socket";

// Define the interface for UserContext values
export interface ISocketProviderValues {
    activeUsers: any;
    isTyping: boolean
}

// Create context with IUserProviderValues type
export const SocketContext = createContext<ISocketProviderValues | undefined>(
    undefined
);

const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [activeUsers, setActiveUsers] = useState([])
    const [isTyping, setIsTyping] = useState(false)
    socket.on("typing", (data: any) => {
        setIsTyping(data)
    });

    useEffect(() => {
        const handleOnline = (data: any) => {
            setActiveUsers(data)
        };
        socket.off("online", handleOnline);
        socket.on("online", handleOnline);
        return () => {
            socket.off("online", handleOnline);
        };
    }, []);

    return (
        <SocketContext.Provider
            value={{
                activeUsers,
                isTyping
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
