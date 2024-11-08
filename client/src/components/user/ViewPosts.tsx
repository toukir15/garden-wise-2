"use client";
import { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "lightgallery/css/lightgallery.css";
import { useDisclosure } from "@nextui-org/react";
import {
  useDeletePost,
  useDownvote,
  useEditPost,
  useSharePost,
  useUpvote,
} from "@/src/hooks/post.hook";
import { useGetPosts } from "@/src/hooks/recentPosts.hook";
import ViewComment from "./ViewComment";
import { checkVoteStatus } from "@/src/utils/checkVoteStatus";
import { useUser } from "@/src/context/user.provider";
import { IUser, TPost } from "../../../types";
import ComponentLoading from "../ComponentLoading";
import { PostContext } from "@/src/context/post.provider";
import SharedPost from "./SharedPost";
import Post from "./Post";
import EditPostModal from "../modal/EditPostModal";
import SharePostModal from "../modal/SharePostModal";
import { useFollowUser } from "@/src/hooks/connection.hook";
import React from "react";
import MobileFollowSugg from "./MobileFollowSugg";

export default function ViewPost() {
  // local state
  const [postId, setPostId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [isOpenSharedComment, setOpenSharedComment] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [editPostDescription, setEditPostDescription] = useState("");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // ref
  const navbarRef = useRef<HTMLDivElement>(null);

  // hook
  const { user } = useUser();

  // modal state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: editOnOpen,
    onOpenChange: editOnOpenChange,
  } = useDisclosure();

  // context
  const { queryTerm, searchTerm } = useContext(PostContext);

  const userId = user!?._id;

  // dropdown
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !(
          event.target instanceof Node &&
          navbarRef.current.contains(event.target)
        )
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // get post hook
  const { data: postsData, isLoading: isPostsDataLoading } = useGetPosts({
    queryTerm,
    searchTerm,
  });

  // upvote mutation hook
  const { mutate: handleUpvote } = useUpvote({ queryTerm, searchTerm });
  const handlePostUpvote = (voteId: string, postId: string) => {
    handleUpvote({ voteId, postId, userId });
  };

  // downvote mutation hook
  const { mutate: handleDownvote } = useDownvote({ queryTerm, searchTerm });
  const handlePostDownvote = (voteId: string, postId: string) => {
    handleDownvote({ voteId, postId, userId });
  };

  // share post mutation hook
  const { mutate: handleSharePost } = useSharePost({ queryTerm, searchTerm });
  const handlePostShare = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSharePost({ description, postId });
  };

  // delete post mutation hook
  const { mutate: handleDelete } = useDeletePost({ queryTerm, searchTerm });
  const handlePostDelete = (postId: string) => {
    handleDelete({ postId });
  };

  // edit post mutation hook
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
    <>
      {/* NO DATA AVAILABLE MESSAGE  */}
      {postsData?.data?.length < 1 && (
        <h1 className="text-gray-600 text-center mt-32 text-2xl font-medium">
          It looks a little empty here!
        </h1>
      )}

      {/* POSTS LOADING...  */}
      {isPostsDataLoading && <ComponentLoading />}

      {/* MOBILE FOLLOW SUGGETION  */}
      <MobileFollowSugg
        handleFollowRequest={handleFollowRequest}
        loadingUserId={loadingUserId}
      />

      <div>
        {postsData?.data?.map((data: TPost, key: number) => {
          const images = data.post.images || [];
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
            <>
              <div key={key}>
                {/* POST  */}
                {!data.isShared && (
                  <Post
                    {...{
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
                      images,
                      downvoteStatus,
                      onOpen,
                      editOnOpen,
                      setEditPostDescription,
                      postId,
                    }}
                  />
                )}

                {/* SHARED POST  */}
                {data.isShared && (
                  <SharedPost
                    {...{
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
                    }}
                  />
                )}
              </div>
            </>
          );
        })}

        {/* share post  */}
        <SharePostModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handlePostShare={handlePostShare}
          description={description}
          setDescription={setDescription}
        />

        {/* edit post  */}
        <EditPostModal
          isEditOpen={isEditOpen}
          editOnOpenChange={editOnOpenChange}
          handlePostEdit={handlePostEdit}
          editPostDescription={editPostDescription}
          setEditPostDescription={setEditPostDescription}
        />

        {(isOpenComment || isOpenSharedComment) && (
          <ViewComment
            postId={postId}
            setOpenSharedComment={setOpenSharedComment}
            setIsOpenComment={setIsOpenComment}
          />
        )}
      </div>
    </>
  );
}
