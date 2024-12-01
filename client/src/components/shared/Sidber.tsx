"use client";
import Image from "next/image";
import React, { useState, useContext } from "react";
import logo from "../../../public/plant.png";
import categories from "../../assets/json/category.json";
import {
  useGetFollowers,
  useGetFollowings,
  useUnfollowUser,
} from "@/src/hooks/connection.hook";
import { useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { IUser } from "../../../types";
import Link from "next/link";
import FollowFollowingListModal from "../modal/FollowFollowingListModal";
import SidebarButton from "./SidebarButton";
import PostModal from "../modal/PostModal";
import { useCreatePostForm } from "../hooks/useCreatePostForm";
import Loading from "../loading/Loading";
import verified from "../../../public/verified.png";
import { FieldValues } from "react-hook-form";
import { sidebarLinks } from "@/src/const";
import { BsFillPeopleFill } from "react-icons/bs";
import { toast } from "sonner";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { data: followingsUsersData } = useGetFollowings();
  const { data: followersUsersData } = useGetFollowers();
  const { mutate: handleUnfollow } = useUnfollowUser();
  const {
    description,
    setDescription,
    imagePreviews,
    handleFileChange,
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
  } = useCreatePostForm();
  const { user } = useContext(UserContext) as IUserProviderValues;
  const {
    isOpen: isFollowingsOpen,
    onOpen: onFollowingsOpen,
    onOpenChange: onFollowingsOpenChange,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isFollowersOpen,
    onOpen: onFollowersOpen,
    onOpenChange: onFollowersOpenChange,
  } = useDisclosure();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
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
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const router = useRouter();
  const handleVerifyPosts = () => {
    if (!user?.isVerified) {
      toast.warning("Verify user to access premium content!", {
        duration: 2000,
      });
      router.push("/profile/my-profile");
      return;
    }
    postStates.setQueryTerm("premium");
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex flex-col h-screen justify-between py-4">
        <div>
          <Link href={"/"} className="w-8 h-8">
            {logo && (
              <Image
                src={logo}
                alt="logo"
                className="mb-2 w-9 h-9 ml-3"
                priority
              />
            )}
          </Link>

          {/* Navigation Links */}
          <div className="mt-3">
            {sidebarLinks.map(({ href, icon, label, size }, index) => {
              if (label === "Profile") {
                href = href + `/${user?._id}`;
              }

              if (index === 1 && user?.role === "admin") {
                return (
                  <SidebarButton
                    href="/admin/dashboard"
                    icon={BsFillPeopleFill}
                    label="Dashboard"
                    size="10"
                  />
                );
              }

              return (
                <div key={index}>
                  {label === "Premium" ? (
                    <SidebarButton
                      onClick={handleVerifyPosts}
                      href={href}
                      icon={icon}
                      label={label}
                      size={size}
                    />
                  ) : index === 4 ? (
                    <>
                      <SidebarButton
                        onClick={onFollowersOpen}
                        icon={BsFillPeopleFill}
                        label={`Followers (${followersUsersData?.data?.data?.followers?.length || 0})`}
                      />
                      <SidebarButton
                        onClick={onFollowingsOpen}
                        icon={BsFillPeopleFill}
                        label={`Followings (${followingsUsersData?.data?.data?.followings?.length || 0})`}
                      />
                    </>
                  ) : (
                    <SidebarButton
                      href={href}
                      icon={icon}
                      label={label}
                      size={size}
                    />
                  )}
                </div>
              );
            })}

            {/* Post Button */}
            <Button
              onClick={onOpen}
              className="sidebar-button w-full text-lg font-medium p-4 mt-6"
              variant="solid"
              color="success"
              radius="full"
            >
              Post
            </Button>
          </div>
        </div>
        <div>
          <div className="px-1 rounded-lg">
            <Link
              href={`/profile/${user?._id}`}
              className="flex items-center gap-3"
            >
              <div>
                <div className="rounded-full overflow-hidden w-[40px] h-[40px] relative">
                  <Image
                    alt="Profile image"
                    src={user?.profilePhoto || ""}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="relative flex items-center w-fit">
                  <p className="font-medium">
                    {user!?.name?.length > 15
                      ? `${user!?.name.slice(0, 15)}...`
                      : user!?.name}
                  </p>
                  {user?.isVerified && (
                    <Image
                      src={verified}
                      height={15}
                      width={15}
                      className="mx-1"
                      alt="Profile"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {user!?.email?.length > 15
                    ? `${user!?.email.slice(0, 15)}...`
                    : user!?.email}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Followings Modal */}
      <FollowFollowingListModal
        isOpen={isFollowingsOpen}
        onOpenChange={onFollowingsOpenChange}
        title="Followings"
        users={followingsUsersData?.data.data.followings || []}
        loadingUserId={loadingUserId}
        handleUnfollowRequest={handleUnfollowRequest}
        actionType={true}
      />

      {/* Followers Modal */}
      <FollowFollowingListModal
        isOpen={isFollowersOpen}
        onOpenChange={onFollowersOpenChange}
        title="Followers"
        users={followersUsersData?.data.data.followers || []}
        loadingUserId={loadingUserId}
        handleUnfollowRequest={handleUnfollowRequest}
        actionType={false}
      />

      <PostModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        register={register}
        onSubmit={(data: FieldValues) => onSubmit(data)}
        errors={errors}
        categories={categories}
        description={description}
        setDescription={setDescription}
        imagePreviews={imagePreviews}
        handleFileChange={handleFileChange}
      />
    </>
  );
}
