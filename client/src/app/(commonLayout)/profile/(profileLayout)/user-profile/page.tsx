"use client";

import ViewMyPost from "@/src/components/user/ViewMyPosts";
import { useCreatePayment } from "@/src/hooks/payment.hook";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import verified from "../../../../../../public/verified.png"
import { useGetVisitProfilePosts } from "@/src/hooks/post.hook";
import {
  useGetViewProfileFollowers,
  useGetViewProfileFollowings,
  useUnfollowUser,
} from "@/src/hooks/connection.hook";
import FollowFollowingListModal from "@/src/components/modal/FollowFollowingListModal";
import { useDisclosure } from "@nextui-org/modal";
import Loading from "@/src/components/Loading";
import { IUser } from "../../../../../../types";

export default function Page() {
  const {
    mutate: handlePayment,
    data,
    isLoading: isPaymentLoading,
  } = useCreatePayment();
  const [isClient, setIsClient] = useState(false); // Track client-side rendering
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isFollowersOpen,
    onOpen: onFollowersOpen,
    onOpenChange: onFollowersOpenChange,
  } = useDisclosure();
  const router = useRouter();
  const postUser = JSON.parse(localStorage.getItem("user-profile") || "{}");

  // get post hook
  const {
    data: postsData,
    isLoading: isPostsDataLoading,
    error: postsDataError,
  } = useGetVisitProfilePosts(postUser._id);

  useEffect(() => {
    setIsClient(true); 
  }, []);


  useEffect(() => {
    if (data?.data?.data?.url) {
      router.push(data.data.data.url);
    }
  }, [data, router]);
  
  const { data: followingsUsersData } = useGetViewProfileFollowings(postUser._id);
  const { data: followersUsersData } = useGetViewProfileFollowers(postUser._id);
  const { mutate: handleUnfollow } = useUnfollowUser();


  const handleUnfollowRequest = (user: Partial<IUser>) => {
    if (!user._id) return;
    setLoadingUserId(user._id);
    handleUnfollow(
      { user },
      {
        onSettled: () => {
          setLoadingUserId(null);
        },
      }
    );
  };

  if (isPaymentLoading) {
    return <Loading />;
  }
  if (!isClient) return null;

  return (
    <>
      <section className="flex flex-col">
        <div className="p-4 gap-4 border-b border-gray-600">
          <div className="relative w-[150px] h-[150px]">
            <Image
              src={
                postUser?.profilePhoto ||
                "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              fill
              className="object-cover rounded-full"
              alt="Profile"
            />
          </div>
          <div className="lg:flex justify-between">
            <div>
              <div className="relative w-fit">
                <p className="mt-3 text-2xl font-bold">{postUser?.name}</p>
                 {postUser?.isVerified && <Image
                    src={verified}
                    height={20}
                    width={20}
                    className="absolute top-1.5 -right-2 translate-x-full"
                    alt="Profile"
                  />}
              </div>
              <p className="font-medium text-gray-300">{postUser?.email}</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={onFollowersOpen}
                  className="text-gray-400 hover:border-b hover:border-b-white border-b border-b-black"
                >
                  <span className="text-white">
                    {followersUsersData?.data.data.followers.length || 0}
                  </span>{" "}
                  Followers
                </button>
                <button
                  onClick={onOpen}
                  className="text-gray-400 hover:border-b hover:border-b-white border-b border-b-black"
                >
                  <span className="text-white">
                    {followingsUsersData?.data.data.followings.length || 0}
                  </span>{" "}
                  Following
                </button>
              </div>
            </div>
          </div>
        </div>
        <ViewMyPost
          postsData={postsData}
          isPostsDataLoading={isPostsDataLoading}
        />
      </section>

      {/* Followings Modal */}
      <FollowFollowingListModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Followings"
        users={followingsUsersData?.data.data.followings || []}
        loadingUserId={loadingUserId}
        handleUnfollowRequest={handleUnfollowRequest}
        actionType={false}
      />

      {/* followers modal  */}
      <FollowFollowingListModal
        isOpen={isFollowersOpen}
        onOpenChange={onFollowersOpenChange}
        title="Followers"
        users={followersUsersData?.data.data.followers || []}
        loadingUserId={loadingUserId}
        handleUnfollowRequest={handleUnfollowRequest}
        actionType={false}
      />
    </>
  );
}
