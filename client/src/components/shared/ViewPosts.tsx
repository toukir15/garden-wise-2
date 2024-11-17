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
import { FiAlertCircle } from "react-icons/fi";

export default function ViewPost() {
  // Local state
  const [postId, setPostId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [isOpenSharedComment, setOpenSharedComment] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [editPostDescription, setEditPostDescription] = useState("");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  // const [page, setPage] = useState(1);

  // Refs
  const navbarRef = useRef<HTMLDivElement>(null);

  // Hook
  const {user} = useContext(UserContext) as IUserProviderValues

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
  const { data: postsData, isLoading: isPostsDataLoading } = useGetPosts({
    queryTerm,
    searchTerm,
  });

  console.log(postsData)


  // Upvote mutation hook
  const { mutate: handleUpvote } = useUpvote({ queryTerm, searchTerm});
  const handlePostUpvote = (voteId: string, postId: string) => {
    handleUpvote({ voteId, postId, userId });
  };

  // Downvote mutation hook
  const { mutate: handleDownvote } = useDownvote({ queryTerm, searchTerm});
  const handlePostDownvote = (voteId: string, postId: string) => {
    handleDownvote({ voteId, postId, userId });
  };

  // Share post mutation hook
  const { mutate: handleSharePost } = useSharePost({ queryTerm, searchTerm});
  const handlePostShare = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSharePost({ description, postId });
  };

  // Delete post mutation hook
  const { mutate: handleDelete } = useDeletePost({ queryTerm, searchTerm});
  const handlePostDelete = (postId: string) => {
    handleDelete({ postId });
  };

  // Edit post mutation hook
  const { mutate: handleEdit } = useEditPost({ queryTerm, searchTerm});
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
      {postsData?.data?.data?.length < 1 && (
       <div className="flex justify-center items-center mt-32 text-center">
       <div>
         <FiAlertCircle  size={40} className="text-gray-400 mx-auto" /> {/* Icon for alert */}
         <p className="text-gray-500 text-lg mt-4">No posts available.</p>
         <p className="text-sm text-gray-400 mt-2">It looks like there are no posts right now. Please check back later!</p>
       </div>
     </div>
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
          const upvoteStatus = checkVoteStatus(data.isShared, data, userId, "upvote");
          const downvoteStatus = checkVoteStatus(data.isShared, data, userId, "downvote");
console.log(data)
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
