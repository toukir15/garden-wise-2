"use client";
import { useGetPost } from "@/src/hooks/recentPosts.hook";
import React, { useContext, useEffect, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import ComponentLoading from "../../loading/ComponentLoading";
import { CommentItem } from "./CommentItem";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import { FaRegCommentDots } from "react-icons/fa";
import { Spinner } from "@nextui-org/spinner";
dayjs.extend(relativeTime);

export default function Comment() {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { postId } = postStates;
  const {
    data: postsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPost(postId);
  const { user } = useContext(UserContext) as IUserProviderValues;
  const userId = user?._id;
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading)
    return (
      <div className="h-[450px] flex justify-center items-center">
        <ComponentLoading />
      </div>
    );

  if (error)
    return (
      <div className="h-[450px] flex flex-col justify-center items-center gap-2 text-gray-500">
        <FaRegCommentDots className="text-3xl" />
        <p className="text-sm">Could not load comments</p>
      </div>
    );

  const comments = postsData?.pages?.flatMap((page: any) =>
    page?.data?.isShared
      ? page?.data?.comments ?? []
      : page?.data?.post?.comments ?? []
  ) ?? [];

  if (!comments.length)
    return (
      <div className="h-[450px] flex flex-col justify-center items-center gap-2 text-gray-500">
        <FaRegCommentDots className="text-3xl" />
        <p className="text-sm">No comments yet. Be the first!</p>
      </div>
    );

  return (
    <div className="h-[calc(100vh-108px)] xl:h-[450px] overflow-y-auto comment_scroll py-1">
      {comments.map((comment: any, index: number) => (
        <div key={comment._id}>
          <CommentItem comment={comment} postId={postId} userId={userId} />
          {index < comments.length - 1 && (
            <div className="mx-4 border-b border-gray-800" />
          )}
        </div>
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-3">
          <Spinner size="sm" color="success" />
        </div>
      )}
    </div>
  );
}
