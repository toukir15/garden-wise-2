"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  useDeletePost,
  useDownvote,
  useEditPost,
  useSharePost,
  useUpvote,
} from "../hooks/post.hook";
import { IUserProviderValues, UserContext } from "./user.provider";
import { useFollowUser } from "../hooks/connection.hook";
import { IUser } from "../../types";
import { useDisclosure } from "@nextui-org/modal";

import { Dispatch, SetStateAction } from "react";
import { useCreatePostForm } from "../components/hooks/useCreatePostForm";
import {
  FieldErrors,
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

export interface IModalState<T = boolean> {
  isOpen: T;
  onOpen: () => void;
  onOpenChange: (state: T) => void;
}

export interface IPostProviderValues {
  postStates: {
    queryTerm: string;
    setQueryTerm: Dispatch<SetStateAction<string>>;
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
    postCount: number;
    setPostCount: Dispatch<SetStateAction<number>>;
    isSearchbarOpen: boolean;
    setIsSearchbarOpen: Dispatch<SetStateAction<boolean>>;
    editComment: string;
    setEditComment: Dispatch<SetStateAction<string>>;
    editCommentId: string;
    setEditCommentId: Dispatch<SetStateAction<string>>;
    isDropdownOpen: boolean;
    setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
    postId: string;
    setPostId: Dispatch<SetStateAction<string>>;
    isOpenComment: boolean;
    setIsOpenComment: Dispatch<SetStateAction<boolean>>;
    isOpenSharedComment: boolean;
    setOpenSharedComment: Dispatch<SetStateAction<boolean>>;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
    editPostDescription: string;
    setEditPostDescription: Dispatch<SetStateAction<string>>;
    loadingUserId: string | null;
  };
  toggleDropdown: () => void;
  createPostProps: {
    // createPostDescription: string;
    // setCreatePostDescription: Dispatch<SetStateAction<string>>;
    // imagePreviews: string[];
    // handleFileChange: React.ChangeEventHandler<HTMLInputElement>;
    // register: UseFormRegister<FieldValues>;
    // handleSubmit: UseFormHandleSubmit<FieldValues>;
    // onSubmit: (data: FieldValues) => void;
    // errors: FieldErrors<FieldValues>;
    // isCreatePostLoading: boolean;
  };
  postFuncions: IPostFunctions;
  modalStates: {
    editModal: IModalState;
    sharePostModal: IModalState;
  };
}
export interface IPostFunctions {
  handlePostUpvote: (voteId: string, postId: string) => void;
  handlePostDownvote: (voteId: string, postId: string) => void;
  handlePostShare: (e: React.FormEvent<HTMLFormElement>) => void;
  handlePostDelete: (postId: string) => void;
  handlePostEdit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleFollowRequest: (user: Partial<IUser>) => void;
}

export const PostContext = createContext<IPostProviderValues | undefined>(
  undefined
);

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
  // const {
  //   createPostDescription,
  //   setCreatePostDescription,
  //   imagePreviews,
  //   handleFileChange,
  //   register,
  //   handleSubmit,
  //   onSubmit,
  //   errors,
  //   isCreatePostLoading,
  // } = useCreatePostForm();

  const {
    isOpen: isEditOpen,
    onOpen: editOnOpen,
    onOpenChange: editOnOpenChange,
  } = useDisclosure();

  const {
    isOpen: isSharePostOpen,
    onOpen: shareOnOpen,
    onOpenChange: shareOnOpenChange,
  } = useDisclosure();

  const { user } = useContext(UserContext) as IUserProviderValues;
  const userId = user?._id;
  // Upvote mutation hook
  const { mutate: handleUpvote } = useUpvote({ queryTerm, searchTerm });
  const handlePostUpvote = (voteId: string, postId: string) => {
    handleUpvote({ voteId, postId, userId });
  };

  const { mutate: handleDownvote } = useDownvote({ queryTerm, searchTerm });
  const handlePostDownvote = (voteId: string, postId: string) => {
    handleDownvote({ voteId, postId, userId });
  };

  const { mutate: handleSharePost } = useSharePost({ queryTerm, searchTerm });
  const handlePostShare = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSharePost({ description, postId });
    setDescription("");
  };

  const { mutate: handleDelete } = useDeletePost({ queryTerm, searchTerm });
  const handlePostDelete = (postId: string) => {
    handleDelete({ postId });
  };

  const { mutate: handleEdit } = useEditPost({ queryTerm, searchTerm });
  const handlePostEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { description: editPostDescription };
    handleEdit({ postId, payload });
  };

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const { mutate: handleFollow } = useFollowUser();
  const handleFollowRequest = (user: Partial<IUser>) => {
    if (!user._id) return;
    setLoadingUserId(user._id);
    handleFollow(
      { user: user },
      {
        onSettled: () => {
          setLoadingUserId(null);
        },
      }
    );
  };

  return (
    <PostContext.Provider
      value={{
        postStates: {
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
          loadingUserId,
        },
        createPostProps: {
          // createPostDescription,
          // setCreatePostDescription,
          // imagePreviews,
          // handleFileChange,
          // register,
          // handleSubmit,
          // onSubmit,
          // errors,
          // isCreatePostLoading,
        },
        toggleDropdown,
        postFuncions: {
          handlePostUpvote,
          handlePostDownvote,
          handlePostShare,
          handlePostDelete,
          handlePostEdit,
          handleFollowRequest,
        },
        modalStates: {
          editModal: {
            isOpen: isEditOpen,
            onOpen: editOnOpen,
            onOpenChange: editOnOpenChange,
          },
          sharePostModal: {
            isOpen: isSharePostOpen,
            onOpen: shareOnOpen,
            onOpenChange: shareOnOpenChange,
          },
        },
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
