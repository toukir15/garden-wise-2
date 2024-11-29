"use client";
import { useContext, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "lightgallery/css/lightgallery.css";
import ViewComment from "./PostComponents/ViewComment";
import { checkVoteStatus } from "@/src/utils/checkVoteStatus";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { TPost } from "../../../types";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import SharedPost from "./SharedPost";
import Post from "./Post";
import SharePostModal from "../modal/SharePostModal";
import EditPostModal from "../modal/EditPostModal";
import NoResults from "./NoResult";
import ProfilePostLoading from "../loading/ProfilePostLoading";

export default function ViewVisitUserPosts({
  postsData,
  isPostsDataLoading,
}: any) {
  // ref
  const navbarRef = useRef<HTMLDivElement>(null);

  // hook
  const { user } = useContext(UserContext) as IUserProviderValues;

  // context
  const { postStates } = useContext(PostContext) as IPostProviderValues;

  const { isOpenComment, isOpenSharedComment } = postStates;

  const userId = user!?._id;

  return (
    <>
      {isPostsDataLoading && (
        <ProfilePostLoading height="h-[calc(100vh-308px)]" />
      )}
      {postsData?.data?.data?.length < 1 && (
        <NoResults
          message="No posts available."
          description=" It looks like there are no posts right now. Please check back
                later!"
          height={"h-[calc(100vh-308px)]"}
        />
      )}
      <div
        className={`w-full ${postsData?.data?.data?.length && "min-h-[calc(100vh-308px)]"} `}
      >
        {postsData?.data?.data?.map((data: TPost, key: number) => {
          const images = data.post.images || [];
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
              {!data.isShared && (
                <Post
                  {...{
                    data,
                    navbarRef,
                    upvoteStatus,
                    downvoteStatus,
                  }}
                />
              )}

              {data.isShared && (
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

        {/* share post  */}
        <SharePostModal />

        {/* edit post  */}
        <EditPostModal />

        {(isOpenComment || isOpenSharedComment) && <ViewComment />}
      </div>
    </>
  );
}
