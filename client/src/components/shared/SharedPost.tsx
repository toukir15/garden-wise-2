import React, { useContext } from "react";
import dayjs from "dayjs";
import LightGalleryImageView from "./PostComponents/LightGalleryImageView";
import relativeTime from "dayjs/plugin/relativeTime";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { UserLink } from "./PostComponents/UserLink";
import PostActions from "./PostComponents/PostActions";
import { PostHeader } from "./PostComponents/PostHeader";
import PostDescription from "./PostComponents/PostDescription";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
dayjs.extend(relativeTime);

// Main Component
export default function SharedPost({
  data,
  upvoteStatus,
  images,
  downvoteStatus,
}: any) {
  const { setPostUser, user } = useContext(UserContext) as IUserProviderValues;
  const isSharedPostOwner = user?._id === data?.sharedUser._id;
  const { postStates, modalStates } = useContext(
    PostContext
  ) as IPostProviderValues;
  const { onOpen } = modalStates.editModal;
  const { setPostId, setEditPostDescription } = postStates;
  const isPostOwner = user?._id === data?.post.user._id;
  const handleUserClick = (postUser: any) => setPostUser(postUser);
  const handleEditPost = () => {
    onOpen();
    setEditPostDescription(data.description);
    setPostId(data._id);
  };

  return (
    <div key={data._id} className="mt-4 shadow-md border-b border-gray-600">
      <PostHeader
        data={data}
        isOwner={isSharedPostOwner}
        handleUserClick={handleUserClick}
        handleEditPost={handleEditPost}
        user={data.sharedUser}
      />

      <PostDescription description={data.description} />

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

        <PostDescription description={data.post?.description} />

        <div className="flex w-[90%] mx-auto justify-center pt-4 pb-4">
          <LightGalleryImageView images={images} />
        </div>
      </div>

      <PostActions
        data={data}
        upvoteStatus={upvoteStatus}
        downvoteStatus={downvoteStatus}
      />
    </div>
  );
}
