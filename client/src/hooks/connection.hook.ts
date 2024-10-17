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

    // On success, update the cache or re-fetch
    onSuccess: (data, variables, context) => {
      const followUser = variables.user;

      // Access the cached follow suggestion users data
      const previousFollowSuggestions = queryClient.getQueryData([
        "follow-suggetion",
      ]);

      // Optimistically update the cache by removing the user with the matching ID from the suggestions
      queryClient.setQueryData(["follow-suggetion"], (old: any) => {
        if (!old) return old;

        // Remove the user with the matching ID
        const updatedData = old.data.data.filter(
          (user: any) => user._id !== followUser._id
        );

        // Return the new updated structure
        return {
          ...old,
          data: {
            ...old.data,
            data: updatedData,
          },
        };
      });

      // Update the "followings" cache by adding the followed user
      queryClient.setQueryData(["followings"], (old: any) => {
        if (!old) return old;

        // Ensure we're updating the 'followings' array correctly by accessing it properly
        const updatedFollowings = {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              followings: [...old.data.data.followings, followUser],
            },
          },
        };
        return updatedFollowings;
      });

      // Optionally return context if you need to rollback
      return { previousFollowSuggestions };
    },

    // On error, rollback to previous cache
    onError: (err, variables, context: any) => {
      if (context?.previousFollowSuggestions) {
        queryClient.setQueryData(
          ["follow-suggetion"],
          context.previousFollowSuggestions
        );
      }
    },

    // Always re-fetch after mutation to ensure the data is up-to-date
    onSettled: () => {
      queryClient.invalidateQueries(["follow-suggetion"]);
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
    onSuccess: (data, variables, context) => {
      const unfollowUser = variables.user;

      // Access the cached follow suggestion users data
      const previousFollowSuggestions = queryClient.getQueryData([
        "followings",
      ]);

      // Optimistically update the cache by removing the user with the matching ID from the suggestions
      queryClient.setQueryData(["followings"], (old: any) => {
        if (!old) return old;
        // Remove the user with the matching ID
        const updatedData = old.data.data.followings.filter(
          (user: any) => user._id !== unfollowUser._id
        );

        // Return the new updated structure
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              followings: updatedData,
            },
          },
        };
      });

      // Update the "followings" cache by adding the followed user
      queryClient.setQueryData(["follow-suggetion"], (old: any) => {
        if (!old) return old;
        // Ensure we're updating the 'followings' array correctly by accessing it properly
        const updatedFollowings = {
          ...old,
          data: {
            ...old.data,
            data: [...old.data.data, unfollowUser],
          },
        };

        return updatedFollowings;
      });

      // Optionally return context if you need to rollback
      return { previousFollowSuggestions };
    },

    // On error, rollback to previous cache
    // onError: (err, variables, context: any) => {
    //   if (context?.previousFollowSuggestions) {
    //     queryClient.setQueryData(
    //       ["follow-suggetion"],
    //       context.previousFollowSuggestions
    //     );
    //   }
    // },

    // Always re-fetch after mutation to ensure the data is up-to-date
    // onSettled: () => {
    //   queryClient.invalidateQueries(["follow-suggetion"]);
    // },
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
