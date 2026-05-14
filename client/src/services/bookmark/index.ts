
"use server";
import axiosInstance from "@/src/lib/axiosInstance";

export const getBookmarks = async (page: number = 1) => {
  try {
    const { data } = await axiosInstance.get(`/bookmarks?page=${page}&limit=5`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateBookmark = async (bookmarkId: string, postId: string) => {
  try {
    const { data } = await axiosInstance.patch(`/bookmarks/${bookmarkId}`, {
      postId
    });
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};