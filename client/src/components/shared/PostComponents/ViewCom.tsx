"use client";
import React, { useContext } from "react";
import { IoClose } from "react-icons/io5";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { PostContext } from "@/src/context/post.provider";
import CommentEditForm from "./CommentEditForm";
dayjs.extend(relativeTime);

export default function ViewCom({
  postId,
  setIsOpenComment,
  setOpenSharedComment,
}: {
  postId: string;
  setIsOpenComment: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSharedComment: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { editComment } = useContext(PostContext);
  return (
    <button
      onClick={() => {
        setIsOpenComment(false);
        setOpenSharedComment(false);
      }}
      className="fixed top-0 left-0 w-screen h-screen bg-[#000000ba] z-50 "
    >
      <button
        onClick={(e) => e.stopPropagation()}
        className="w-[95%] md:w-[600px] lg:w-[660px] bg-[#121212] rounded-md absolute right-[51%] translate-x-1/2 top-[18%] md:top-[12%] cursor-default flex flex-col justify-between "
      >
        {/* hade and body  */}
        <div className="w-full">
          <div className="relative flex justify-center items-center py-3 px-2 border-b border-gray-600">
            <h3 className="text-xl">Comments</h3>
            <button
              type="button"
              className=" text-2xl absolute top-[10px] right-2 hover:bg-[#2d2a2a] p-1 rounded-full transition duration-150"
              onClick={() => {
                setIsOpenComment(false);
                setOpenSharedComment(false);
              }}
            >
              <IoClose />
            </button>
          </div>
          <div className="px-3">
            <Comment postId={postId} />
          </div>
          <div>
            {!editComment && <CommentForm postId={postId} />}
            {editComment && <CommentEditForm postId={postId} />}
          </div>
        </div>
      </button>
    </button>
  );
}