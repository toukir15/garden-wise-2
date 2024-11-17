import httpStatus from 'http-status'
import { PipelineStage } from 'mongoose'
import AppError from '../../errors/AppError'
import { TReply } from '../comment/comment.interface'
import { User } from '../user/user.model'
import { Vote } from '../vote/vote.model'
import { TPost } from './post.interface'
import Post from './post.model'
import { Comment } from '../comment/comment.model'
import { TUser } from '../user/user.interface'
import {
  createBaseQuery,
  filterPostsForUnverifiedUser,
  getSortOrderPipeline,
  populateOptions,
  sortPopularPosts,
} from './post.utils'
import { JwtPayload } from 'jsonwebtoken'

const createPostIntoDB = async (
  payload: TPost,
  postImages: string[],
  userId: string,
) => {
  const findUser = await User.findById(userId)
  if (!findUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist')
  }

  const createVotes = await Vote.create({})
  const findVote = await Vote.findById(createVotes._id)
  const postData = {
    post: {
      ...payload,
      user: userId,
      votes: findVote,
      images: postImages,
    },
  }
  const result = await Post.create(postData)
  const resultObject = result.toObject()
  const userObject = findUser.toObject()
  const modifyResult = {
    ...resultObject,
    post: {
      ...resultObject.post,
      user: {
        _id: userObject._id,
        name: userObject.name,
        profilePhoto: userObject.profilePhoto,
        email: userObject.email,
      },
    },
  }
  return modifyResult
}

const createSharePostIntoDB = async (
  postId: string,
  userId: string,
  payload: { description: string },
) => {
  const createVotes = await Vote.create({})
  const findVote = await Vote.findById(createVotes._id)
  const findPost = await Post.findById(postId)

  const sharePostData = {
    description: payload.description,
    isShared: true,
    post: findPost!.post,
    sharedUser: userId,
    votes: findVote,
  }

  const result = await Post.create(sharePostData)
  return result
}

export const getPostsFromDB = async (
  query: Record<string, unknown>,
  user: JwtPayload,
) => {
  const searchTerm = (query?.searchTerm as string) || '';
  const queryTerm = (query?.queryTerm as string) || '';

  const baseQuery = createBaseQuery(searchTerm, queryTerm, user);
  const sortPipeline = getSortOrderPipeline(queryTerm);

  const pipeline: PipelineStage[] = [
    { $match: baseQuery },
    ...sortPipeline,
    {
      $project: {
        sharedUser: 1,
        description: 1,
        votes: 1,
        isShared: 1,
        comments: 1,
        share: 1,
        post: 1,
        createdAt: 1,
      },
    },
  ];

  // Execute aggregation
  let result = await Post.aggregate(pipeline).exec();

  // Populate fields
  await Post.populate(result, populateOptions);

  // Apply additional filters for unverified users
  if (!user.isVerified) {
    result = filterPostsForUnverifiedUser(result, user);
  }

  // Sort by popularity if the query term is 'popular'
  if (queryTerm === 'popular') {
    result = sortPopularPosts(result);
  }

  return result;
};


const getVisitProfilePostsFromDB = async (userId: string) => {
  const result = await Post.find({
    $or: [
      { isShared: true, sharedUser: userId },
      { isShared: false, 'post.user': userId },
    ],
  })
    .select({
      sharedUser: 1,
      description: 1,
      votes: 1,
      isShared: 1,
      comments: 1,
      share: 1,
      post: 1,
      createdAt: 1,
    })
    .populate({
      path: 'sharedUser',
      model: 'User',
      select: 'name profilePhoto',
    })
    .populate({
      path: 'votes',
      model: 'Vote',
      select: 'upvote downvote',
    })
    .populate({
      path: 'comments',
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
    })
    .populate({
      path: 'post.user',
      model: 'User',
      select: 'name profilePhoto',
    })
    .populate({
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
    })
    .populate({
      path: 'post.votes',
      model: 'Vote',
      select: 'upvote downvote',
    })
    .sort({ createdAt: -1 })
  return result
}

const getMyPostsFromDB = async (userId: string) => {
  const result = await Post.find({
    $or: [
      { isShared: true, sharedUser: userId },
      { isShared: false, 'post.user': userId },
    ],
  })
    .select({
      sharedUser: 1,
      description: 1,
      votes: 1,
      isShared: 1,
      comments: 1,
      share: 1,
      post: 1,
      createdAt: 1,
    })
    .populate({
      path: 'sharedUser',
      model: 'User',
      select: 'name profilePhoto',
    })
    .populate({
      path: 'votes',
      model: 'Vote',
      select: 'upvote downvote',
    })
    .populate({
      path: 'comments',
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
    })
    .populate({
      path: 'post.user',
      model: 'User',
      select: 'name profilePhoto',
    })
    .populate({
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
    })
    .populate({
      path: 'post.votes',
      model: 'Vote',
      select: 'upvote downvote',
    })
    .sort({ createdAt: -1 })

  return result
}

