import { PipelineStage } from "mongoose";
import { postSearchableField } from "./post.const";
import { JwtPayload } from "jsonwebtoken";

export const createBaseQuery = (searchTerm: string, queryTerm: string, user: JwtPayload) => {
    const baseQuery: Record<string, unknown> = {
      $or: postSearchableField.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    };
  
    if (queryTerm === 'premium') {
      baseQuery['post.isPremium'] = true;
    }
    return baseQuery;
  };

  export const getSortOrderPipeline = (queryTerm: string): PipelineStage[] => {
    if (queryTerm === 'recent') {
        return [{ $sort: { createdAt: -1 } }];
    } 
    return [];
  };

  // Filter posts for unverified users
export const filterPostsForUnverifiedUser = (posts: any[], user: JwtPayload) => {
  const isUserPost = (post: any) =>
    !post.isShared && user._id == post.post?.user._id;

  const isOtherNonPremiumPost = (post: any) =>
    !post.isShared && !post.post?.isPremium;

  const isUserSharedPost = (post: any) =>
    post.isShared && user._id == post.sharedUser._id;

  return posts.filter(
    post => isUserPost(post) || isOtherNonPremiumPost(post) || isUserSharedPost(post),
  );
};

// Sort posts by popularity
export const sortPopularPosts = (posts: any[]) => {
  return posts
    .map(post => {
      const totalUpvote = post.isShared
        ? post.votes.upvote.length
        : post.post.votes.upvote.length;

      return { ...post, totalUpvote };
    })
    .sort((a, b) => b.totalUpvote - a.totalUpvote);
};


  
  export const populateOptions = [
    {
      path: 'sharedUser',
      model: 'User',
      select: 'name profilePhoto isVerified',
    },
    {
      path: 'votes',
      model: 'Vote',
      select: 'upvote downvote',
    },
    {
      path: 'comments',
      model: 'Comment',
      select: 'text user votes replies createdAt',
      populate: [
        {
          path: 'user',
          model: 'User',
          select: 'name profilePhoto isVerified',
        },
        {
          path: 'replies.commentReplyUser',
          model: 'User',
          select: 'name profilePhoto',
        },
        {
          path: 'replies.replyTo',
          model: 'User',
          select: 'name',
        },
        {
          path: 'votes',
          model: 'Vote',
          select: 'upvote downvote',
        },
        {
          path: 'replies.votes',
          model: 'Vote',
          select: 'upvote downvote',
        },
      ],
    },
    {
      path: 'post.user',
      model: 'User',
      select: 'name profilePhoto email isVerified',
    },
    {
      path: 'post.comments',
      model: 'Comment',
      select: 'text user votes replies createdAt',
      populate: [
        {
          path: 'user',
          model: 'User',
          select: 'name profilePhoto',
        },
        {
          path: 'replies.commentReplyUser',
          model: 'User',
          select: 'name profilePhoto',
        },
        {
          path: 'replies.replyTo',
          model: 'User',
          select: 'name',
        },
        {
          path: 'votes',
          model: 'Vote',
          select: 'upvote downvote',
        },
        {
          path: 'replies.votes',
          model: 'Vote',
          select: 'upvote downvote',
        },
      ],
    },
    {
      path: 'post.votes',
      model: 'Vote',
      select: 'upvote downvote',
    },
  ];