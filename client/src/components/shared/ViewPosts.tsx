"use client";
import { useContext, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "lightgallery/css/lightgallery.css";
import { useDisclosure } from "@nextui-org/react";
import {
  useDeletePost,
  useDownvote,
  useEditPost,
  useGetPosts,
  useSharePost,
  useUpvote,
} from "@/src/hooks/post.hook";
import ViewComment from "./PostComponents/ViewComment";
import { checkVoteStatus } from "@/src/utils/checkVoteStatus";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { IUser, TPost } from "../../../types";
import ComponentLoading from "../loading/ComponentLoading";
import { PostContext } from "@/src/context/post.provider";
import SharedPost from "./SharedPost";
import Post from "./Post";
import EditPostModal from "../modal/EditPostModal";
import SharePostModal from "../modal/SharePostModal";
import { useFollowUser } from "@/src/hooks/connection.hook";
import MobileFollowSugg from "../MobileFollowSugg";
import NoResults from "./NoResult";

export default function ViewPost() {
  // Refs
  const navbarRef = useRef<HTMLDivElement>(null);
  // Local state
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const {
    postId,
    isOpenComment,
    isOpenSharedComment,
    description,
    editPostDescription,
  } = useContext(PostContext);

  // Hook
  const { user } = useContext(UserContext) as IUserProviderValues;

  // Modal state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: editOnOpen,
    onOpenChange: editOnOpenChange,
  } = useDisclosure();

  // Context
  const { queryTerm, searchTerm } = useContext(PostContext);

  const userId = user!?._id;

  // Get posts hook
  const { data: postsData, isLoading: isPostsDataLoading } = useGetPosts({
    queryTerm,
    searchTerm,
  });

  // Downvote mutation hook
  const { mutate: handleDownvote } = useDownvote({ queryTerm, searchTerm });
  const handlePostDownvote = (voteId: string, postId: string) => {
    handleDownvote({ voteId, postId, userId });
  };

  // Share post mutation hook
  const { mutate: handleSharePost } = useSharePost({ queryTerm, searchTerm });
  const handlePostShare = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSharePost({ description, postId });
  };

  // Delete post mutation hook
  const { mutate: handleDelete } = useDeletePost({ queryTerm, searchTerm });
  const handlePostDelete = (postId: string) => {
    handleDelete({ postId });
  };

  // Edit post mutation hook
  const { mutate: handleEdit } = useEditPost({ queryTerm, searchTerm });
  const handlePostEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { description: editPostDescription };
    handleEdit({ postId, payload });
  };

  const { mutate: handleFollow } = useFollowUser();
  const handleFollowRequest = (user: Partial<IUser>) => {
    if (!user._id) return;
    setLoadingUserId(user._id);
    handleFollow(
      { user: user },
      {
        onSettled: () => {
          setLoadingUserId(null);
        },
      }
    );
  };

  return (
    <div>
      {/* NO DATA AVAILABLE MESSAGE */}
      {postsData?.data?.data?.length < 1 && (
        <NoResults
          message="No posts available."
          height="h-[calc(100vh-140px)]"
          description=" It looks like there are no posts right now. Please check back
                later!"
        />
      )}

      {/* POSTS LOADING... */}
      {isPostsDataLoading && <ComponentLoading />}

      {/* MOBILE FOLLOW SUGGESTION */}
      <MobileFollowSugg
        handleFollowRequest={handleFollowRequest}
        loadingUserId={loadingUserId}
      />

      {/* Render Posts */}
      <div>
        {postsData?.data?.data?.map((data: TPost, key: number) => {
          const images = data?.post?.images || [];
          const upvoteStatus = checkVoteStatus(
            data.isShared,
            data,
            userId,
            "upvote"
          );
          const downvoteStatus = checkVoteStatus(
            data.isShared,
            data,
            userId,
            "downvote"
          );
          return (
            <div key={key}>
              {/* Render Post or SharedPost depending on data */}
              {!data.isShared ? (
                <Post
                  {...{
                    data,
                    navbarRef,
                    handlePostDelete,
                    handlePostDownvote,
                    upvoteStatus,
                    images,
                    downvoteStatus,
                    onOpen,
                    editOnOpen,
                    postId,
                  }}
                />
              ) : (
                <SharedPost
                  {...{
                    data,
                    handlePostDelete,
                    handlePostDownvote,
                    upvoteStatus,
                    images,
                    downvoteStatus,
                    onOpen,
                    editOnOpen,
                    postId,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Modals */}
        <SharePostModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handlePostShare={handlePostShare}
        />

        <EditPostModal
          isEditOpen={isEditOpen}
          editOnOpenChange={editOnOpenChange}
          handlePostEdit={handlePostEdit}
        />

        {(isOpenComment || isOpenSharedComment) && <ViewComment />}
      </div>
    </div>
  );
}
