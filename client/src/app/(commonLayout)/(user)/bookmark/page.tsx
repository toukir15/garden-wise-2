"use client";

import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import verified from "../../../../../public/verified.png";
import { useDisclosure } from "@nextui-org/modal";
import { useGetFollowers, useGetFollowings } from "@/src/hooks/connection.hook";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { PostContext } from "@/src/context/post.provider";
import { toast } from "sonner";
import { useCreatePayment } from "@/src/hooks/payment.hook";
import { logout } from "@/src/services/auth";
import { useRouter } from "next/navigation";
import CreatePost from "@/src/components/shared/PostComponents/CreatePost";
import ViewMyPost from "@/src/components/shared/ViewMyPosts";
import { useGetBookmarks } from "@/src/hooks/bookmark.hook";
import ViewBookmark from "@/src/components/shared/ViewBookmark";

export default function page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useContext(UserContext) as IUserProviderValues;
  const { postCount } = useContext(PostContext);
  const {
    mutate: handlePayment,
    data,
    isLoading: isPaymentLoading,
  } = useCreatePayment();
  const {
    isOpen: isFollowersOpen,
    onOpen: onFollowersOpen,
    onOpenChange: onFollowersOpenChange,
  } = useDisclosure();

  const router = useRouter();

  const [showVerifyButton, setShowVerifyButton] = useState(false);
  useEffect(() => {
    if (user && !user.isVerified) {
      setShowVerifyButton(true);
    } else {
      setShowVerifyButton(false);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    logout();
    router.push("/login");
  };

  const handleProfileVerify = () => {
    if (postCount < 1) {
      toast.warning("To verify, the user needs at least 1 upvote", {
        duration: 2000,
      });
      return;
    }
    handlePayment();
  };

  const { data: followingsUsersData } = useGetFollowings();
  const { data: followersUsersData } = useGetFollowers();
  const { data: bookmarkData, isLoading: isBookmarkDataLoading } =
    useGetBookmarks();
  return (
    <section className="flex flex-col border border-gray-600">
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
        </div>
        <div className="lg:flex justify-between">
          <div>
            <div className="relative w-fit">
              <p className="mt-3 text-2xl font-bold">{user?.name}</p>
              {user?.isVerified && (
                <Image
                  src={verified}
                  height={20}
                  width={20}
                  className="absolute top-1.5 -right-2 translate-x-full"
                  alt="Profile"
                />
              )}
            </div>
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
                </span>
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
            <Link href="/profile/edit-profile" passHref>
              <Button color="success" className="w-full" variant="faded">
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
      <h2 className="py-4 text-center text-2xl font-medium border-b border-gray-600 sticky top-0 z-[999] bg-black/30 backdrop-blur-md">Bookmark posts</h2>
      <ViewBookmark />
    </section>
  );
}
