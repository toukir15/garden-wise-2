import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, downvote, sharePost, upvote } from "../services/posts";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

export const useCreatePost = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["POST"],
    mutationFn: async (data) => await createPost(data),
    onMutate: () => {
      const toastId = toast.loading("Creating post...", {
        duration: Infinity,
        position: "top-right",
      });
      return { toastId };
    },
    onSuccess: (_data, _variables, context: any) => {
      toast.success("Post created successfully!", {
        id: context?.toastId,
        duration: 2000,
      });
    },
    onError: (_error, _variables, context: any) => {
      toast.error("Failed to create post. Please try again.", {
        id: context?.toastId,
        duration: 2000,
      });
    },
  });
};

type SharePostVariables = {
  description: string;
  postId: string;
};
export const useSharePost = () => {
  return useMutation<any, Error, SharePostVariables>({
    mutationKey: ["POST"],
    mutationFn: async ({ description, postId }) =>
      await sharePost(description, postId),
    onMutate: () => {
      const toastId = toast.loading("Sharing post...", {
        duration: Infinity,
        position: "top-right",
      });
      return { toastId };
    },
    onSuccess: (_data, _variables, context: any) => {
      toast.success("Shared post successfully!", {
        id: context?.toastId,
        duration: 2000,
      });
    },
    onError: (_error, _variables, context: any) => {
      toast.error("Failed to share post. Please try again.", {
        id: context?.toastId,
        duration: 2000,
      });
    },
  });
};

export const useUpvote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      voteId,
      postId,
      userId,
    }: {
      voteId: string;
      postId: string;
      userId: string;
    }) => {
      return await upvote(voteId);
    },

    // Optimistic update logic
    onMutate: async ({ voteId, postId, userId }) => {
      // Cancel any outgoing queries for "posts" to prevent conflict
      await queryClient.cancelQueries(["posts"]);

      // Snapshot the previous posts data
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the cache with the new upvote
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;

        // Find the post by postId
        const findPost = old.data.find(
          (post: { _id: string }) => post?._id === postId
        );
        if (findPost.isShared) {
          const upvotes = findPost.votes.upvote;
          const downvotes = findPost.votes?.downvote;

          if (downvotes.includes(userId)) {
            // Remove the userId from the downvote array
            findPost.votes.downvote = downvotes.filter(
              (id: string) => id !== userId
            );
          }
          if (upvotes.includes(userId)) {
            // Remove the userId from the upvote array
            findPost.votes.upvote = upvotes.filter(
              (id: string) => id !== userId
            );
          } else {
            // Add the userId to the upvote array
            findPost.votes.upvote.push(userId);
          }
        } else {
          const upvotes = findPost.post.votes.upvote;
          const downvotes = findPost.post.votes.downvote;

          if (downvotes.includes(userId)) {
            // Remove the userId from the downvote array
            findPost.post.votes.downvote = downvotes.filter(
              (id: string) => id !== userId
            );
          }
          if (upvotes.includes(userId)) {
            // Remove the userId from the upvote array
            findPost.post.votes.upvote = upvotes.filter(
              (id: string) => id !== userId
            );
          } else {
            // Add the userId to the upvote array
            findPost.post.votes.upvote.push(userId);
          }
        }
        return old;
      });

      // Return snapshot for rollback on error
      return { previousPosts };
    },
  });
};
export const useDownvote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      voteId,
      postId,
      userId,
      replyId,
    }: {
      voteId: string;
      postId: string;
      userId: string;
      replyId?: string;
    }) => {
      return await downvote(voteId);
    },

    // Optimistic update logic
    onMutate: async ({ voteId, postId, userId, replyId }) => {
      // Cancel any outgoing queries for "posts" to prevent conflict
      await queryClient.cancelQueries(["posts"]);
      // Snapshot the previous posts data
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the cache with the new downvote
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;

        // Find the post by postId
        const findPost = old.data.find(
          (post: { _id: string }) => post?._id === postId
        );

        if (findPost.isShared) {
          const upvotes = findPost.votes.upvote;
          const downvotes = findPost.votes.downvote;

          if (upvotes.includes(userId)) {
            // Remove the userId from the downvote array
            findPost.votes.upvote = upvotes.filter(
              (id: string) => id !== userId
            );
          }
          if (downvotes.includes(userId)) {
            // Remove the userId from the upvote array
            findPost.votes.downvote = downvotes.filter(
              (id: string) => id !== userId
            );
          } else {
            // Add the userId to the upvote array
            findPost.votes.downvote.push(userId);
          }
        } else {
          const upvotes = findPost.post.votes.upvote;
          const downvotes = findPost.post.votes.downvote;

          if (upvotes.includes(userId)) {
            // Remove the userId from the downvote array
            findPost.post.votes.upvote = upvotes.filter(
              (id: string) => id !== userId
            );
          }
          if (downvotes.includes(userId)) {
            // Remove the userId from the upvote array
            findPost.post.votes.downvote = downvotes.filter(
              (id: string) => id !== userId
            );
          } else {
            // Add the userId to the upvote array
            findPost.post.votes.downvote.push(userId);
          }
        }

        return old;
      });

      // Return snapshot for rollback on error
      return { previousPosts };
    },
  });
};