const getPostFromDB = async (postId: string) => {
  const result = await Post.findById(postId)
    .select({
      sharedUser: 1,
      description: 1,
      votes: 1,
      isShared: 1,
      comments: 1,
      share: 1,
      post: 1,
      createdAt: 1,
    })
    .populate({
      path: 'sharedUser',
      model: 'User',
      select: 'name profilePhoto',
    })
    .populate({
      path: 'votes',
      model: 'Vote',
      select: 'upvote downvote',
    })
    .populate({
      path: 'comments',
      model: 'Comment',
      select: 'text votes replies user createdAt',
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
    })
    .populate({
      path: 'post.user',
      model: 'User',
      select: 'name profilePhoto',
    })
    .populate({
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
    })
    .populate({
      path: 'post.votes',
      model: 'Vote',
      select: 'upvote downvote',
    })
  return result
}

const deletePostFromDB = async (postId: string) => {
  const result = await Post.findByIdAndDelete(postId)
  return result
}

const updatePostIntoDB = async (
  postId: string,
  payload: { description: string },
) => {
  const findPost = await Post.findById(postId)
  const findPostObject = findPost?.toObject()
  if (!findPost) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post does not exist')
  }
  let updatedData
  if (findPost.isShared) {
    updatedData = payload
  } else {
    updatedData = {
      post: { ...findPostObject!.post, ...payload },
    }
  }
  const result = await Post.findByIdAndUpdate(postId, updatedData, {
    new: true,
  })
  return result
}

const createCommentReplyIntoDB = async (
  payload: TReply,
  commentId: string,
  userId: string,
) => {
  // find comment exist or not
  const findComment = await Comment.findById(commentId)
  if (!findComment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Doesn't find comment!")
  }

  // check user exist or not
  const findUser = await User.findById(userId)
  if (!findUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist')
  }

  // create votes
  const createVotes = await Vote.create({})
  if (createVotes?._id) {
    payload.votes = createVotes?._id
  }

  payload.commentReplyUser = findUser?._id
  payload.replyTo = findComment.user

  const result = await Comment.findByIdAndUpdate(commentId, {
    $push: { replies: payload },
  })
  return result
}

const updateUpvoteIntoDB = async (userId: string, voteId: string) => {
  // check user exist or not
  const findUser = await User.findById(userId)
  if (!findUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!")
  }

  // check vote exist or not
  const findVote = await Vote.findById(voteId)
  if (!findVote) {
    throw new AppError(httpStatus.BAD_REQUEST, "Vote doesn't exist!")
  }

  let result
  if (!findVote.upvote.includes(findUser?._id)) {
    // if downvoted then remove downvote
    if (findVote.downvote.includes(findUser?._id)) {
      await Vote.findByIdAndUpdate(
        voteId,
        {
          $pull: { downvote: findUser?._id },
        },
        { new: true },
      )
    }

    // push upvote inside upvoted array
    result = await Vote.findByIdAndUpdate(
      voteId,
      {
        $push: { upvote: findUser?._id },
      },
      { new: true },
    )
  } else {
    result = await Vote.findByIdAndUpdate(
      voteId,
      {
        $pull: { upvote: findUser?._id },
      },
      { new: true },
    )
  }
  return result
}

const updateDownvoteIntoDB = async (userId: string, voteId: string) => {
  // check user exist or not
  const findUser = await User.findById(userId)
  if (!findUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!")
  }

  // check vote exist or not
  const findVote = await Vote.findById(voteId)
  if (!findVote) {
    throw new AppError(httpStatus.BAD_REQUEST, "Vote doesn't exist!")
  }

  let result
  if (!findVote.downvote.includes(findUser?._id)) {
    // if downvoted then remove downvote
    if (findVote.upvote.includes(findUser?._id)) {
      await Vote.findByIdAndUpdate(
        voteId,
        {
          $pull: { upvote: findUser?._id },
        },
        { new: true },
      )
    }

    // push upvote inside upvoted array
    result = await Vote.findByIdAndUpdate(
      voteId,
      {
        $push: { downvote: findUser?._id },
      },
      { new: true },
    )
  } else {
    result = await Vote.findByIdAndUpdate(
      voteId,
      {
        $pull: { downvote: findUser?._id },
      },
      { new: true },
    )
  }
  return result
}

export const PostServices = {
  createPostIntoDB,
  getMyPostsFromDB,
  createCommentReplyIntoDB,
  deletePostFromDB,
  updatePostIntoDB,
  updateUpvoteIntoDB,
  updateDownvoteIntoDB,
  getPostsFromDB,
  createSharePostIntoDB,
  getPostFromDB,
  getVisitProfilePostsFromDB,
}
