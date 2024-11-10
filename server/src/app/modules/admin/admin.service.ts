import { Payment } from '../payment/payment.model';
import Post from '../posts/post.model'
import { User } from '../user/user.model';

const getUserActivityFromDB = async () => {
  // Fetch the posts data with necessary fields and populated paths
  const posts = await Post.find()
    .select('sharedUser votes isShared comments share post createdAt')
    .populate([
      { path: 'votes', select: 'upvote downvote' },
      { path: 'comments', select: 'user' },
      { path: 'post.votes', select: 'upvote downvote' },
      { path: 'post.comments', select: 'text user votes replies createdAt' },
    ]);

  // Initialize an object to store monthly data
  const monthlyData: Record<string, any> = {};

  posts.forEach((post) => {
    const monthYear = new Date(post.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });

    // Initialize entry if not present
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { name: monthYear, upvotes: 0, downvotes: 0, posts: 0, comments: 0 };
    }

    // Aggregate data for upvotes, downvotes, and comments
    const { upvote = [], downvote = [] } = post.votes || {};
    const postVotes = post.post?.votes || {};
    const postComments = post.post?.comments || [];

    monthlyData[monthYear].upvotes += upvote.length + (postVotes.upvote?.length || 0);
    monthlyData[monthYear].downvotes += downvote.length + (postVotes.downvote?.length || 0);
    monthlyData[monthYear].posts += 1;
    monthlyData[monthYear].comments += (post.comments?.length || 0) + postComments.length;
  });

  // Convert object to array and sort by month
  return Object.values(monthlyData).sort((a, b) => 
    new Date(`1 ${a.name}`).getTime() - new Date(`1 ${b.name}`).getTime()
  );
};

const getMonthlyPaymentsFromDB = async () => {
  // Fetch payment data from the database
  const payments = await Payment.find();

  // Initialize an object to store monthly payment totals
  const monthlyTotals: Record<string, number> = {};

  payments.forEach((payment) => {
    // Extract month and year from the createdAt field
    const monthYear = new Date(payment.createdAt).toLocaleString('default', { month: 'short' });

    // Initialize the month in the object if not present
    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = 0;
    }

    // Add the payment amount to the corresponding month
    monthlyTotals[monthYear] += parseFloat(payment.amount);
  });

  // Convert the monthly totals object to an array in the desired format
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyPaymentsData = monthOrder.map((month) => ({
    name: month,
    payments: monthlyTotals[month] || 0, // If a month has no data, set payments to 0
  }));

  return monthlyPaymentsData;
};

const getUsersFromDB = async (userId: string) => {
  const result = await User.find({_id: {$ne: userId}})
  return result
}

const deleteUserFromDB = async (userId: string) => {
  const result = await User.findByIdAndDelete(userId)
  console.log(result)
  return result
}

const updateUserIntoDB = async (userId: string) => {
  console.log(userId)
  const result = await User.findByIdAndUpdate(
    userId,
    { role: "admin" },
    { new: true } 
  );
  return result;
}

export const AdminService = {
  getUserActivityFromDB,
  getMonthlyPaymentsFromDB,
  getUsersFromDB,
  deleteUserFromDB,
  updateUserIntoDB
}