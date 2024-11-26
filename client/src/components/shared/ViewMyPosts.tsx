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
import ViewComment from "../shared/PostComponents/ViewComment";
import { checkVoteStatus } from "@/src/utils/checkVoteStatus";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { TPost } from "../../../types";
import ComponentLoading from "../loading/ComponentLoading";
import { PostContext } from "@/src/context/post.provider";
import SharedPost from "../shared/SharedPost";
import Post from "../shared/Post";
import { FiAlertCircle } from "react-icons/fi";
import SharePostModal from "../modal/SharePostModal";
import EditPostModal from "../modal/EditPostModal";
import ProfilePostLoading from "../loading/ProfilePostLoading";
import NoResults from "./NoResult";

export default function ViewMyPost({ postsData, isPostsDataLoading }: any) {
  // local state
  const [postId, setPostId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [isOpenSharedComment, setOpenSharedComment] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [editPostDescription, setEditPostDescription] = useState("");

  // ref
  const navbarRef = useRef<HTMLDivElement>(null);

  // hook
  const { user } = useContext(UserContext) as IUserProviderValues;

  // modal state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: editOnOpen,
    onOpenChange: editOnOpenChange,
  } = useDisclosure();

  // context
  const { queryTerm, searchTerm, setPostCount } = useContext(PostContext);

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

  const upvoteCount = postsData?.data.data.reduce(
    (accumulator: number, currentValue: TPost) => {
      if (currentValue.isShared) {
        accumulator += currentValue.votes.upvote.length;
      } else {
        accumulator += currentValue.post.votes!.upvote.length;
      }
      return accumulator;
    },
    0
  );

  useEffect(() => {
    setPostCount(upvoteCount);
  }, [upvoteCount]);

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

  return (
    <>
      {isPostsDataLoading && <ProfilePostLoading />}
      {postsData?.data?.data?.length < 1 && (
        <NoResults
          message="No posts available."
          description=" It looks like there are no posts right now. Please check back
                later!"
          height="h-[calc(100vh-400px)]"
        />
      )}
      <div className="w-full">
        {postsData?.data?.data?.map((data: TPost, key: number) => {
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
            <div key={key}>
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
