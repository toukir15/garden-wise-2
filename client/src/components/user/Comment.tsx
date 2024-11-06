"use client";
import { useGetPost } from "@/src/hooks/recentPosts.hook";
import Image from "next/image";
import React from "react";
import toukir from "../../../public/toukir.jpg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUser } from "@/src/context/user.provider";
import { formatRelativeTime } from "@/src/utils/formatRelativeTime";
import ComponentLoading from "../ComponentLoading";
dayjs.extend(relativeTime);

const CommentItem = ({
  comment,
}: {
  comment: any;
  postData: any;
  userId?: string;
}) => {

  return (
    <div key={comment._id} className="flex my-2">
      <div className="pr-2 mt-2 shrink-0">
        <Image
          className="rounded-full"
          height={25}
          width={25}
          src={comment.user?.profilePhoto || toukir}
          alt="user image"
        />
      </div>
      <div className="relative">
        <div className="bg-[#1d1c1c] text-start py-1 pl-2 pr-14 rounded">
          <p>
            <span className="font-semibold text-green-500 text-sm">
              @{comment.user?.name}
            </span>
          </p>
          <p className="mb-1 text-gray-300 leading-[1.3] text-sm">
            {comment.text}
          </p>
          <span className="absolute text-xs bottom-1 text-gray-500 right-2 ">{formatRelativeTime(dayjs(comment.createdAt))}</span>
        </div>                                                                                
      </div>
    </div>            
  );
};

export default function Comment({ postId }: { postId: string }) {
  const { data: postData, isLoading, error } = useGetPost(postId);
  const { user } = useUser();
  const userId = user?._id;

  if (isLoading) return <div className="h-[450px] flex justify-center items-center"><ComponentLoading/></div>;
  if (error) return <div>Error fetching post data</div>;

  const comments = postData?.data.isShared ? postData?.data.comments : postData?.data.post.comments;

  return (
    <div className="h-[450px] overflow-y-auto comment_scroll">
      {comments?.map((comment: any) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          postData={postData}
          userId={userId}
        />
      ))}
    </div>
  );
}
