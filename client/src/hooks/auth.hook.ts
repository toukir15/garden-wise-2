import { useMutation } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";
import { userLogin, userRegister } from "../services/auth";

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
