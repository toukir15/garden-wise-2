"use server";
import axiosInstance from "@/src/lib/axiosInstance";
import { FieldValues } from "react-hook-form";
import { revalidateTag } from "next/cache"; // Import from Next.js cache utilities

export const createPost = async (postData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/posts", postData);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMyPosts = async () => {
  try {
    const { data } = await axiosInstance.get("/posts/my-posts");
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const sharePost = async (postData: string, postId: string) => {
  try {
    const { data } = await axiosInstance.post(`/posts/share-post/${postId}`, {
      description: postData,
    });
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deletePost = async (postId: string) => {
  try {
    const { data } = await axiosInstance.delete(`/posts/${postId}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const editPost = async (
  postId: string,
  payload: { description: string }
) => {
  try {
    const { data } = await axiosInstance.patch(`/posts/${postId}`, payload);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const upvote = async (voteId: string) => {
  try {
    const { data } = await axiosInstance.patch(
      `/posts/comment/upvote/${voteId}`
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const downvote = async (voteId: string) => {
  try {
    const { data } = await axiosInstance.patch(
      `/posts/comment/downvote/${voteId}`
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
