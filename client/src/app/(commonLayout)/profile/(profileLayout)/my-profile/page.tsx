"use client";

import { PostContext } from "@/src/context/post.provider";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { useCreatePayment } from "@/src/hooks/payment.hook";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { logout } from "@/src/services/auth";
import verified from "../../../../../../public/verified.png";
import { useGetMyPosts } from "@/src/hooks/post.hook";
import {
  useGetFollowers,
  useGetFollowings,
  useUnfollowUser,
} from "@/src/hooks/connection.hook";
import FollowFollowingListModal from "@/src/components/modal/FollowFollowingListModal";
import { useDisclosure } from "@nextui-org/modal";
import Loading from "@/src/components/loading/Loading";
import { IUser } from "../../../../../../types";
import CreatePost from "@/src/components/shared/PostComponents/CreatePost";
import ViewMyPost from "@/src/components/shared/ViewMyPosts";
import { MdOutlineLocationOn } from "react-icons/md";

export default function Page() {
  const { user } = useContext(UserContext) as IUserProviderValues;
  const { postCount } = useContext(PostContext);
  const {
    mutate: handlePayment,
    data,
    isLoading: isPaymentLoading,
  } = useCreatePayment();
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

  const handleProfileVerify = () => {
    if (postCount < 1) {
      toast.warning("To verify, the user needs at least 1 upvote", {
        duration: 2000,
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
    localStorage.removeItem("user");
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

  return (
    <>
      <section className="flex flex-col">
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
              <div className={`relative w-fit flex items-center ${showVerifyButton ? "gap-4":"gap-2"} mt-4`}>
                <p className="mt-1 text-[20px] xl:text-[24px] font-bold">{user?.name}</p>
                {user?.isVerified && (
                <div className="flex relative top-[2] w-fit h-fit items-center gap-1 border px-2 hover:bg-gray-900 transition duration-150 rounded-full">
                <Image
                 src={verified}
                 height={15}
                 width={15}
                 className=""
                 alt="Profile"
               />
               <p className="text-sm font-bold">Verified</p>
              </div>
                )}

              {showVerifyButton && (
                 <button  onClick={handleProfileVerify} className="flex relative top-[2] w-fit h-fit items-center gap-1 border px-4 hover:bg-gray-900 transition duration-150 rounded-full">
                   <Image
                    src={verified}
                    height={15}
                    width={15}
                    className=""
                    alt="Profile"
                  />
                  <p className="text-sm font-bold">Get verified</p>
                 </button>
                )}
              </div>
              <p className="font-medium text-sm text-gray-500">{user?.email}</p>
              <div className="flex items-center mt-2 gap-1 text-gray-500">
              <MdOutlineLocationOn />
              <p className="font-medium text-sm">Babugonj, Barisal</p>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={onFollowersOpen}
                  className="text-gray-500 text-sm hover:border-b hover:border-b-white border-b border-b-black"
                >
                  <span className="text-white">
                    {followersUsersData?.data.data.followers.length || 0}
                  </span>{" "}
                  Followers
                </button>
                <button
                  onClick={onOpen}
                  className="text-gray-500 text-sm hover:border-b hover:border-b-white border-b border-b-black"
                >
                  <span className="text-white">
                    {followingsUsersData?.data.data.followings.length || 0}
                  </span>{" "}
                  Following
                </button>
              </div>
            </div>
            <div className="xl:mt-auto flex gap-3 mt-2">
              <Link href="/profile/edit-profile" className="w-full" passHref>
                <Button
                  as="a"
                  color="success"
                  className="w-full"
                  variant="faded"
                >
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
        actionType={true}
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
