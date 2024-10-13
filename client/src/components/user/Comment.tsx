"use client";
import { useGetPost } from "@/src/hooks/recentPosts.hook";
import Image from "next/image";
import React, { useState } from "react";
import { FaDownLong, FaUpLong } from "react-icons/fa6";
import toukir from "../../../public/toukir.jpg";
import { useDownvote, useUpvote } from "@/src/hooks/comment.hook";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentReply from "./CommentReply";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "@/src/context/user.provider";
import { formatRelativeTime } from "@/src/utils/formatRelativeTime";
dayjs.extend(relativeTime);

export default function Comment({ postId }: { postId: string }) {
  const [openCommentReplyID, setOpenCommentReplyID] = useState<string>("");
  const [openCommentNestedReplyID, setCommentNestedReplyID] =
    useState<string>("");
  const { data: postData, isLoading, error } = useGetPost(postId);
  const { mutate: handleUpvote } = useUpvote();
  const { mutate: handleDownvote } = useDownvote();
  const { user } = useUser();
  const userId = user!?._id;

  const handleCommnetUpvote = (
    voteId: string,
    postId: string,
    commentId: string
  ) => {
    handleUpvote({ voteId, postId, userId, commentId });
  };
  const handleCommnetDownvote = (
    voteId: string,
    postId: string,
    commentId: string
  ) => {
    handleDownvote({ voteId, postId, userId, commentId });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>();

  // const onSubmit: SubmitHandler<FieldValues> = (data) => {
  //   handleCommentReply({
  //     commentId: openCommentReplyID,
  //     text: data.text,
  //     postId: postId,
  //     user: user,
  //   });
  // };
  return (
    <>
      {postData?.data.isShared && (
        <div className="h-[450px] overflow-y-auto comment_scroll">
          {postData?.data.comments.map((comment: any) => {
            const checkCommentUpvoteStatus =
              comment.votes?.upvote.includes(userId);
            const checkCommentDownStatus =
              comment.votes?.downvote.includes(userId);
            return (
              <div key={comment?._id} className="flex my-2">
                <div className=" pr-2  mt-2 shrink-0 ">
                  <Image
                    className=" rounded-full"
                    height={25}
                    width={25}
                    src={toukir}
                    alt="user image"
                  />
                </div>
                <div>
                  <div className=" bg-[#1d1c1c] py-1 px-2 rounded">
                    <p>
                      <span className="font-semibold  text-sm">
                        {comment.user?.name}
                      </span>
                    </p>
                    <p className="mb-1 text-gray-400 leading-[1.3] text-sm">
                      {comment.text}
                    </p>
                  </div>
                  <div className="flex justify-between mt-1 text-sm font-medium text-gray-300 ml-3">
                    <div className="flex gap-5">
                      <span>
                        {formatRelativeTime(dayjs(comment.createdAt))}
                      </span>
                      <button
                        onClick={() => {
                          handleCommnetUpvote(
                            comment.votes?._id,
                            postData.data?._id,
                            comment?._id
                          );
                        }}
                        className={`flex gap-[2px] ${checkCommentUpvoteStatus ? "text-green-500" : ""} `}
                      >
                        <FaUpLong className={`text-[15px]`} />
                        <p>{comment.votes?.upvote.length || 0}</p>
                      </button>
                      <button
                        onClick={() => {
                          handleCommnetDownvote(
                            comment.votes?._id,
                            postData.data?._id,
                            comment?._id
                          );
                        }}
                      >
                        <div className="flex items-center gap-[2px]">
                          <FaDownLong
                            className={`flex gap-[2px] ${checkCommentDownStatus ? "text-green-500" : ""} `}
                          />
                          <p>{comment.votes?.downvote.length || 0}</p>
                        </div>
                      </button>
                    </div>
                    <div className="hiden"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!postData?.data.isShared && (
        <div className="h-[450px] overflow-y-auto comment_scroll">
          {postData?.data.post.comments.map((comment: any) => {
            const checkCommentUpvoteStatus =
              comment.votes.upvote.includes(userId);
            const checkCommentDownStatus =
              comment.votes?.downvote.includes(userId);
            return (
              <div key={comment?._id} className="flex my-2">
                <div className=" pr-2  mt-2 shrink-0 ">
                  <Image
                    className=" rounded-full"
                    height={25}
                    width={25}
                    src={toukir}
                    alt="user image"
                  />
                </div>
                <div>
                  <div className=" bg-[#1d1c1c] py-1 px-2 rounded">
                    <p>
                      <span className="font-semibold  text-sm">
                        {comment.user?.name}
                      </span>
                    </p>
                    <p className="mb-1 text-gray-400 leading-[1.3] text-sm">
                      {comment.text}
                    </p>
                  </div>
                  <div className="flex justify-between mt-1 text-sm font-medium text-gray-300 ml-3">
                    <div className="flex gap-5">
                      <span>
                        {formatRelativeTime(dayjs(comment.createdAt))}
                      </span>
                      <button
                        onClick={() => {
                          handleCommnetUpvote(
                            comment.votes?._id,
                            postData.data?._id,
                            comment?._id
                          );
                        }}
                        className={`flex gap-[2px] ${checkCommentUpvoteStatus ? "text-green-500" : ""} `}
                      >
                        <FaUpLong className={`text-[15px]`} />
                        <p>{comment.votes.upvote.length}</p>
                      </button>
                      <button
                        onClick={() => {
                          handleCommnetDownvote(
                            comment.votes?._id,
                            postData.data?._id,
                            comment?._id
                          );
                        }}
                      >
                        <div className="flex items-center gap-[2px]">
                          <FaDownLong
                            className={`flex gap-[2px] ${checkCommentDownStatus ? "text-green-500" : ""} `}
                          />
                          <p>{comment.votes.downvote.length}</p>
                        </div>
                      </button>
                    </div>
                    <div className="hiden"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
