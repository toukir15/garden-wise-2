"use server";
import axiosInstance from "@/src/lib/axiosInstance";

export const getFollowSuggetionUsers = async (page: number = 1, limit: number = 10) => {
  try {
    const { data } = await axiosInstance.get(`/users/follow-suggetion?page=${page}&limit=${limit}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUsers = async () => {
  try {
    const { data } = await axiosInstance.get(`/users`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const { data } = await axiosInstance.get(`/users/${userId}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};
