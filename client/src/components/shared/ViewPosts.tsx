"use client";
import { useContext, useRef, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "lightgallery/css/lightgallery.css";
import { useGetPosts } from "@/src/hooks/post.hook";
import ViewComment from "./PostComponents/ViewComment";
import { checkVoteStatus } from "@/src/utils/checkVoteStatus";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { TPost } from "../../../types";
import ComponentLoading from "../loading/ComponentLoading";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import SharedPost from "./SharedPost";
import Post from "./Post";
import EditPostModal from "../modal/EditPostModal";
import SharePostModal from "../modal/SharePostModal";
import MobileFollowSugg from "../MobileFollowSugg";
import NoResults from "./NoResult";
import { Spinner } from "@nextui-org/react";

export default function ViewPost() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { postId, isOpenComment, isOpenSharedComment, queryTerm, searchTerm } =
    postStates;

  const { user } = useContext(UserContext) as IUserProviderValues;
  const userId = user!?._id;

  const {
    data: postsData,
    isLoading: isPostsDataLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts({ queryTerm, searchTerm });

  const seenIds = new Set<string>();
  const allPosts: TPost[] = (
    postsData?.pages?.flatMap((page: any) => page?.data?.data ?? []) ?? []
  ).filter((post: TPost) => {
    if (seenIds.has((post as any)._id)) return false;
    seenIds.add((post as any)._id);
    return true;
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div>
      {/* NO DATA AVAILABLE MESSAGE */}
      {!isPostsDataLoading && allPosts.length === 0 && (
        <NoResults
          message="No posts available."
          height="h-[calc(100vh-140px)]"
          description=" It looks like there are no posts right now. Please check back
                later!"
        />
      )}

      {/* MOBILE FOLLOW SUGGESTION */}
      <MobileFollowSugg isPostsDataLoading={isPostsDataLoading} />

      {/* POSTS LOADING... */}
      {isPostsDataLoading && <ComponentLoading />}

      {/* Render Posts */}
      <div>
        {allPosts.map((data: TPost, key: number) => {
          const images = data?.post?.images || [];
          const upvoteStatus = checkVoteStatus(
            data.isShared,
            data,
            userId,
            "upvote"
          );
          const downvoteStatus = checkVoteStatus(
            data.isShared,
            data,
            userId,
            "downvote"
          );
          return (
            <div key={key}>
              {!data.isShared ? (
                <Post
                  {...{
                    data,
                    navbarRef,
                    upvoteStatus,
                    images,
                    downvoteStatus,
                    postId,
                  }}
                />
              ) : (
                <SharedPost
                  {...{
                    data,
                    upvoteStatus,
                    images,
                    downvoteStatus,
                    postId,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4" />

        {/* Fetch next page spinner */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Spinner size="md" color="success" />
          </div>
        )}

        {/* Modals */}
        <SharePostModal />
        <EditPostModal />

        {(isOpenComment || isOpenSharedComment) && <ViewComment />}
      </div>
    </div>
  );
}
