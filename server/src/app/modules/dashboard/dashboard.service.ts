import { Payment } from '../payment/payment.model'
import Post from '../posts/post.model'
import { User } from '../user/user.model'

const getUserActivityFromDB = async () => {
  const year = 2024
  const posts = await Post.find()
    .select('sharedUser votes isShared comments share post createdAt')
    .populate([
      { path: 'votes', select: 'upvote downvote' },
      { path: 'comments', select: 'user' },
      { path: 'post.votes', select: 'upvote downvote' },
      { path: 'post.comments', select: 'text user votes replies createdAt' },
    ])

  // Initialize an object to store monthly data
  const monthlyData: Record<string, any> = {}

  // Prepopulate all 12 months for the given year with default data
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  months.forEach(month => {
    const monthYear = `${month} ${year}`
    monthlyData[monthYear] = {
      name: monthYear,
      upvotes: 0,
      downvotes: 0,
      posts: 0,
      comments: 0,
    }
  })

  // Populate data from posts
  posts.forEach((post: any) => {
    const postYear = new Date(post.createdAt).getFullYear()
    if (postYear !== year) return // Skip posts not in the specified year

    const monthYear = new Date(post.createdAt).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    })

    // Aggregate data for upvotes, downvotes, and comments
    const { upvote = [], downvote = [] } = post.votes || {}
    const postVotes = post.post?.votes || {}
    const postComments = post.post?.comments || []

    monthlyData[monthYear].upvotes +=
      upvote.length + (postVotes.upvote?.length || 0)
    monthlyData[monthYear].downvotes +=
      downvote.length + (postVotes.downvote?.length || 0)
    monthlyData[monthYear].posts += 1
    monthlyData[monthYear].comments +=
      (post.comments?.length || 0) + postComments.length
  })

  // Convert object to array and sort by month
  const objArr = months.map(month => monthlyData[`${month} ${year}`])

  console.dir(objArr, { depth: true })

  return objArr
}

const getMonthlyPaymentsFromDB = async () => {
  // Fetch payment data from the database
  const payments = await Payment.find()

  // Initialize an object to store monthly payment totals
  const monthlyTotals: Record<string, number> = {}

  payments.forEach((payment: any) => {
    // Extract month and year from the createdAt field
    const monthYear = new Date(payment.createdAt).toLocaleString('default', {
      month: 'short',
    })

    // Initialize the month in the object if not present
    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = 0
    }

    // Add the payment amount to the corresponding month
    monthlyTotals[monthYear] += parseFloat(payment.amount)
  })

  // Convert the monthly totals object to an array in the desired format
  const monthOrder = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const monthlyPaymentsData = monthOrder.map(month => ({
    name: month,
    payments: monthlyTotals[month] || 0, // If a month has no data, set payments to 0
  }))

  return monthlyPaymentsData
}

const getPaymentsFromDB = async () => {
  const result = await Payment.find().populate([
    { path: 'user', select: 'name email isVerified' },
  ])
  return result
}

const getPostsFromDB = async () => {
  const result = await Post.find()
    .select('sharedUser votes isShared comments share post createdAt')
    .populate([
      { path: 'votes', select: 'upvote downvote' },
      { path: 'sharedUser', select: 'name email' },
      { path: 'comments', select: 'user' },
      { path: 'post.votes', select: 'upvote downvote' },
      { path: 'post.user', select: 'name email' },
      { path: 'post.comments', select: 'text user votes replies createdAt' },
    ])

  const posts = result.map((post: any) => ({
    _id: post._id,
    userName:
      post.isShared && post.sharedUser
        ? post.sharedUser.name
        : post.post.user.name,
    email:
      post.isShared && post.sharedUser
        ? post.sharedUser.email
        : post.post.user.email,
    upvotes: post.isShared
      ? post.votes.upvote.length
      : post.post.votes.upvote.length,
    downvotes: post.isShared
      ? post.votes.downvote.length
      : post.post.votes.downvote.length,
    comments: post.isShared ? post.comments.length : post.post.comments.length,
    isShared: post.isShared,
  }))

  return posts
}

const getUsersFromDB = async (userId: string) => {
  const result = await User.find({ _id: { $ne: userId } })
  return result
}

const deleteUserFromDB = async (userId: string) => {
  const result = await User.findByIdAndDelete(userId)
  return result
}

const updateUserIntoDB = async (userId: string) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { role: 'admin' },
    { new: true },
  )
  return result
}

export const AdminService = {
  getUserActivityFromDB,
  getMonthlyPaymentsFromDB,
  getUsersFromDB,
  deleteUserFromDB,
  updateUserIntoDB,
  getPaymentsFromDB,
  getPostsFromDB,
}
