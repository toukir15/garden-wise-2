import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPost,
  deletePost,
  downvote,
  editPost,
  sharePost,
  upvote,
} from "../services/posts";
import { FieldValues } from "react-hook-form";

type SharePostVariables = {
  description: string;
  postId: string;
};

export const useCreatePost = () => {
  // Get the instance of the query client
  const queryClient = useQueryClient();

  return useMutation<any, Error, FieldValues>({
    mutationKey: ["POST"],
    mutationFn: async (data) => await createPost(data),
    // On success, update the cache or re-fetch
    onSuccess: (data, variables, context) => {
      const responseData = data.data.data;
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the cache
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        // Return the new updated structure
        return {
          ...old,
          data: [...old.data, responseData],
        };
      });

      // Optionally return context if you need to rollback
      return { previousPosts };
    },
  });
};

export const useSharePost = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, SharePostVariables>({
    mutationKey: ["POST"],
    mutationFn: async ({ description, postId }) =>
      await sharePost(description, postId),
    onSuccess: (data, variables, context: any) => {
      const responseData = data.data.data;
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        const updatedData = {
          ...old,
          data: [...old.data, responseData],
        };
        return updatedData;
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { postId: string }>({
    mutationKey: ["DELETE_POST"],
    mutationFn: async ({ postId }: { postId: string }) =>
      await deletePost(postId),
    onSuccess: (_data, variables, _context: any) => {
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        const removePost = old.data.filter(
          (post: { _id: string }) => post._id !== variables.postId
        );
        const updatedData = {
          ...old,
          data: [...removePost],
        };
        return updatedData;
      });
    },
  });
};

export const useEditPost = () => {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    { postId: string; payload: { description: string } }
  >({
    mutationKey: ["EDIT_POST"],
    mutationFn: async ({ postId, payload }) => {
      return await editPost(postId, payload);
    },
    onSuccess: (_data, variables, _context: any) => {
      queryClient.invalidateQueries(["posts"]);
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
