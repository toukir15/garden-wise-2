"use client";
import { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "lightgallery/css/lightgallery.css";
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
import { useGetBookmarks } from "@/src/hooks/bookmark.hook";
import NoResults from "./NoResult";
import ProfilePostLoading from "../loading/ProfilePostLoading";

export default function ViewBookmark() {
  // Refs
  const navbarRef = useRef<HTMLDivElement>(null);

  // Hook
  const { user } = useContext(UserContext) as IUserProviderValues;
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { isOpenComment, isOpenSharedComment } = postStates;

  const userId = user!?._id;

  // Get posts hook
  const { data: postsData, isLoading: isPostsDataLoading } = useGetBookmarks();

  return (
    <div>
      {/* NO DATA AVAILABLE MESSAGE */}
      {postsData?.data?.data?.posts.length < 1 && (
        <NoResults
          message="No posts available."
          description=" It looks like there are no Bookmark posts right now. Please check back
                later!"
          height="h-[calc(100vh-400px)]"
        />
      )}

      {/* POSTS LOADING... */}
      {isPostsDataLoading && (
        <ProfilePostLoading height="min-h-[calc(100vh-400px)]" />
      )}

      {/* Render Posts */}
      <div>
        {postsData?.data?.data?.posts.map((data: TPost, key: number) => {
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
              {/* Render Post or SharedPost depending on data */}
              {!data.isShared ? (
                <Post
                  {...{
                    data,
                    navbarRef,
                    upvoteStatus,
                    downvoteStatus,
                  }}
                />
              ) : (
                <SharedPost
                  {...{
                    data,
                    upvoteStatus,
                    images,
                    downvoteStatus,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Modals */}
        <SharePostModal />

        <EditPostModal />

        {(isOpenComment || isOpenSharedComment) && <ViewComment />}
      </div>
    </div>
  );
}
