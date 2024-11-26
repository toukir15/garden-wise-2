import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  deletePost,
  downvote,
  editPost,
  getMyPosts,
  getPosts,
  getVisitProfilePost,
  sharePost,
  upvote,
} from "../services/posts";
import { FieldValues } from "react-hook-form";
import { TQueryAndSearch } from "../../types";

type SharePostVariables = {
  description: string;
  postId: string;
};

export const useCreatePost = ({ queryTerm, searchTerm }: TQueryAndSearch) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, FieldValues>({
    mutationKey: ["POST"],
    mutationFn: async (data) => await createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", queryTerm, searchTerm], {
        exact: true,
      });
      queryClient.invalidateQueries(["my-posts"], {
        exact: true,
      });
    },
  });
};

export const useGetPosts = ({
  queryTerm,
  searchTerm,
}: {
  queryTerm: string;
  searchTerm: string;
}) => {
  return useQuery(["posts", queryTerm, searchTerm], () =>
    getPosts(queryTerm, searchTerm)
  );
};

export const useGetMyPosts = () => {
  return useQuery(["my-posts"], () => getMyPosts());
};

export const useGetVisitProfilePosts = (id: string) => {
  return useQuery(["visit-profile-posts"], () => getVisitProfilePost(id));
};

export const useSharePost = ({ queryTerm, searchTerm }: TQueryAndSearch) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, SharePostVariables>({
    mutationKey: ["POST"],
    mutationFn: async ({ description, postId }) =>
      await sharePost(description, postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", queryTerm, searchTerm], {
        exact: true,
      });
      queryClient.invalidateQueries(["my-posts"], {
        exact: true,
      });
    },
  });
};

export const useDeletePost = ({ queryTerm, searchTerm }: TQueryAndSearch) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { postId: string }>({
    mutationKey: ["DELETE_POST"],
    mutationFn: async ({ postId }: { postId: string }) =>
      await deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", queryTerm, searchTerm], {
        exact: true,
      });
      queryClient.invalidateQueries(["my-posts"], {
        exact: true,
      });
      queryClient.invalidateQueries(["admin-dashboard-posts"], {
        exact: true,
      });
    },
  });
};

export const useEditPost = ({ queryTerm, searchTerm }: TQueryAndSearch) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", queryTerm, searchTerm]);
      queryClient.invalidateQueries(["my-posts"], {
        exact: true,
      });
    },
  });
};

export const useUpvote = ({ queryTerm, searchTerm }: TQueryAndSearch) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      voteId,
    }: {
      voteId: string;
      postId?: string;
      userId?: string;
    }) => {
      return await upvote(voteId);
    },

    // Optimistic update logic
    onMutate: async ({ postId, userId }) => {
      // Cancel any outgoing queries for "posts" to prevent conflict
      await queryClient.cancelQueries(["posts"]);

      // Snapshot the previous posts data
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the cache with the new upvote
      queryClient.setQueryData(["posts", queryTerm, searchTerm], (old: any) => {
        if (!old) return old;

        // Find the post by postId
        const findPost = old.data.data.find(
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
      // Optimistically update the cache with the new upvote
      queryClient.setQueryData(["my-posts"], (old: any) => {
        if (!old) return old;
        // Find the post by postId
        const findPost = old.data.data.find(
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

      // Optimistically update the cache with the new upvote
      queryClient.setQueryData(["visit-profile-posts"], (old: any) => {
        if (!old) return old;
        // Find the post by postId
        const findPost = old.data.data.find(
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

export const useDownvote = ({ queryTerm, searchTerm }: TQueryAndSearch) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      voteId,
    }: {
      voteId: string;
      postId?: string;
      userId?: string;
      replyId?: string;
    }) => {
      return await downvote(voteId);
    },

    // Optimistic update logic
    onMutate: async ({ postId, userId }) => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the cache with the new downvote
      queryClient.setQueryData(["posts", queryTerm, searchTerm], (old: any) => {
        if (!old) return old;

        // Find the post by postId
        const findPost = old.data.data.find(
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

      // Optimistically update the cache with the new downvote
      queryClient.setQueryData(["my-posts"], (old: any) => {
        if (!old) return old;

        // Find the post by postId
        const findPost = old.data.data.find(
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
      queryClient.setQueryData(["visit-profile-posts"], (old: any) => {
        if (!old) return old;

        // Find the post by postId
        const findPost = old.data.data.find(
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
