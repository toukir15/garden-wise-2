import { useMutation } from "@tanstack/react-query";
import { createPayment } from "../services/payment";

export const useCreatePayment = () => {
  return useMutation({
    mutationKey: ["PAYMENT"],
    mutationFn: async () => {
      console.log("payment hook");
      return await createPayment();
    },
    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
