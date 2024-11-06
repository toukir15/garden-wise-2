import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
} from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import toukir from "../../../public/toukir.jpg";
import { items } from "@/src/const";
import dayjs from "dayjs";
import { FaDownLong, FaUpLong } from "react-icons/fa6";
import LightGalleryImageView from "./LightGalleryImageView";
import { IoIosShareAlt } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function SharedPost({
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
}: any) {
  return (
    <div key={data._id} className="mt-4 shadow-md border-b border-gray-600">
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
                <p className="font-medium">{data.sharedUser?.name}</p>
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
                                setEditPostDescription(data.description);
                                setPostId(data._id);
                              }
                            }}
                            key={item.key}
                            color={item.key === "delete" ? "danger" : "default"}
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
                <p className="font-medium">{data.post.user?.name}</p>
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
              <p>{data.votes.upvote?.length ? data.votes.upvote?.length : 0}</p>
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
              <p>{data?.comments?.length ? data?.comments?.length : 0}</p>
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
  );
}
