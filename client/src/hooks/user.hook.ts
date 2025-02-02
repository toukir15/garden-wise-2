import { useQuery } from "@tanstack/react-query";
import { getFollowSuggetionUsers, getUser } from "../services/user";
import { getUsers } from "../services/admin";

export const useGetFollowSuggetionUsers = () => {
  return useQuery({
    queryKey: ["follow-suggetion"],
    queryFn: async () => {
      return await getFollowSuggetionUsers();
    },
  });
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await getUsers();
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
