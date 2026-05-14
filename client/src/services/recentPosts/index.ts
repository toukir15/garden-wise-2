
"use server";
import axiosInstance from "@/src/lib/axiosInstance";

export const getPost = async (postId: string, page: number = 1) => {
  try {
    const { data } = await axiosInstance.get(`/posts/${postId}?page=${page}&limit=8`);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
