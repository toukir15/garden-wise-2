"use client";
import { createContext, ReactNode, useState } from "react";

export const PostContext = createContext<any | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [queryTerm, setQueryTerm] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [postCount, setPostCount] = useState(0);

  return (
    <PostContext.Provider
      value={{
        queryTerm,
        setQueryTerm,
        searchTerm,
        setSearchTerm,
        postCount,
        setPostCount,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
