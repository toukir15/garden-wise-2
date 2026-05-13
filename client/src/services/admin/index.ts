"use server";
import axiosInstance from "@/src/lib/axiosInstance";

export const getUserActivity = async () => {
  try {
    const { data } = await axiosInstance.get(`/admin/user-activity`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMonthlyPayments = async () => {
  try {
    const { data } = await axiosInstance.get(`/admin/monthly-payments`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getPayments = async () => {
  try {
    const { data } = await axiosInstance.get(`/admin/payments`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getPosts = async () => {
  try {
    const { data } = await axiosInstance.get(`/admin/posts`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUsers = async () => {
  try {
    const { data } = await axiosInstance.get(`/admin/users`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const { data } = await axiosInstance.delete(`/admin/${userId}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateUser = async (userId: string) => {
  try {
    const { data } = await axiosInstance.patch(`/admin/${userId}`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};

