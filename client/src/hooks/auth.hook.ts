import { useMutation } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";
import { changePassword, editProfile, refreshToken, userLogin, userRegister } from "../services/auth";

export const useUserRegister = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["REGISTER"],
    mutationFn: async (data) => await userRegister(data),
  });
};

export const useUserLogin = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["LOGIN"],
    mutationFn: async (data) => await userLogin(data),
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationKey: ["REFRESH-TOKEN"],
    mutationFn: async () => await refreshToken(),
  });
};

export const useChangePassword = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["CHANGE-PASSWORD"],
    mutationFn: async (data) => await changePassword(data),
  });
};

export const useEditProfile = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["EDIT-PROFILE"],
    mutationFn: async (data) => await editProfile(data),
  });
};
