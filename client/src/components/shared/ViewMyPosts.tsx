"use client";
import { useContext, useEffect, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "lightgallery/css/lightgallery.css";
import ViewComment from "../shared/PostComponents/ViewComment";
import { checkVoteStatus } from "@/src/utils/checkVoteStatus";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { TPost } from "../../../types";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import SharedPost from "../shared/SharedPost";
import Post from "../shared/Post";
import SharePostModal from "../modal/SharePostModal";
import EditPostModal from "../modal/EditPostModal";
import ProfilePostLoading from "../loading/ProfilePostLoading";
import NoResults from "./NoResult";
import { useGetMyPosts } from "@/src/hooks/post.hook";
import { Spinner } from "@nextui-org/react";

export default function ViewMyPost() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  const { user } = useContext(UserContext) as IUserProviderValues;
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { setPostCount, isOpenSharedComment, isOpenComment } = postStates;

  const userId = user!?._id;

  const {
    data: postsData,
    isLoading: isPostsDataLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMyPosts();

  const seenIds = new Set<string>();
  const allPosts: TPost[] = (
    postsData?.pages?.flatMap((page: any) => page?.data?.data ?? []) ?? []
  ).filter((post: TPost) => {
    if (seenIds.has((post as any)._id)) return false;
    seenIds.add((post as any)._id);
    return true;
  });

  const upvoteCount = allPosts.reduce((acc: number, post: TPost) => {
    if (post.isShared) acc += post.votes.upvote.length;
    else acc += post.post.votes!.upvote.length;
    return acc;
  }, 0);

  useEffect(() => {
    setPostCount(upvoteCount);
  }, [upvoteCount]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      {isPostsDataLoading && (
        <ProfilePostLoading height="h-[calc(100vh-397px)]" />
      )}
      {!isPostsDataLoading && allPosts.length < 1 && (
        <NoResults
          message="No posts available."
          description="It looks like there are no posts right now. Please check back later!"
          height="h-[calc(100vh-397px)]"
        />
      )}
      <div className={`w-full ${allPosts.length > 0 && "min-h-[calc(100vh-397px)]"}`}>
        {allPosts.map((data: TPost, key: number) => {
          const images = data.post.images || [];
          const upvoteStatus = checkVoteStatus(data.isShared, data, userId, "upvote");
          const downvoteStatus = checkVoteStatus(data.isShared, data, userId, "downvote");
          return (
            <div key={(data as any)._id || key}>
              {!data.isShared && (
                <Post {...{ data, navbarRef, upvoteStatus, downvoteStatus }} />
              )}
              {data.isShared && (
                <SharedPost {...{ data, upvoteStatus, images, downvoteStatus }} />
              )}
            </div>
          );
        })}

        <div ref={sentinelRef} className="h-4" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Spinner size="md" color="success" />
          </div>
        )}

        <SharePostModal />
        <EditPostModal />
        {(isOpenComment || isOpenSharedComment) && <ViewComment />}
      </div>
    </>
  );
}
