import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import React, { useContext } from "react";
import LightGalleryImageView from "./PostComponents/LightGalleryImageView";
import PostDescription from "./PostComponents/PostDescription";
import PostActions from "./PostComponents/PostActions";
import { PostHeader } from "./PostComponents/PostHeader";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";

export default function Post({
  data,
  navbarRef,
  upvoteStatus,
  downvoteStatus,
}: any) {
  const { setPostUser } = useContext(UserContext) as IUserProviderValues;
  const handleUserClick = (postUser: any) => setPostUser(postUser);
  const { postStates, modalStates } = useContext(
    PostContext
  ) as IPostProviderValues;
  const { onOpen } = modalStates.editModal;
  const { setPostId, setEditPostDescription } = postStates;
  const handleEditPost = () => {
    onOpen();
    setEditPostDescription(data.post.description);
    setPostId(data._id);
  };
  return (
    <div className="mt-4 shadow-md border-b border-gray-600" ref={navbarRef}>
      <div className="flex justify-between">
        <PostHeader
          data={data}
          handleUserClick={handleUserClick}
          handleEditPost={handleEditPost}
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
        />
      </div>
    </div>
  );
}
