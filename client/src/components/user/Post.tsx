import { items } from '@/src/const';
import { Button, Dropdown, DropdownItem, DropdownMenu } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react'
import { HiDotsHorizontal } from 'react-icons/hi';
import LightGalleryImageView from './LightGalleryImageView';
import { FaDownLong, FaUpLong } from 'react-icons/fa6';
import { FaComment } from 'react-icons/fa';
import { IoIosShareAlt } from 'react-icons/io';
import toukir from "../../../public/toukir.jpg";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

export default function Post({data, navbarRef,toggleDropdown,setPostId, isDropdownOpen, postId, handlePostDelete, setEditPostDescription,editOnOpen, images, upvoteStatus,handlePostUpvote, handlePostDownvote, downvoteStatus, setOpenSharedComment, setIsOpenComment, onOpen }) {
  return (
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
  )
}
