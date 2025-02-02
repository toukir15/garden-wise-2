"use server";
import { envConfig } from "@/src/config/envConfig";
import axiosInstance from "@/src/lib/axiosInstance";

// export const getUsers = async (userId: string) => {
//   const res = await fetch(`${envConfig.baseApi}/users/${userId}`);
//   if (!res.ok) {
//     throw new Error("Failed to fetch users");
//   }
//   const data = res.json();
//   return await data;
// };

export const getFollowSuggetionUsers = async () => {
  try {
    const { data } = await axiosInstance.get(`/users/follow-suggetion`);
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
