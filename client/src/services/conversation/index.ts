"use server";
import axiosInstance from "@/src/lib/axiosInstance";

export const createConversation = async (coversationData: any) => {
  try {
    const { data } = await axiosInstance.post(
      `/conversations`, coversationData
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getConversations = async () => {
  try {
    const { data } = await axiosInstance.get(
      `/conversations`
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

