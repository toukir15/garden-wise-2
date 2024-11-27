"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { useUpvote } from "../hooks/post.hook";
import { IUserProviderValues, UserContext } from "./user.provider";

export const PostContext = createContext<any | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [queryTerm, setQueryTerm] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [isSearchbarOpen, setIsSearchbarOpen] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [editCommentId, setEditCommentId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [postId, setPostId] = useState("");
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [isOpenSharedComment, setOpenSharedComment] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [editPostDescription, setEditPostDescription] = useState("");
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const { user } = useContext(UserContext) as IUserProviderValues;
  // Upvote mutation hook
  const { mutate: handleUpvote } = useUpvote({ queryTerm, searchTerm });
  const handlePostUpvote = (voteId: string, postId: string) => {
    handleUpvote({ voteId, postId, userId: user?._id });
  };

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
        setEditCommentId,
        isDropdownOpen,
        setIsDropdownOpen,
        toggleDropdown,
        postId,
        setPostId,
        isOpenComment,
        setIsOpenComment,
        isOpenSharedComment,
        setOpenSharedComment,
        description,
        setDescription,
        editPostDescription,
        setEditPostDescription,
        handlePostUpvote,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
