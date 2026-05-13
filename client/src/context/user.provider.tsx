"use client";
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
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { socket } from "../socket";

const USER_STORAGE_KEY = "gw_user";

const decodeUserFromToken = (): IUser | null => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return {
      _id: decoded._id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      profilePhoto: decoded.profilePhoto,
      isVerified: decoded.isVerified,
      bookmark: decoded.bookmark,
      address: decoded.address,
    };
  } catch {
    return null;
  }
};

const saveToStorage = (user: IUser | null) => {
  try {
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_STORAGE_KEY);
  } catch {}
};

const loadFromStorage = (): IUser | null => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export interface IUserProviderValues {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  postUser: any;
  setPostUser: Dispatch<SetStateAction<any>>;
  logo: string;
}

export const UserContext = createContext<IUserProviderValues | undefined>(
  undefined
);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postUser, setPostUser] = useState<any>({});

  const logo =
    "https://res.cloudinary.com/dnbxtcqiw/image/upload/v1731868478/l4huf2sovt-1731868475596-file-plant.png";

  const setUser = (newUser: IUser | null) => {
    setUserState(newUser);
    saveToStorage(newUser);
  };

  useEffect(() => {
    // 1. Load from localStorage immediately (instant, no network)
    const stored = loadFromStorage();
    if (stored) setUserState(stored);

    // 2. Decode from current JWT (no API call, just client-side decode)
    const tokenUser = decodeUserFromToken();
    if (tokenUser) {
      setUserState(tokenUser);
      saveToStorage(tokenUser);
    } else if (!stored) {
      // No token, no cache — user is logged out
      setUserState(null);
    }

    setIsLoading(false);
  }, []);

  // Re-sync whenever the cookie changes (login sets a new cookie → navigation causes re-render)
  useEffect(() => {
    const tokenUser = decodeUserFromToken();
    if (tokenUser) {
      setUserState(tokenUser);
      saveToStorage(tokenUser);
    }
  }, [Cookies.get("accessToken")]);

  useEffect(() => {
    if (user?._id) {
      socket.emit("user", { _id: user._id });
    }
  }, [user?._id]);

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

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within the UserProvider context");
  }
  return context as IUserProviderValues;
};

export default UserProvider;
