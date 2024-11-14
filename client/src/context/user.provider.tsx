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

// Define the interface for UserContext values
export interface IUserProviderValues {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  postUser: any;
  setPostUser: Dispatch<SetStateAction<any>>;
}

// Create context with IUserProviderValues type
export const UserContext = createContext<IUserProviderValues | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = Cookies.get("accessToken");

  // Function to fetch and set the current user
  const handleUser = async () => {
    const user = await getCurrentUser();
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const [postUser, setPostUser] = useState<any>({}); // Initialize postUser

  useEffect(() => {
    handleUser();
  }, [accessToken]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [accessToken]);

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoading, setIsLoading, postUser, setPostUser }}
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
