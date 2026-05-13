import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    onSuccess: (responseData) => {
      const newPost = responseData?.data?.data;
      if (newPost) {
        queryClient.setQueryData(
          ["posts", queryTerm, searchTerm],
          (old: any) => {
            if (!old?.pages?.length) return old;
            const [firstPage, ...restPages] = old.pages;
            return {
              ...old,
              pages: [
                {
                  ...firstPage,
                  data: {
                    ...firstPage.data,
                    data: [newPost, ...(firstPage.data?.data ?? [])],
                    meta: firstPage.data?.meta
                      ? {
                          ...firstPage.data.meta,
                          total: firstPage.data.meta.total + 1,
                        }
                      : firstPage.data?.meta,
                  },
                },
                ...restPages,
              ],
            };
          }
        );
      } else {
        queryClient.invalidateQueries(["posts", queryTerm, searchTerm]);
      }
      queryClient.invalidateQueries(["my-posts"], { exact: true });
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
  return useInfiniteQuery(
    ["posts", queryTerm, searchTerm],
    ({ pageParam = 1 }) => getPosts(queryTerm, searchTerm, pageParam),
    {
      getNextPageParam: (lastPage: any) => {
        const meta = lastPage?.data?.meta;
        if (!meta) return undefined;
        return meta.page * meta.limit < meta.total ? meta.page + 1 : undefined;
      },
    }
  );
};

export const useGetMyPosts = () => {
  return useInfiniteQuery(
    ["my-posts"],
    ({ pageParam = 1 }) => getMyPosts(pageParam),
    {
      getNextPageParam: (lastPage: any) => {
        const meta = lastPage?.data?.meta;
        if (!meta) return undefined;
        return meta.page * meta.limit < meta.total ? meta.page + 1 : undefined;
      },
    }
  );
};

export const useGetVisitProfilePosts = (id: string) => {
  return useInfiniteQuery(
    ["visit-profile-posts", id],
    ({ pageParam = 1 }) => getVisitProfilePost(id, pageParam),
    {
      getNextPageParam: (lastPage: any) => {
        const meta = lastPage?.data?.meta;
        if (!meta) return undefined;
        return meta.page * meta.limit < meta.total ? meta.page + 1 : undefined;
      },
    }
  );
};

export const useSharePost = ({ queryTerm, searchTerm }: TQueryAndSearch) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, SharePostVariables>({
    mutationKey: ["POST"],
    mutationFn: async ({ description, postId }) =>
      await sharePost(description, postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", queryTerm, searchTerm]);
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
      queryClient.invalidateQueries(["posts", queryTerm, searchTerm]);
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

    onMutate: async ({ postId, userId }) => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);

      const applyUpvote = (findPost: any) => {
        if (!findPost) return;
        if (findPost.isShared) {
          const upvotes = findPost.votes.upvote;
          const downvotes = findPost.votes?.downvote;
          if (downvotes.includes(userId)) findPost.votes.downvote = downvotes.filter((id: string) => id !== userId);
          if (upvotes.includes(userId)) findPost.votes.upvote = upvotes.filter((id: string) => id !== userId);
          else findPost.votes.upvote.push(userId);
        } else {
          const upvotes = findPost.post.votes.upvote;
          const downvotes = findPost.post.votes.downvote;
          if (downvotes.includes(userId)) findPost.post.votes.downvote = downvotes.filter((id: string) => id !== userId);
          if (upvotes.includes(userId)) findPost.post.votes.upvote = upvotes.filter((id: string) => id !== userId);
          else findPost.post.votes.upvote.push(userId);
        }
      };

      const findInPages = (old: any) => {
        if (!old?.pages) return null;
        for (const page of old.pages) {
          const post = page?.data?.data?.find((p: any) => p?._id === postId);
          if (post) return post;
        }
        return null;
      };

      queryClient.setQueryData(["posts", queryTerm, searchTerm], (old: any) => {
        if (!old) return old;
        applyUpvote(findInPages(old));
        return old;
      });

      queryClient.setQueryData(["my-posts"], (old: any) => {
        if (!old) return old;
        applyUpvote(findInPages(old));
        return old;
      });

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

    onMutate: async ({ postId, userId }) => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);

      const applyDownvote = (findPost: any) => {
        if (!findPost) return;
        if (findPost.isShared) {
          const upvotes = findPost.votes.upvote;
          const downvotes = findPost.votes.downvote;
          if (upvotes.includes(userId)) findPost.votes.upvote = upvotes.filter((id: string) => id !== userId);
          if (downvotes.includes(userId)) findPost.votes.downvote = downvotes.filter((id: string) => id !== userId);
          else findPost.votes.downvote.push(userId);
        } else {
          const upvotes = findPost.post.votes.upvote;
          const downvotes = findPost.post.votes.downvote;
          if (upvotes.includes(userId)) findPost.post.votes.upvote = upvotes.filter((id: string) => id !== userId);
          if (downvotes.includes(userId)) findPost.post.votes.downvote = downvotes.filter((id: string) => id !== userId);
          else findPost.post.votes.downvote.push(userId);
        }
      };

      const findInPages = (old: any) => {
        if (!old?.pages) return null;
        for (const page of old.pages) {
          const post = page?.data?.data?.find((p: any) => p?._id === postId);
          if (post) return post;
        }
        return null;
      };

      queryClient.setQueryData(["posts", queryTerm, searchTerm], (old: any) => {
        if (!old) return old;
        applyDownvote(findInPages(old));
        return old;
      });

      queryClient.setQueryData(["my-posts"], (old: any) => {
        if (!old) return old;
        applyDownvote(findInPages(old));
        return old;
      });

      return { previousPosts };
    },
  });
};
