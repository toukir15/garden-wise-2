"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo from "../../../public/plant.png";
import { GoHomeFill, GoSearch } from "react-icons/go";
import categories from "../../assets/json/category.json";
import {
  useGetFollowers,
  useGetFollowings,
  useUnfollowUser,
} from "@/src/hooks/connection.hook";
import { useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useUser } from "@/src/context/user.provider";
import { IUser } from "../../../types";
import Link from "next/link";
import { IoNotifications, IoPeopleOutline } from "react-icons/io5";
import { MdDashboard, MdMessage, MdOutlineDiamond } from "react-icons/md";
import { CiBookmark, CiUser } from "react-icons/ci";
import { HiOutlineUserGroup } from "react-icons/hi";
import FollowFollowingListModal from "../modal/FollowFollowingListModal";
import SidebarButton from "./SidebarButton";
import PostModal from "../modal/PostModal";
import { useCreatePostForm } from "../hooks/useCreatePostForm";
import Loading from "../Loading";

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
  const { user } = useUser();
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

  const [isClient, setIsClient] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // Ensure this component only renders on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Render the component only on the client side
  if (!isClient) return null;

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex flex-col h-screen justify-between py-4">
        <div>
          <div className="w-8 ml-4">
            <Image
              src={logo}
              width={20}
              height={20}
              alt="logo"
              className="w-16 mb-2"
            />
          </div>

          <div>
            <SidebarButton href="/" icon={GoHomeFill} label="Home" />
            <SidebarButton
              href="/admin/dashboard"
              onClick={() => {}}
              icon={MdDashboard}
              label="Dashboard"
            />
            <SidebarButton onClick={() => {}} icon={GoSearch} label="Explore" />
            <SidebarButton
              onClick={() => {}}
              icon={IoNotifications}
              label="Notification"
            />
            <SidebarButton
              onClick={() => {}}
              icon={MdMessage}
              label="Message"
            />
            <SidebarButton
              onClick={onFollowersOpen}
              icon={IoPeopleOutline}
              label={`Followers (${followersUsersData?.data.data.followers.length || 0})`}
            />
            <SidebarButton
              onClick={onFollowingsOpen}
              icon={IoPeopleOutline}
              label={`Followings (${followingsUsersData?.data.data.followings.length || 0})`}
            />
            <SidebarButton
              onClick={() => {}}
              icon={CiBookmark}
              label="Bookmark"
            />
            <SidebarButton
              onClick={() => {}}
              icon={HiOutlineUserGroup}
              label="Communities"
            />
            <SidebarButton
              onClick={() => {}}
              icon={MdOutlineDiamond}
              label="Premium"
            />
            <SidebarButton href="/profile/my-profile" icon={CiUser} label="Profile" />

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
        <div className="">
          <div className="px-1 rounded-lg">
            <Link href="/profile" className="flex items-center gap-3">
              <div>
                <div className="rounded-full overflow-hidden w-[40px] h-[40px] relative">
                  <Image
                    alt="Profile image"
                    src={
                      user?.profilePhoto ||
                      "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                    }
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
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

      <PostModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        register={register}
        onSubmit={(data) => onSubmit(data, onClose)} 
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
