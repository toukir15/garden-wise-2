"use server";
import axiosInstance from "@/src/lib/axiosInstance";
import { FieldValues } from "react-hook-form";

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

export const getPosts = async (queryTerm: string, searchTerm: string) => {
  const params = new URLSearchParams();

  if (queryTerm) {
    params.append("queryTerm", queryTerm);
  }

  if (searchTerm) {
    params.append("searchTerm", searchTerm);
  }
  try {
    const { data } = await axiosInstance.get(`/posts?${params.toString()}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getVisitProfilePost = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(
      `/posts/visit-profile-posts/${id}`
    );
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
