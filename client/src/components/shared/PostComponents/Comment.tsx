"use client";
import { useGetPost } from "@/src/hooks/recentPosts.hook";
import React, { useContext } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import ComponentLoading from "../../loading/ComponentLoading";
import { CommentItem } from "./CommentItem";
dayjs.extend(relativeTime);

export default function Comment({ postId }: { postId: string }) {
  const { data: postData, isLoading, error } = useGetPost(postId);
  const {user} = useContext(UserContext) as IUserProviderValues
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
          postId={postId}
          userId={userId}
        />
      ))}
    </div>
  );
}
