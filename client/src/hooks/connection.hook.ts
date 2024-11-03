import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  followUser,
  getFollowers,
  getFollowings,
  unfollowUser,
} from "../services/connection";
import { IUser } from "../../types";

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user }: { user: Partial<IUser> }) => {
      return await followUser(user._id as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["followings"], {
        exact: true,
      });
      queryClient.invalidateQueries(["follow-suggetion"], {
        exact: true,
      });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user }: { user: Partial<IUser> }) => {
      return await unfollowUser(user._id as string);
    },

    // On success, update the cache or re-fetch
    onSuccess: () => {
      queryClient.invalidateQueries(["followings"], {
        exact: true,
      });

      queryClient.invalidateQueries(["follow-suggetion"], {
        exact: true,
      });
    },
  });
};

export const useGetFollowers = () => {
  return useQuery({
    queryKey: ["followers"],
    queryFn: async () => {
      return await getFollowers();
    },
  });
};

export const useGetFollowings = () => {
  return useQuery({
    queryKey: ["followings"],
    queryFn: async () => {
      return await getFollowings();
    },
  });
};
