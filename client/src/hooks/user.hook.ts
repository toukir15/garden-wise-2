import { useQuery } from "@tanstack/react-query";
import { getFollowSuggetionUsers, getUser } from "../services/user";

export const useGetFollowSuggetionUsers = () => {
  return useQuery({
    queryKey: ["follow-suggetion"],
    queryFn: async () => {
      return await getFollowSuggetionUsers();
    },
  });
};

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      return await getUser(userId);
    },
  });
};
