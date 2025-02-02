"use server";
import axiosInstance from "@/src/lib/axiosInstance";

export const sendMessage = async (messageData: any) => {
  try {
    const { data } = await axiosInstance.post(
      `/messages`, messageData
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMessages = async (conversationId: string) => {
  try {
    const { data } = await axiosInstance.get(
      `/messages/${conversationId}`
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
