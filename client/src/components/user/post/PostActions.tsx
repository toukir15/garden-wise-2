import { FaComment } from "react-icons/fa";
import { FaDownLong, FaUpLong } from "react-icons/fa6";
import { IoIosShareAlt } from "react-icons/io";

interface PostActionsProps {
  data: any;
  upvoteStatus: boolean;
  handlePostUpvote: Function;
  handlePostDownvote: Function;
  downvoteStatus: boolean;
  setIsOpenComment: Function;
  setOpenSharedComment: Function;
  setPostId: Function;
  onOpen: Function;
}

const PostActions: React.FC<PostActionsProps> = ({
  data,
  upvoteStatus,
  handlePostUpvote,
  handlePostDownvote,
  downvoteStatus,
  setIsOpenComment,
  setOpenSharedComment,
  setPostId,
  onOpen,
}) => (
  <div className="flex justify-between px-4 pb-4">
    <button
      onClick={() => handlePostUpvote(data.post.votes?._id, data?._id)}
      className={`${upvoteStatus ? "text-green-500" : "hover:text-gray-400"} flex items-center transition duration-150`}
    >
      <FaUpLong className="text-[20px]" />
      <p>{data.post?.votes?.upvote?.length || 0}</p>
    </button>
    <button
      onClick={() => handlePostDownvote(data.post.votes?._id, data?._id)}
      className={`${downvoteStatus ? "text-green-500" : "hover:text-gray-400"} flex items-center transition duration-150`}
    >
      <FaDownLong className="text-[20px]" />
      <p>{data.post?.votes?.downvote?.length || 0}</p>
    </button>
    <button
      onClick={() => {
        setPostId(data?._id);
        setIsOpenComment(true);
        setOpenSharedComment(false);
      }}
      className="flex items-center gap-1 hover:text-gray-400 transition duration-150"
    >
      <FaComment />
      <p>{data.post?.comments?.length || 0}</p>
    </button>
    <button
      onClick={() => {
        onOpen();
        setPostId(data._id);
      }}
      className="flex bg-black items-center gap-1 hover:text-gray-400 transition duration-150"
    >
      <IoIosShareAlt className="text-2xl text-txt-200" />
    </button>
  </div>
);

export default PostActions;