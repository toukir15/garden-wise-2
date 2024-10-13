export const checkVoteStatus = (
  isShared: boolean,
  data: any,
  userId: string,
  voteType: "upvote" | "downvote"
) => {
  const voteData = isShared
    ? data?.votes[voteType]
    : data?.post?.votes[voteType];
  return voteData?.find((votedUserId: string) => votedUserId === userId);
};
