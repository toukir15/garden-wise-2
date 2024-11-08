"use client";

import CreatePost from "@/src/components/user/CreatePost";
import ViewMyPost from "@/src/components/user/ViewMyPosts";
import { PostContext } from "@/src/context/post.provider";
import { useUser } from "@/src/context/user.provider";
import { useCreatePayment } from "@/src/hooks/payment.hook";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import badge from "../../../../../public/medal.png";
import { logout } from "@/src/services/auth";
import { useGetMyPosts } from "@/src/hooks/post.hook";
import {
  useGetFollowers,
  useGetFollowings,
  useUnfollowUser,
} from "@/src/hooks/connection.hook";
import { IUser } from "../../../../../types";
import FollowFollowingListModal from "@/src/components/modal/FollowFollowingListModal";
import { useDisclosure } from "@nextui-org/modal";
import Loading from "@/src/components/Loading";
import MobileMenu from "@/src/components/user/MobileMenu";

export default function Page() {
  const { user } = useUser();
  const { postCount } = useContext(PostContext);
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

  // get post hook
  const {
    data: postsData,
    isLoading: isPostsDataLoading,
    error: postsDataError,
  } = useGetMyPosts();

  useEffect(() => {
    setIsClient(true); // Set true when the component is mounted on the client
  }, []);

  const handleProfileVerify = () => {
    if (postCount < 1) {
      toast.warning("To verify, the user needs at least 1 upvote", {
        duration: 2000,
        position: "top-right",
      });
      return;
    }
    handlePayment();
  };

  const [showVerifyButton, setShowVerifyButton] = useState(false);
  useEffect(() => {
    if (user && !user.isVerified) {
      setShowVerifyButton(true);
    } else {
      setShowVerifyButton(false);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    if (data?.data?.data?.url) {
      router.push(data.data.data.url);
    }
  }, [data, router]);

  const { data: followingsUsersData } = useGetFollowings();
  const { data: followersUsersData } = useGetFollowers();
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

  // Render nothing until client-side rendering is enabled
  if (!isClient) return null;

  return (
    <>
      <section className="flex flex-col h-screen post_scroll overflow-y-scroll">
        <div className="p-4 gap-4 border-b border-gray-600">
          <div className="relative w-[150px] h-[150px]">
            <Image
              src={
                user?.profilePhoto ||
                "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              fill
              className="object-cover rounded-full"
              alt="Profile"
            />
            <Image
              src={badge}
              className="rounded-full absolute right-0 bottom-0"
              height={40}
              width={40}
              alt="Badge"
            />
          </div>
          <div className="lg:flex justify-between">
            <div>
              <p className="mt-3 text-2xl font-bold">{user?.name}</p>
              <p className="font-medium text-gray-300">{user?.email}</p>
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
            <div className="xl:mt-auto flex gap-3 mt-2">
              {showVerifyButton && (
                <Button
                  onClick={handleProfileVerify}
                  color="success"
                  variant="faded"
                >
                  Verify
                </Button>
              )}
              <Link href="/profile/edit-profile" className="w-full" passHref>
                <Button as="a" color="success" className="w-full" variant="faded">
                  Edit Profile
                </Button>
              </Link>
              <Button
                type="button"
                className="w-full"
                onClick={handleLogout}
                color="danger"
                variant="faded"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
        <CreatePost />
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
      />

      {/* followers modal  */}
      <FollowFollowingListModal
        isOpen={isFollowersOpen}
        onOpenChange={onFollowersOpenChange}
        title="Followers"
        users={followersUsersData?.data.data.followers || []}
        loadingUserId={loadingUserId}
        handleUnfollowRequest={handleUnfollowRequest}
      />
    </>
  );
}
