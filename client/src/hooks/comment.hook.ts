import { useMutation, useQueryClient } from "@tanstack/react-query";
import { comment, deleteComment, downvote, editComment, upvote } from "../services/comment";
import { IUser, TQueryAndSearch } from "../../types";

type TCommentPayload = {
  postId: string;
  text: string;
  user: IUser | null;
};

export const useUpvote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      voteId,
    }: {
      voteId: string;
      postId: string;
      userId: string;
      commentId: string;
      replyId?: string;
    }) => {
      return await upvote(voteId);
    },

    // Optimistic update logic
    onMutate: async ({ postId, userId, commentId, replyId }) => {
      await queryClient.cancelQueries(["post", postId]);

      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old?.pages) return old;

        const updateVotes = (item: any) => {
          const upvotes = item.votes.upvote;
          const downvotes = item.votes?.downvote;
          if (downvotes.includes(userId)) {
            item.votes.downvote = downvotes.filter((id: string) => id !== userId);
          }
          if (upvotes.includes(userId)) {
            item.votes.upvote = upvotes.filter((id: string) => id !== userId);
          } else {
            item.votes.upvote.push(userId);
          }
        };

        return {
          ...old,
          pages: old.pages.map((page: any) => {
            const postData = page?.data;
            if (!postData) return page;

            if (postData.isShared) {
              updateVotes(postData);
              const findComment = postData.comments?.find((c: any) => c?._id === commentId);
              if (findComment) {
                if (replyId) {
                  const findReply = findComment.replies?.find((r: any) => r?._id === replyId);
                  if (findReply) updateVotes(findReply);
                } else {
                  updateVotes(findComment);
                }
              }
            } else {
              const findComment = postData.post?.comments?.find((c: any) => c?._id === commentId);
              if (findComment) {
                if (replyId) {
                  const findReply = findComment.replies?.find((r: any) => r?._id === replyId);
                  if (findReply) updateVotes(findReply);
                } else {
                  updateVotes(findComment);
                }
              }
            }
            return page;
          }),
        };
      });
    },
  });
};

export const useDownvote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      voteId,
    }: {
      voteId: string;
      postId: string;
      userId: string;
      commentId: string;
      replyId?: string;
    }) => {
      return await downvote(voteId);
    },

    // Optimistic update logic
    onMutate: async ({ postId, userId, commentId, replyId }) => {
      await queryClient.cancelQueries(["post", postId]);
      const previousPost = queryClient.getQueryData(["post", postId]);

      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old?.pages) return old;

        const updateVotes = (item: any) => {
          const upvotes = item.votes.upvote;
          const downvotes = item.votes.downvote;
          if (upvotes.includes(userId)) {
            item.votes.upvote = upvotes.filter((id: string) => id !== userId);
          }
          if (downvotes.includes(userId)) {
            item.votes.downvote = downvotes.filter((id: string) => id !== userId);
          } else {
            item.votes.downvote.push(userId);
          }
        };

        return {
          ...old,
          pages: old.pages.map((page: any) => {
            const postData = page?.data;
            if (!postData) return page;

            if (postData.isShared) {
              updateVotes(postData);
              const findComment = postData.comments?.find((c: any) => c?._id === commentId);
              if (findComment) {
                if (replyId) {
                  const findReply = findComment.replies?.find((r: any) => r?._id === replyId);
                  if (findReply) updateVotes(findReply);
                } else {
                  updateVotes(findComment);
                }
              }
            } else {
              const findComment = postData.post?.comments?.find((c: any) => c?._id === commentId);
              if (findComment) {
                if (replyId) {
                  const findReply = findComment.replies?.find((r: any) => r?._id === replyId);
                  if (findReply) updateVotes(findReply);
                } else {
                  updateVotes(findComment);
                }
              }
            }
            return page;
          }),
        };
      });

      return { previousPost };
    },
  });
};

export const useComment = ({ queryTerm, searchTerm }: TQueryAndSearch) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, text }: TCommentPayload) => {
      return await comment(postId, text);
    },

    onSuccess: (_serverResponse, variables) => {
      const { postId } = variables;

      // invalide post tag
      queryClient.invalidateQueries(["post", postId], {
        exact: true,
      });

      queryClient.invalidateQueries(["my-posts"], {
        exact: true,
      });

      queryClient.invalidateQueries(["visit-profile-posts"], {
        exact: true,
      });
    },
  });
};

export const useEditComment = ({ queryTerm, searchTerm }: TQueryAndSearch) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, text }: any ) => {
      return await editComment(commentId, text);
    },

    onSuccess: (_serverResponse, variables) => {
      const { postId } = variables;

      // invalide post tag
      queryClient.invalidateQueries(["post", postId], {
        exact: true,
      });

      queryClient.invalidateQueries(["my-posts"], {
        exact: true,
      });

      queryClient.invalidateQueries(["visit-profile-posts"], {
        exact: true,
      });

      queryClient.invalidateQueries(["posts", queryTerm, searchTerm], {
        exact: true,
      });
    },
  });
};

export const useDeleteComment = ({ queryTerm, searchTerm }: TQueryAndSearch) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId }: {postId: string, commentId: string}) => {
      return await deleteComment(commentId, postId);
    },

    onSuccess: (_serverResponse, variables) => {
      const { postId } = variables;

      // invalide post tag
      queryClient.invalidateQueries(["post", postId], {
        exact: true,
      });

      queryClient.invalidateQueries(["my-posts"], {
        exact: true,
      });

      queryClient.invalidateQueries(["visit-profile-posts"], {
        exact: true,
      });

      queryClient.invalidateQueries(["posts", queryTerm, searchTerm], {
        exact: true,
      });
    },
  });
};
