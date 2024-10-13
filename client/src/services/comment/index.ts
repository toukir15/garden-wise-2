"use server";
import axiosInstance from "@/src/lib/axiosInstance";

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
export const comment = async (postId: string, text: string) => {
  try {
    const { data } = await axiosInstance.post(`/posts/comment/${postId}`, {
      text,
    });
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const commentReply = async (commentId: string, text: string) => {
  try {
    const { data } = await axiosInstance.post(
      `/posts/comment/reply/${commentId}`,
      {
        text,
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
