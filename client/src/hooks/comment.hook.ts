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
      // Cancel any outgoing queries for this specific post to prevent conflict
      await queryClient.cancelQueries(["post", postId]);

      // Optimistically update the cache with the new upvote
      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old) return old;

        const postData = old.data;

        // Helper function to handle upvotes and downvotes
        const updateVotes = (item: any) => {
          const upvotes = item.votes.upvote;
          const downvotes = item.votes?.downvote;

          // Remove the userId from downvotes if it exists
          if (downvotes.includes(userId)) {
            item.votes.downvote = downvotes.filter(
              (id: string) => id !== userId
            );
          }

          // Toggle userId in upvotes
          if (upvotes.includes(userId)) {
            item.votes.upvote = upvotes.filter((id: string) => id !== userId);
          } else {
            item.votes.upvote.push(userId);
          }
        };

        // If it's a shared post, apply voting to the post itself
        if (postData.isShared) {
          // Upvote/downvote the shared post
          updateVotes(postData);

          // Check if it's a comment or reply on the shared post
          const findComment = postData.comments.find(
            (comment: any) => comment?._id === commentId
          );

          if (findComment) {
            if (replyId) {
              const findReply = findComment.replies.find(
                (reply: any) => reply?._id === replyId
              );
              updateVotes(findReply);
            } else {
              updateVotes(findComment);
            }
          }
        } else {
          // Regular post (not shared) - handle comments/replies
          const findComment = postData.post.comments.find(
            (comment: any) => comment?._id === commentId
          );

          if (findComment) {
            if (replyId) {
              const findReply = findComment.replies.find(
                (reply: any) => reply?._id === replyId
              );
              updateVotes(findReply);
            } else {
              updateVotes(findComment);
            }
          }
        }

        return old;
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
    onMutate: async ({ voteId, postId, userId, commentId, replyId }) => {
      // Cancel any outgoing queries for this specific post to prevent conflict
      await queryClient.cancelQueries(["post", postId]);
      // Snapshot the previous post data (specific to postId)
      const previousPost = queryClient.getQueryData(["post", postId]);

      // Optimistically update the cache with the new downvote
      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old) return old;

        const postData = old.data;

        // Helper function to handle upvotes and downvotes
        const updateVotes = (item: any) => {
          const upvotes = item.votes.upvote;
          const downvotes = item.votes.downvote;

          // Remove the userId from upvotes if it exists
          if (upvotes.includes(userId)) {
            item.votes.upvote = upvotes.filter((id: string) => id !== userId);
          }

          // Toggle userId in downvotes
          if (downvotes.includes(userId)) {
            item.votes.downvote = downvotes.filter(
              (id: string) => id !== userId
            );
          } else {
            item.votes.downvote.push(userId);
          }
        };

        // If it's a shared post, apply voting to the post itself
        if (postData.isShared) {
          // Downvote the shared post
          updateVotes(postData);

          // Check if it's a comment or reply on the shared post
          const findComment = postData.comments.find(
            (comment: any) => comment?._id === commentId
          );

          if (findComment) {
            if (replyId) {
              const findReply = findComment.replies.find(
                (reply: any) => reply?._id === replyId
              );
              updateVotes(findReply);
            } else {
              updateVotes(findComment);
            }
          }
        } else {
          // Regular post (not shared) - handle comments/replies
          const findComment = postData.post.comments.find(
            (comment: any) => comment?._id === commentId
          );

          if (findComment) {
            if (replyId) {
              const findReply = findComment.replies.find(
                (reply: any) => reply?._id === replyId
              );
              updateVotes(findReply);
            } else {
              updateVotes(findComment);
            }
          }
        }

        return old;
      });

      // Return the previous post snapshot for rollback on error
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
