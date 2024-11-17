import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import React, { useContext, useState } from "react";
import LightGalleryImageView from "./PostComponents/LightGalleryImageView";
import PostDescription from "./PostComponents/PostDescription";
import PostActions from "./PostComponents/PostActions";
import { PostHeader } from "./PostComponents/PostHeader";

export default function Post({
  data,
  navbarRef,
  isDropdownOpen,
  toggleDropdown,
  setPostId,
  handlePostDelete,
  handlePostDownvote,
  handlePostUpvote,
  setIsOpenComment,
  setOpenSharedComment,
  upvoteStatus,
  downvoteStatus,
  onOpen,
  editOnOpen,
  setEditPostDescription,
  postId,
}: any) {
  const { setPostUser, user } = useContext(UserContext) as IUserProviderValues;
  const isPostOwner = user?._id === data?.post.user._id;
  const handleUserClick = (postUser: any) => setPostUser(postUser);
  const handleEditPost = () => {
    editOnOpen();
    setEditPostDescription(data.description);
    setPostId(data._id);
  };
  return (
    <div className="my-4 shadow-md border-b border-gray-600" ref={navbarRef}>
      <div className="flex justify-between">
        <PostHeader
          data={data}
          isOwner={isPostOwner}
          handleUserClick={handleUserClick}
          toggleDropdown={toggleDropdown}
          setPostId={setPostId}
          handlePostDelete={handlePostDelete}
          handleEditPost={handleEditPost}
          isDropdownOpen={isDropdownOpen}
          postId={postId}
          user={data.post.user}
        />
      </div>
      <PostDescription description={data.post?.description} />
      <div className="flex w-[85%] mx-auto justify-center pt-4">
        <LightGalleryImageView images={data.post.images} />
      </div>
      <div className="w-[75%] mx-auto">
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
    </div>
  );
}
