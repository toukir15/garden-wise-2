import { useMutation, useQueryClient } from "@tanstack/react-query";
import { comment, commentReply, downvote, upvote } from "../services/comment";
import { IUser } from "../../types";

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
      postId,
      userId,
      commentId,
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
    onMutate: async ({ voteId, postId, userId, commentId, replyId }) => {
      // Cancel any outgoing queries for this specific post to prevent conflict
      await queryClient.cancelQueries(["post", postId]);

      // Snapshot the previous post data (specific to postId)
      const previousPost = queryClient.getQueryData(["post", postId]);

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

export const useComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, text }: TCommentPayload) => {
      return await comment(postId, text);
    },

    onSuccess: (serverResponse, variables) => {
      const { postId, text, user } = variables;
      const currentTimestamp = new Date().toISOString();
      const commentData = {
        _id: serverResponse.data._id,
        text: text,
        replies: [],
        user: {
          _id: user?._id,
          name: user?.name,
          profilePhoto: user?.profilePhoto,
        },
        votes: { _id: serverResponse.data.votes, upvote: [], downvote: [] },
        createdAt: currentTimestamp,
      };
      // Update the query cache for the specific post with the new comment from the server
      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old) return old;

        // Create a new post object to avoid mutation
        const postData = { ...old.data };

        if (!postData.isShared) {
          postData.post = {
            ...postData.post,
            comments: [...postData.post.comments, commentData],
          };
        } else {
          postData.comments = [...postData.comments, commentData];
        }
        console.log(postData);
        return { ...old, data: postData };
      });
    },
  });
};

// type TCommentReplyPayload = {
//   commentId: string;
//   text: string;
//   user: IUser | null;
//   postId: string;
// };

// export const useCommentReply = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ commentId, text }: TCommentReplyPayload) => {
//       return await commentReply(commentId, text);
//     },

//     onSuccess: (serverResponse, variables) => {
//       console.log(serverResponse);
//       const { commentId, postId, text, user } = variables;
//       const currentTimestamp = new Date().toISOString();
//       // const commentData = {
//       //   _id: serverResponse.data._id,
//       //   text: text,
//       //   replies: [],
//       //   user: {
//       //     _id: user?._id,
//       //     name: user?.name,
//       //     profilePhoto: user?.profilePhoto,
//       //   },
//       //   votes: { _id: serverResponse.data.votes, upvote: [], downvote: [] },
//       //   createdAt: currentTimestamp,
//       // };
//       // console.log(commentData);

//       // Update the query cache for the specific post with the new comment from the server
//       queryClient.setQueryData(["post", postId], (old: any) => {
//         if (!old) return old;
//         console.log({ old });

//         // Create a new post object to avoid mutation
//         const postData = { ...old.data };

//         if (!postData.isShared) {
//           // Find the specific comment by its _id
//           const findCommentIndex = postData.post.comments.findIndex(
//             (comment: { _id: string }) => comment._id === commentId
//           );

//           if (findCommentIndex !== -1) {
//             // Create a new array with the updated replies for the specific comment
//             const updatedComments = [...postData.post.comments];
//             updatedComments[findCommentIndex] = {
//               ...updatedComments[findCommentIndex],
//               replies: [
//                 ...updatedComments[findCommentIndex].replies,
//                 replyData,
//               ],
//             };

//             // Update the post with the new comments array
//             postData.post = {
//               ...postData.post,
//               comments: updatedComments,
//             };
//           }
//         }

//         // return { ...old, data: postData };
//       });
//     },
//   });
// };
