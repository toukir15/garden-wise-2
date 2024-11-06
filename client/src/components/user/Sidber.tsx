"use client";
import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
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
import { MdMessage, MdOutlineDiamond } from "react-icons/md";
import { CiBookmark, CiUser } from "react-icons/ci";
import { HiOutlineUserGroup } from "react-icons/hi";
import FollowFollowingListModal from "../modal/FollowFollowingListModal";
import SidebarButton from "./SidebarButton";
import PostModal from "../modal/PostModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { PostContext } from "@/src/context/post.provider";
import { useCreatePost } from "@/src/hooks/post.hook";

export default function Sidebar() {
  const { user } = useUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isPostOpen,
    onOpen: postOnOpen,
    onClose: postOnClose,
  } = useDisclosure();
  const [description, setDescription] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { queryTerm, searchTerm } = useContext(PostContext);
  const [files, setFiles] = useState<File[]>([]);
  const {
    isOpen: isFollowersOpen,
    onOpen: onFollowersOpen,
    onOpenChange: onFollowersOpenChange,
  } = useDisclosure();

  const [isClient, setIsClient] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // Fetch post mutation
  const { mutate: handleCreatePost, isLoading } = useCreatePost({
    queryTerm,
    searchTerm,
  });

  // Ensure this component only renders on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ ...data, description }));
    files.forEach((file) => {
      formData.append("file", file);
    });
    handleCreatePost(formData);
    postOnClose();
  };

  // Handle file changes and set preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const newPreviews = newFiles.map((file) => {
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviews).then((previews) => {
      setFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...previews]);
    });
  };

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

  // Render the component only on the client side
  if (!isClient) return null;

  return (
    <>
      <div className="flex flex-col h-screen justify-between p-4">
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
              onClick={onOpen}
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
            <SidebarButton href="/profile" icon={CiUser} label="Profile" />

            <Button
              onClick={postOnOpen}
              className="sidebar-button w-full text-lg font-medium p-4 mt-6"
              variant="solid"
              color="success"
              radius="full"
            >
              Post
            </Button>
          </div>
        </div>
        <div className="mb-3">
          <div className="p-3 rounded-lg">
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

      <PostModal
        isOpen={isPostOpen}
        onOpen={postOnOpen}
        onClose={postOnClose}
        handleSubmit={handleSubmit}
        register={register}
        onSubmit={onSubmit}
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