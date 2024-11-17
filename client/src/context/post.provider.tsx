"use client";
import { createContext, ReactNode, useState } from "react";

export const PostContext = createContext<any | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [queryTerm, setQueryTerm] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [isSearchbarOpen, setIsSearchbarOpen] = useState(false)
  const [editComment, setEditComment] = useState("")
  const [editCommentId, setEditCommentId] = useState("")

  return (
    <PostContext.Provider
      value={{
        queryTerm,
        setQueryTerm,
        searchTerm,
        setSearchTerm,
        postCount,
        setPostCount,
        setIsSearchbarOpen, 
        isSearchbarOpen,
        editComment,
        setEditComment,
        editCommentId,
        setEditCommentId
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
