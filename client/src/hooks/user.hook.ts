import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFollowSuggetionUsers, getUser } from "../services/user";
import { getUsers } from "../services/admin";

export const useGetFollowSuggetionUsers = () => {
  return useInfiniteQuery(
    ["follow-suggetion"],
    ({ pageParam = 1 }) => getFollowSuggetionUsers(pageParam, 10),
    {
      getNextPageParam: (lastPage: any) => {
        const meta = lastPage?.data?.data?.meta;
        if (!meta) return undefined;
        return meta.page * meta.limit < meta.total ? meta.page + 1 : undefined;
      },
    }
  );
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
