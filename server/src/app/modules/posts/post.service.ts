import httpStatus, { BAD_REQUEST } from 'http-status'
import AppError from '../../errors/AppError'
import { TComments, TReply } from '../comment/comment.interface'
import { User } from '../user/user.model'
import { Vote } from '../vote/vote.model'
import { TPost } from './post.interface'
import Post from './post.model'
import { Comment } from '../comment/comment.model'

const createPostIntoDB = async (
  payload: TPost,
  postImages: string[],
  userId: string,
) => {
  const createVotes = await Vote.create({})
  const postData = {
    post: {
      ...payload,
      user: userId,
      votes: createVotes?._id,
      images: postImages,
    },
  }
  const result = await Post.create(postData)
  return result
}

const createSharePostIntoDB = async (
  postId: string,
  userId: string,
  payload: { description: string },
) => {
  const createVotes = await Vote.create({})

  const findPost = await Post.findById(postId)

  const sharePostData = {
    description: payload.description,
    isShared: true,
    post: findPost!.post,
    sharedUser: userId,
    votes: createVotes?._id,
  }

  const result = await Post.create(sharePostData)
  return result
}

const getPostsFromDB = async () => {
  const result = await Post.find()
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

const createCommentIntoDB = async (
  payload: TComments,
  postId: string,
  userId: string,
) => {
  // find user exist or not
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError(BAD_REQUEST, "User doesn't exist!")
  }

  // find post
  const findPost = await Post.findById(postId)
  if (!findPost) {
    throw new AppError(BAD_REQUEST, 'Post no longer available!')
  }

  // create votes
  const createVotes = await Vote.create({})
  if (createVotes?._id) {
    payload.votes = createVotes?._id
  }

  // set user id
  payload.user = user?._id

  const result = await Comment.create(payload)
  //   update post coment id
  if (findPost.isShared) {
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: result?._id },
    })
  } else {
    await Post.findByIdAndUpdate(postId, {
      $push: { 'post.comments': result?._id },
    })
  }
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
  createCommentIntoDB,
  createCommentReplyIntoDB,
  updateUpvoteIntoDB,
  updateDownvoteIntoDB,
  getPostsFromDB,
  createSharePostIntoDB,
  getPostFromDB,
}
