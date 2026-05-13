"use server";
import axiosInstance from "@/src/lib/axiosInstance";

export const getPost = async (postId: string) => {
  try {
    const { data } = await axiosInstance.get(`/posts/${postId}`);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
