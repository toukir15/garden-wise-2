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
  useGetMyPosts,
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

export default function ViewMyPost() {
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

  // get post hook
  const {
    data: postsData,
    isLoading: isPostsDataLoading,
    error: postsDataError,
  } = useGetMyPosts();

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
      {isPostsDataLoading && <ComponentLoading />}
      <div>
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
                <div
                  className="my-4 shadow-md border-b border-gray-600"
                  ref={navbarRef}
                >
                  <div className="flex justify-between">
                    <button className="flex gap-2 items-center p-2 cursor-pointer w-fit">
                      <Image
                        className=" rounded-full"
                        height={45}
                        width={45}
                        src={toukir}
                        alt=""
                      />
                      <div className="text-start">
                        <p className="font-medium">{data.post.user?.name}</p>
                        <p className="text-sm text-green-500">
                          {dayjs(data?.createdAt).fromNow()}
                        </p>
                      </div>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => {
                          toggleDropdown();
                          setPostId(data?._id);
                        }}
                        className="mr-8 relative"
                      >
                        <HiDotsHorizontal className="text-[20px] hover:text-green-500 transition duration-150" />
                      </button>
                      {isDropdownOpen && postId == data?._id && (
                        <div className="rounded bg-white shadow-sm z-50 w-40 absolute flex flex-col -left-[170px]">
                          <Dropdown>
                            {[
                              <DropdownMenu
                                key="dropdown-menu"
                                aria-label="Dynamic Actions"
                                items={items}
                              >
                                {(item) => (
                                  <DropdownItem
                                    onClick={() => {
                                      if (item.key === "delete") {
                                        handlePostDelete(postId);
                                      }
                                      if (item.key === "edit") {
                                        editOnOpen();
                                        setEditPostDescription(
                                          data.post.description
                                        );
                                        setPostId(data._id);
                                      }
                                    }}
                                    key={item.key}
                                    color={
                                      item.key === "delete"
                                        ? "danger"
                                        : "default"
                                    }
                                    className={
                                      item.key === "delete" ? "text-danger" : ""
                                    }
                                  >
                                    {item.label}
                                  </DropdownItem>
                                )}
                              </DropdownMenu>,
                            ]}
                          </Dropdown>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <p className="ml-4 text-sm rounded text-green-500 bg-[#1a2a17d4] w-fit px-3 py-[4px] my-1 ">
                  Vegitable
                </p> */}
                  <div className="mx-4 text-gray-200 break-words">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.post.description || "",
                      }}
                    ></div>
                  </div>
                  <div className="w-[80%] mx-auto ">
                    {/* light gellery image view  */}
                    <div className="flex justify-center pt-4 pb-2">
                      <div className="flex justify-center gap-1 pt-4 pb-2">
                        {/* LightGallery wrapper */}
                        <LightGalleryImageView images={images} />
                      </div>
                    </div>

                    {/* upvote downvote comment share buttons  */}
                    <div className="flex justify-between mt-4 px-4 pb-4">
                      <button
                        onClick={() => {
                          handlePostUpvote(
                            data.post.votes?._id as string,
                            data?._id
                          );
                        }}
                        className={` ${upvoteStatus ? "text-green-500" : "hover:text-gray-400"}  flex items-center  transition duration-150`}
                      >
                        <FaUpLong className={`text-[20px]`} />
                        <p>
                          {data.post?.votes?.upvote?.length
                            ? data.post.votes.upvote?.length
                            : 0}
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          handlePostDownvote(
                            data.post.votes?._id as string,
                            data?._id
                          );
                        }}
                        className={` ${downvoteStatus ? "text-green-500" : "hover:text-gray-400"}  flex items-center  transition duration-150`}
                      >
                        <FaDownLong className={`text-[20px]`} />
                        <p>
                          {data.post?.votes?.downvote?.length
                            ? data.post.votes.downvote?.length
                            : 0}
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          setPostId(data?._id);
                          setIsOpenComment(true);
                          setOpenSharedComment(false);
                        }}
                        className="flex items-center gap-1 hover:text-gray-400 transition duration-150"
                      >
                        <FaComment />
                        <p>
                          {data.post?.comments?.length
                            ? data.post?.comments?.length
                            : 0}
                        </p>
                      </button>
                      <Button
                        onClick={() => setPostId(data._id)}
                        onPress={onOpen}
                        className="flex bg-black items-center gap-1 hover:text-gray-400 transition duration-150"
                      >
                        <IoIosShareAlt className="text-2xl text-txt-200" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {data.isShared && (
                <div
                  key={key}
                  className="mt-4 shadow-md border-b border-gray-600"
                >
                  <div>
                    <>
                      <div className="flex justify-between">
                        <button className="flex gap-2 items-center p-2 cursor-pointer w-fit text-start">
                          <Image
                            className=" rounded-full"
                            height={45}
                            width={45}
                            src={toukir}
                            alt=""
                          />
                          <div>
                            <p className="font-medium">
                              {data.sharedUser?.name}
                            </p>
                            <p className="text-sm text-green-500">
                              {dayjs(data.createdAt).fromNow()}
                            </p>
                          </div>
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => {
                              toggleDropdown();
                              setPostId(data?._id);
                            }}
                            className="mr-8 relative"
                          >
                            <HiDotsHorizontal className="text-[20px] hover:text-green-500 transition duration-150" />
                          </button>
                          {isDropdownOpen && postId == data?._id && (
                            <div className="rounded bg-white shadow-sm z-50 w-40 absolute flex flex-col -left-[170px]">
                              <Dropdown>
                                {[
                                  <DropdownMenu
                                    key="dropdown-menu"
                                    aria-label="Dynamic Actions"
                                    items={items}
                                  >
                                    {(item) => (
                                      <DropdownItem
                                        onClick={() => {
                                          if (item.key === "delete") {
                                            handlePostDelete(postId);
                                          }
                                          if (item.key === "edit") {
                                            editOnOpen();
                                            setEditPostDescription(
                                              data.description
                                            );
                                            setPostId(data._id);
                                          }
                                        }}
                                        key={item.key}
                                        color={
                                          item.key === "delete"
                                            ? "danger"
                                            : "default"
                                        }
                                        className={
                                          item.key === "delete"
                                            ? "text-danger"
                                            : ""
                                        }
                                      >
                                        {item.label}
                                      </DropdownItem>
                                    )}
                                  </DropdownMenu>,
                                ]}
                              </Dropdown>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="pl-4">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: data.description || "",
                          }}
                        ></div>
                      </div>
                    </>
                    <div className="">
                      <div className="mx-6 border border-gray-600 p-2 mt-2 rounded-lg">
                        <button className=" text-start flex gap-2 items-center p-2 cursor-pointer w-fit ">
                          <Image
                            className=" rounded-full"
                            height={40}
                            width={40}
                            src={toukir}
                            alt=""
                          />
                          <div>
                            <p className="font-medium">
                              {data.post.user?.name}
                            </p>
                            <p className="text-sm text-green-500">
                              {dayjs(data.post.createdAt).fromNow()}
                            </p>
                          </div>
                        </button>
                        <div className="pl-4">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: data.post.description || "",
                            }}
                          ></div>
                        </div>
                        <div className="flex w-[90%] mx-auto justify-center pt-4 pb-8">
                          <LightGalleryImageView images={images} />
                        </div>
                      </div>
                      <div className="flex justify-between mt-4 px-16 pb-4">
                        <button
                          onClick={() => {
                            handlePostUpvote(data.votes?._id, data?._id);
                          }}
                          className={` ${upvoteStatus ? "text-green-500" : "hover:text-gray-400"}  flex items-center  transition duration-150`}
                        >
                          <FaUpLong className={`text-[20px] `} />
                          <p>
                            {data.votes.upvote?.length
                              ? data.votes.upvote?.length
                              : 0}
                          </p>
                        </button>
                        <button
                          onClick={() => {
                            handlePostDownvote(data.votes?._id, data?._id);
                          }}
                          className={` ${downvoteStatus ? "text-green-500" : "hover:text-gray-400"}  flex items-center  transition duration-150`}
                        >
                          <FaDownLong className={`text-[20px]`} />
                          <p>
                            {data.votes?.downvote?.length
                              ? data.votes?.downvote?.length
                              : 0}
                          </p>
                        </button>
                        <button
                          onClick={() => {
                            setPostId(data?._id);
                            setIsOpenComment(false);
                            setOpenSharedComment(true);
                          }}
                          className="flex items-center gap-1 hover:text-gray-400 transition duration-150"
                        >
                          <FaComment className="text-txt-200" />
                          <p>
                            {data?.comments?.length
                              ? data?.comments?.length
                              : 0}
                          </p>
                        </button>
                        <Button
                          onClick={() => setPostId(data._id)}
                          onPress={onOpen}
                          className="flex bg-black items-center gap-1 hover:text-gray-400 transition duration-150"
                        >
                          <IoIosShareAlt className="text-2xl text-txt-200" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
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
