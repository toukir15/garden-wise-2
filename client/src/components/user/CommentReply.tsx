import { useDownvote, useUpvote } from "@/src/hooks/comment.hook";
import Image from "next/image";
import React from "react";
import { FaDownLong, FaUpLong } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import toukir from "../../../public/toukir.jpg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUser } from "@/src/context/user.provider";
import { formatRelativeTime } from "@/src/utils/formatRelativeTime";
dayjs.extend(relativeTime);

export default function CommentReply({
  replies,
  postId,
  commentId,
  openCommentReplyID,
  setOpenCommentReplyID,
  openCommentNestedReplyID,
  setCommentNestedReplyID,
}: {
  replies: any;
  postId: string;
  commentId: string;
  openCommentReplyID: string;
  setOpenCommentReplyID: React.Dispatch<React.SetStateAction<string>>;
  openCommentNestedReplyID: string;
  setCommentNestedReplyID: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { user } = useUser();
  const userId = user!?._id;
  const { mutate: handleUpvote } = useUpvote();
  const { mutate: handleDownvote } = useDownvote();

  const handleCommnetUpvote = (
    voteId: string,
    postId: string,
    commentId: string,
    replyId?: string
  ) => {
    handleUpvote({ voteId, postId, userId, commentId, replyId });
  };
  const handleCommnetDownvote = (
    voteId: string,
    postId: string,
    commentId: string,
    replyId?: string
  ) => {
    handleDownvote({ voteId, postId, userId, commentId, replyId });
  };
  return (
    <div className="ml-7">
      {replies.map((reply: any) => {
        const checkCommentReplyUpvoteStatus =
          reply.votes.upvote.includes(userId);
        const checkCommentReplyDownStatus =
          reply.votes.downvote.includes(userId);
        return (
          <>
            <div key={reply?._id} className="flex mt-2">
              <div className=" pr-2  shrink-0 mt-2">
                <Image
                  className=" rounded-full"
                  height={20}
                  width={20}
                  src={reply.commentReplyUser.profilePhoto}
                  alt=""
                />
              </div>
              <div>
                <div className="bg-[#1d1c1c] py-1 px-2 rounded">
                  <p>
                    <span className="font-semibold  text-sm">
                      {reply.commentReplyUser?.name}
                    </span>
                  </p>
                  <p className="mb-1 text-gray-300 leading-[1.3] text-sm">
                    <span className=" font-medium text-green-500">
                      @{reply.replyTo?.name}
                    </span>{" "}
                    {reply.text}
                  </p>
                </div>
                <div className="flex gap-10 justify-between mt-1 text-sm font-medium text-gray-300 ml-3">
                  <div className="flex gap-5">
                    <span>{formatRelativeTime(dayjs(reply.createdAt))}</span>
                    <button
                      onClick={() => {
                        handleCommnetUpvote(
                          reply.votes?._id,
                          postId,
                          commentId,
                          reply?._id
                        );
                      }}
                    >
                      <button className="flex gap-[2px]">
                        <FaUpLong
                          className={`text-[15px] ${checkCommentReplyUpvoteStatus ? "text-green-500" : ""} `}
                        />
                        <p>{reply.votes.upvote.length}</p>
                      </button>
                    </button>
                    <button
                      onClick={() => {
                        handleCommnetDownvote(
                          reply.votes?._id,
                          postId,
                          commentId,
                          reply?._id
                        );
                      }}
                    >
                      <div className="flex items-center gap-[2px]">
                        <FaDownLong
                          className={`text-[15px] ${checkCommentReplyDownStatus ? "text-green-500" : ""} `}
                        />
                        <p>{reply.votes.downvote.length}</p>
                      </div>
                    </button>
                    {/* <button
                      onClick={() => {
                        setCommentNestedReplyID(reply?._id);
                        setOpenCommentReplyID(commentId);
                      }}
                    >
                      Reply
                    </button> */}
                  </div>
                  <div className="hiden"></div>
                </div>
              </div>
            </div>
            {/* nested comment reply */}
            {/* {openCommentReplyID === commentId &&
              openCommentNestedReplyID === reply?._id && (
                <form
                  // onSubmit={handleNestedCommentReply}
                  className="flex items-center bg-[#1D1C1C]  w-[60%] relative left-32 top-1 mb-3"
                >
                  <div className="px-2">
                    <Image
                      className=" rounded-full"
                      height={30}
                      width={30}
                      src={toukir}
                      alt=""
                    />
                  </div>
                  <input
                    type="text"
                    id="commentReply"
                    autoFocus
                    className="w-full mt-1 outline-none bg-[#1D1C1C]  py-1 text-sm comment_ploaceholder"
                    placeholder={`Reply to ${reply.replyTo?.name}`}
                  />
                  <button className="text-xl text-green-500 hover:text-green-600  py-[14px] pr-3 pl-4 transition duration-200">
                    <IoSend />
                  </button>
                </form>
              )} */}
          </>
        );
      })}
    </div>
  );
}
