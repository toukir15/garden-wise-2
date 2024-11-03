"use client";
import { FaComment } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import toukir from "../../../public/toukir.jpg";
import { useContext, useEffect, useRef, useState } from "react";
import { FaDownLong, FaUpLong } from "react-icons/fa6";
import Image from "next/image";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "lightgallery/css/lightgallery.css";
import LightGalleryImageView from "./LightGalleryImageView";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
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
import { TPost } from "../../../types";
import ComponentLoading from "../ComponentLoading";
import { PostContext } from "@/src/context/post.provider";
import SharedPost from "./SharedPost";
import Post from "./Post";

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => null,
});

const items = [
  {
    key: "copy",
    label: "Copy",
  },
  {
    key: "edit",
    label: "Edit",
  },
  {
    key: "delete",
    label: "Delete",
  },
];

export default function ViewPost() {
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
  const {
    data: postsData,
    isLoading: isPostsDataLoading,
    error: postsDataError,
  } = useGetPosts({ queryTerm, searchTerm });
  console.log(postsData);

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
      {isPostsDataLoading && <ComponentLoading />}
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
              <SharedPost {...{
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
              }} />
              )}
            </div>
          );
        })}

        {/* share post  */}
        <Modal
          className="bg-[#121212]"
          isOpen={isOpen}
          size="2xl"
          onOpenChange={onOpenChange}
        >
          <form onSubmit={handlePostShare}>
            <ModalContent className="absolute top-8 -translate-x-9">
              {(onClose) => (
                <>
                  <ModalHeader className="flex text-center flex-col gap-1 border-b border-gray-600">
                    Share post
                  </ModalHeader>
                  <ModalBody>
                    {/* Rich Text Editor */}
                    <div className="mt-3">
                      <ReactQuill
                        placeholder="Add a description..."
                        className="text-white custom-quill"
                        value={description}
                        onChange={setDescription}
                        style={{ height: "150px" }}
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className="bg-green-500 py-2 mt-10 font-medium rounded-full w-full"
                      type="submit"
                      onPress={onClose}
                    >
                      Share
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </form>
        </Modal>

        {/* edit post  */}
        <Modal
          className="bg-[#121212]"
          isOpen={isEditOpen}
          size="2xl"
          onOpenChange={editOnOpenChange}
        >
          <form onSubmit={handlePostEdit}>
            <ModalContent className="absolute top-8 -translate-x-9">
              {(onClose) => (
                <>
                  <ModalHeader className="flex text-center flex-col gap-1 border-b border-gray-600">
                    Edit Post
                  </ModalHeader>
                  <ModalBody>
                    {/* Rich Text Editor */}
                    <div className="mt-3">
                      <ReactQuill
                        placeholder="Add a description..."
                        className="text-white custom-quill"
                        defaultValue={editPostDescription}
                        onChange={setEditPostDescription}
                        style={{ height: "150px" }}
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className="bg-green-500 py-2 mt-10 font-medium rounded-full w-full"
                      type="submit"
                      onPress={onClose}
                    >
                      Edit Post
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </form>
        </Modal>

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
