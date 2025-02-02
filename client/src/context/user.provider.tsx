import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "../../types";
import { getCurrentUser } from "../services/auth";
import Cookies from "js-cookie";
import { socket } from "../socket";

// Define the interface for UserContext values
export interface IUserProviderValues {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  postUser: any;
  setPostUser: Dispatch<SetStateAction<any>>;
  logo: string;
}

// Create context with IUserProviderValues type
export const UserContext = createContext<IUserProviderValues | undefined>(
  undefined
);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = Cookies.get("accessToken");
  const logo =
    "https://res.cloudinary.com/dnbxtcqiw/image/upload/v1731868478/l4huf2sovt-1731868475596-file-plant.png";

  // Function to fetch and set the current user
  const handleUser = async () => {
    const user: any = await getCurrentUser();
    setUser(user);
  };

  const [postUser, setPostUser] = useState<any>({}); // Initialize postUser

  useEffect(() => {
    handleUser();
  }, [accessToken]);

  useEffect(() => {
    if (user?._id) {
      socket.emit("user", { _id: user._id })
    }
  }, [user?._id])


  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        postUser,
        setPostUser,
        logo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within the UserProvider context");
  }
  return context as IUserProviderValues;
};

export default UserProvider;
