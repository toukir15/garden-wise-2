import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import { IUser } from "../../types";

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
export const GlobalContext = createContext<IUserProviderValues | undefined>(
  undefined
);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>;
};

export default GlobalProvider;
