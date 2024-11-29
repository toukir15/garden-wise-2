"use client";
import { useContext, useRef } from "react";
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

export default function ViewPost() {
  // Refs
  const navbarRef = useRef<HTMLDivElement>(null);
  // Local state
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { postId, isOpenComment, isOpenSharedComment, queryTerm, searchTerm } =
    postStates;

  // Hook
  const { user } = useContext(UserContext) as IUserProviderValues;

  const userId = user!?._id;

  // Get posts hook
  const { data: postsData, isLoading: isPostsDataLoading } = useGetPosts({
    queryTerm,
    searchTerm,
  });

  return (
    <div>
      {/* NO DATA AVAILABLE MESSAGE */}
      {postsData?.data?.data?.length < 1 && (
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
        {postsData?.data?.data?.map((data: TPost, key: number) => {
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

        {/* Modals */}
        <SharePostModal />

        <EditPostModal />

        {(isOpenComment || isOpenSharedComment) && <ViewComment />}
      </div>
    </div>
  );
}
