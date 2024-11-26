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
  useSharePost,
  useUpvote,
} from "@/src/hooks/post.hook";
import ViewComment from "./PostComponents/ViewComment";
import { checkVoteStatus } from "@/src/utils/checkVoteStatus";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { TPost } from "../../../types";
import ComponentLoading from "../loading/ComponentLoading";
import { PostContext } from "@/src/context/post.provider";
import SharedPost from "./SharedPost";
import Post from "./Post";
import EditPostModal from "../modal/EditPostModal";
import SharePostModal from "../modal/SharePostModal";
import { FiAlertCircle } from "react-icons/fi";
import { useGetBookmarks } from "@/src/hooks/bookmark.hook";
import NoResults from "./NoResult";

export default function ViewBookmark() {
  // Local state
  const [postId, setPostId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [isOpenSharedComment, setOpenSharedComment] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [editPostDescription, setEditPostDescription] = useState("");
  // const [page, setPage] = useState(1);

  // Refs
  const navbarRef = useRef<HTMLDivElement>(null);

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

  // Dropdown toggle function
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Get posts hook
  const { data: postsData, isLoading: isPostsDataLoading } = useGetBookmarks();

  // Upvote mutation hook
  const { mutate: handleUpvote } = useUpvote({ queryTerm, searchTerm });
  const handlePostUpvote = (voteId: string, postId: string) => {
    handleUpvote({ voteId, postId, userId });
  };

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

  // Infinite Scroll Logic
  // const handleScroll = () => {
  //   const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
  //   if (bottom && postsData?.data?.data?.length && !isPostsDataLoading) {
  //     setPage((prev) => prev + 1);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [postsData]);

  return (
    <div>
      {/* NO DATA AVAILABLE MESSAGE */}
      {postsData?.data?.data?.posts.length < 1 && (
        <NoResults
          message="No posts available."
          description=" It looks like there are no Bookmark posts right now. Please check back
                later!"
          height="h-[calc(100vh-400px)]"
        />
      )}

      {/* POSTS LOADING... */}
      {isPostsDataLoading && <ComponentLoading />}

      {/* Render Posts */}
      <div>
        {postsData?.data?.data?.posts.map((data: TPost, key: number) => {
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
              ) : (
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

        {/* Modals */}
        <SharePostModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handlePostShare={handlePostShare}
          description={description}
          setDescription={setDescription}
        />

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
    </div>
  );
}
