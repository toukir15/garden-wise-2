import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import React, { useContext } from "react";
import LightGalleryImageView from "./PostComponents/LightGalleryImageView";
import PostDescription from "./PostComponents/PostDescription";
import PostActions from "./PostComponents/PostActions";
import { PostHeader } from "./PostComponents/PostHeader";
import { PostContext } from "@/src/context/post.provider";

export default function Post({
  data,
  navbarRef,
  handlePostDelete,
  handlePostDownvote,
  handleSaveUnsave,
  upvoteStatus,
  downvoteStatus,
  onOpen,
  editOnOpen,
  postId,
}: any) {
  const { setPostUser } = useContext(UserContext) as IUserProviderValues;
  const handleUserClick = (postUser: any) => setPostUser(postUser);
  const { setPostId, setEditPostDescription } = useContext(PostContext);
  const handleEditPost = () => {
    editOnOpen();
    setEditPostDescription(data.post.description);
    setPostId(data._id);
  };
  return (
    <div className="my-4 shadow-md border-b border-gray-600" ref={navbarRef}>
      <div className="flex justify-between">
        <PostHeader
          data={data}
          handleUserClick={handleUserClick}
          handlePostDelete={handlePostDelete}
          handleEditPost={handleEditPost}
          handleSaveUnsave={handleSaveUnsave}
          postId={postId}
          user={data.post.user}
        />
      </div>
      <PostDescription description={data.post?.description} />
      <div className="flex w-[85%] mx-auto justify-center pt-4">
        <LightGalleryImageView images={data.post.images} />
      </div>
      <div className="xl:w-[75%] mx-auto">
        <PostActions
          data={data}
          upvoteStatus={upvoteStatus}
          downvoteStatus={downvoteStatus}
          handlePostDownvote={handlePostDownvote}
          onOpen={onOpen}
        />
      </div>
    </div>
  );
}
