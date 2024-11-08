import { useMutation } from "@tanstack/react-query";
import { createPayment } from "../services/payment";

export const useCreatePayment = () => {
  return useMutation({
    mutationKey: ["PAYMENT"],
    mutationFn: async () => {
      return await createPayment();
    },
  });
};
