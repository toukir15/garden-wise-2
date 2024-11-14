import { items } from "@/src/const";
import { Dropdown, DropdownItem, DropdownMenu } from "@nextui-org/react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import LightGalleryImageView from "./LightGalleryImageView";
import { FaDownLong, FaUpLong } from "react-icons/fa6";
import { FaComment } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import verified from "../../../public/verified.png";
import relativeTime from "dayjs/plugin/relativeTime";
import { LuDot } from "react-icons/lu";
import dayjs from "dayjs";
import {
  IUserProviderValues,
  UserContext,
} from "@/src/context/user.provider";
import Link from "next/link";
import { formatPostTime } from "@/src/utils/formatPostTime";
dayjs.extend(relativeTime);

export default function Post({
  data,
  navbarRef,
  toggleDropdown,
  setPostId,
  isDropdownOpen,
  postId,
  handlePostDelete,
  setEditPostDescription,
  editOnOpen,
  images,
  upvoteStatus,
  handlePostUpvote,
  handlePostDownvote,
  downvoteStatus,
  setOpenSharedComment,
  setIsOpenComment,
  onOpen,
}: any) {
  const [isClient, setIsClient] = useState(false);
  const {user} = useContext(UserContext) as IUserProviderValues
  const checkPostUser = user?._id == data?.post.user._id;
  const [isReadMore, setIsReadMore] = useState(false); // Add Read More state

  const { setPostUser } = useContext(UserContext) as IUserProviderValues;
  const handlePostUser = (postUser: any) => {
    setPostUser(postUser);
    localStorage.setItem("user-profile", JSON.stringify(postUser));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="my-4 shadow-md border-b border-gray-600" ref={navbarRef}>
      <div className="flex justify-between">
        <Link
          onClick={() => handlePostUser(data?.post.user)}
          href={`${checkPostUser ? "/profile/my-profile" : "/profile/user-profile"}`}
          className="flex gap-2 items-center p-2 cursor-pointer w-fit"
        >
          <Image
            className="rounded-full"
            height={45}
            width={45}
            src={data?.post.user.profilePhoto}
            alt="User Avatar"
          />
          <div className="text-start">
            <div className="flex items-center">
              <p className="font-medium">{data.post.user?.name}</p>
              {data.post.user?.isVerified && (
                <Image
                  src={verified}
                  height={15}
                  width={15}
                  className="mx-1"
                  alt="Profile"
                />
              )}
              {data.post.isPremium && (
                <p className={`text-sm text-gray-500 ${!data.post.user?.isVerified && "ml-2 top-[2px] relative"}`}>
                  Premium
                </p>
              )}
              <LuDot />
              <p className="text-xs text-gray-400">
                {formatPostTime(data?.createdAt)}
              </p>
            </div>
            <p className="text-sm text-green-500">{data.post.category}</p>
          </div>
        </Link>
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
          {isDropdownOpen && postId === data?._id && (
            <div className="rounded bg-white shadow-sm z-50 w-40 absolute flex flex-col -left-[170px]">
              <Dropdown>
                <DropdownMenu
                  aria-label="Dynamic Actions"
                  items={items.filter(
                    (item) =>
                      user?._id === data.post.user._id ||
                      (item.key !== "delete" && item.key !== "edit")
                  )}
                >
                  {(item) => (
                    <DropdownItem
                      onClick={() => {
                        if (
                          item.key === "delete" &&
                          user?._id === data.post.user._id
                        ) {
                          handlePostDelete(postId);
                        }
                        if (
                          item.key === "edit" &&
                          user?._id === data.post.user._id
                        ) {
                          editOnOpen();
                          setEditPostDescription(data.post.description);
                          setPostId(data._id);
                        }
                      }}
                      key={item.key}
                      color={item.key === "delete" ? "danger" : "default"}
                      className={item.key === "delete" ? "text-danger" : ""}
                    >
                      {item.label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </div>
      </div>

      {/* Post description with Read More/Show Less functionality */}
      <div className="mx-4 list-disc prose text-gray-200 break-words">
        {data.post.description.length > 500 && !isReadMore ? (
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: data.post.description.slice(0, 500),
              }}
            ></div>
            <button onClick={() => setIsReadMore(true)} className="text-gray-500">
              Read more...
            </button>
          </div>
        ) : (
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: data.post.description,
              }}
            ></div>
            {data.post.description.length > 500 && (
              <button onClick={() => setIsReadMore(false)} className="text-gray-500">
                Show less
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-[80%] mx-auto">
        <div className="flex justify-center pt-4 pb-2">
          <LightGalleryImageView images={images} />
        </div>

        <div className="flex justify-between mt-4 px-4 pb-4">
          <button
            onClick={() => handlePostUpvote(data.post.votes?._id, data?._id)}
            className={`${upvoteStatus ? "text-green-500" : "hover:text-gray-400"} flex items-center transition duration-150`}
          >
            <FaUpLong className="text-[20px]" />
            <p>{data.post?.votes?.upvote?.length || 0}</p>
          </button>
          <button
            onClick={() => handlePostDownvote(data.post.votes?._id, data?._id)}
            className={`${downvoteStatus ? "text-green-500" : "hover:text-gray-400"} flex items-center transition duration-150`}
          >
            <FaDownLong className="text-[20px]" />
            <p>{data.post?.votes?.downvote?.length || 0}</p>
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
            <p>{data.post?.comments?.length || 0}</p>
          </button>
          <button
            onClick={() => {
              onOpen();
              setPostId(data._id);
            }}
            className="flex bg-black items-center gap-1 hover:text-gray-400 transition duration-150"
          >
            <IoIosShareAlt className="text-2xl text-txt-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
