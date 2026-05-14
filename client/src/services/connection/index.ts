"use server";
import axiosInstance from "@/src/lib/axiosInstance";

export const followUser = async (followUserId: string) => {
  try {
    const { data } = await axiosInstance.patch(`/connections/follow/${followUserId}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const unfollowUser = async (unfollowUserId: string) => {
  try {
    const { data } = await axiosInstance.patch(`/connections/unFollow/${unfollowUserId}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getFollowers = async (page: number = 1, limit: number = 10) => {
  try {
    const { data } = await axiosInstance.get(`/connections/followers?page=${page}&limit=${limit}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getFollowings = async (page: number = 1, limit: number = 10) => {
  try {
    const { data } = await axiosInstance.get(`/connections/followings?page=${page}&limit=${limit}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getViewProfileFollowers = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/connections/followers/${id}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getViewProfileFollowings = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/connections/followings/${id}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};
