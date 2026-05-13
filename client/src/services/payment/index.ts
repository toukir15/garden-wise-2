"use server";
import axiosInstance from "@/src/lib/axiosInstance";

export const createPayment = async () => {
  try {
    const { data } = await axiosInstance.post(`/payments/create-payment`);
    return { data };
  } catch (error: any) {
    throw new Error(error);
  }
};
