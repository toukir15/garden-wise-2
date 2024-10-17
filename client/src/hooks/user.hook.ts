import { useQuery } from "@tanstack/react-query";
import { getFollowSuggetionUsers } from "../services/user";

export const useGetFollowSuggetionUsers = () => {
  return useQuery({
    queryKey: ["follow-suggetion"],
    queryFn: async () => {
      return await getFollowSuggetionUsers();
    },
  });
};
