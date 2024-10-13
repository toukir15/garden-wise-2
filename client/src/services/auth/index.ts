"use server";
import axiosInstance from "@/src/lib/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const userRegister = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", userData);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const userLogin = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  let decodedToken = null;
  if (accessToken) {
    decodedToken = await jwtDecode(accessToken);
  }
  return {
    _id: decodedToken?._id,
    name: decodedToken?.name,
    role: decodedToken?.role,
    email: decodedToken?.email,
    profilePhoto: decodedToken?.profilePhoto,
  };
};

export const logout = () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
};
