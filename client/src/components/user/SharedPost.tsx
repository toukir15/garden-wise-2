import React, { useContext } from "react";
import dayjs from "dayjs";
import { FaDownLong, FaUpLong } from "react-icons/fa6";
import LightGalleryImageView from "./LightGalleryImageView";
import { IoIosShareAlt } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import relativeTime from "dayjs/plugin/relativeTime";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { UserLink } from "./SharedPost/UserLink";
import { PostDropdown } from "./SharedPost/PostDropdown";
import { PostContent } from "./SharedPost/PostContent";
import PostActions from "./post/PostActions";
import { PostHeader } from "./SharedPost/PostHeader";
dayjs.extend(relativeTime);

// Main Component
export default function SharedPost({
  data,
  isDropdownOpen,
  toggleDropdown,
  setPostId,
  handlePostDelete,
  handlePostDownvote,
  handlePostUpvote,
  setIsOpenComment,
  setOpenSharedComment,
  upvoteStatus,
  images,
  downvoteStatus,
  onOpen,
  editOnOpen,
  setEditPostDescription,
  postId,
}: any) {
  const { setPostUser, user } = useContext(UserContext) as IUserProviderValues;
  const isSharedPostOwner = user?._id === data?.sharedUser._id;
  const isPostOwner = user?._id === data?.post.user._id;
  const handleUserClick = (postUser: any) => setPostUser(postUser);
  const handleEditPost = () => {
    editOnOpen();
    setEditPostDescription(data.description);
    setPostId(data._id);
  };

  return (
    <div key={data._id} className="mt-4 shadow-md border-b border-gray-600">
       <PostHeader
        data={data}
        isOwner={isSharedPostOwner}
        handleUserClick={handleUserClick}
        toggleDropdown={toggleDropdown}
        setPostId={setPostId}
        handlePostDelete={handlePostDelete}
        handleEditPost={handleEditPost}
        isDropdownOpen={isDropdownOpen}
        postId={postId}
      />
      
      <PostContent description={data.description} />

      <div className="mx-6 border border-gray-600 p-2 mt-2 rounded-lg">
        <UserLink
          user={data.post.user}
          isOwner={isPostOwner}
          handleUserClick={handleUserClick}
          category={data.post.category}
          isPremium={data.post.isPremium}
          createdAt={data.post.createdAt}
          isShared={data.isShared}
        />
        <PostContent
          description={data.post.description}
        />

        <div className="flex w-[90%] mx-auto justify-center pt-4 pb-8">
          <LightGalleryImageView images={images} />
        </div>
      </div>

      <PostActions
        data={data}
        upvoteStatus={upvoteStatus}
        downvoteStatus={downvoteStatus}
        setPostId={setPostId}
        handlePostUpvote={handlePostUpvote}
        handlePostDownvote={handlePostDownvote}
        setIsOpenComment={setIsOpenComment}
        setOpenSharedComment={setOpenSharedComment}
        onOpen={onOpen}
      />
    </div>
  );
}
