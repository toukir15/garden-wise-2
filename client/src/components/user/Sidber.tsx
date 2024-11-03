"use client";
import Image from "next/image";
import React, { useState } from "react";
import premium from "../../../public/premium.png";
import { logout } from "@/src/services/auth";
import { useRouter } from "next/navigation"; // Correct import for useRouter
import {
  useGetFollowers,
  useGetFollowings,
  useUnfollowUser,
} from "@/src/hooks/connection.hook"; // Assuming there is a hook for followers
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useUser } from "@/src/context/user.provider";
import { IUser } from "../../../types";
import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";
import badge from "../../../public/medal.png";

export default function Sidebar() {
  const router = useRouter();
  const { user } = useUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isFollowersOpen,
    onOpen: onFollowersOpen,
    onOpenChange: onFollowersOpenChange,
  } = useDisclosure();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const { data: followingsUsersData } = useGetFollowings();
  const { data: followersUsersData } = useGetFollowers();

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const { mutate: handleUnfollow } = useUnfollowUser();

  const handleUnfollowRequest = (user: Partial<IUser>) => {
    if (!user._id) return;
    setLoadingUserId(user._id);
    handleUnfollow(
      { user: user },
      {
        onSettled: () => {
          setLoadingUserId(null);
        },
      }
    );
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <div>
          <div className="border-[0.5px] border-gray-600 p-3 rounded-lg">
            <Link className="w-fit" href={"/profile"}>
              <div className="relative w-fit">
                <Image
                  alt="image"
                  className="rounded-full"
                  src={
                    user?.profilePhoto ||
                    "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  height={80}
                  width={80}
                />
                {user?.isVerified && (
                  <Image
                    alt="image"
                    className="rounded-full absolute bottom-0 right-0"
                    src={badge}
                    height={25}
                    width={25}
                  />
                )}
              </div>
              <p className="mt-2">{user?.name}</p>
              <p className="mt-1 text-sm">{user?.email}</p>
            </Link>
          </div>
          <div className="flex flex-col border border-gray-600  mt-4 rounded-lg">
            <button
              onClick={onFollowersOpen} // Trigger followers modal
              className="py-3  text-green-600 border-b hover:bg-[#48484d7f] transition duration-200 border-gray-600 rounded-t-lg rounded-b-none"
            >
              Followers ({followersUsersData?.data.data.followers.length || 0})
            </button>
            <button
              onClick={onOpen} // Trigger followings modal
              className="py-3 text-green-600 rounded-none rounded-b-lg hover:bg-[#48484d7f] transition duration-200 rounded-t-none"
            >
              Followings (
              {followingsUsersData?.data.data.followings.length || 0})
            </button>
          </div>
          {!user?.isVerified && (
            <div className="border-[0.5px] mt-4 border-gray-600 p-3 rounded-lg">
              <Link href={"/profile"}>
                <p className="text-sm text-green-500 font-medium">
                  Unlock premium posts
                </p>
                <div className="flex gap-2 items-center">
                  <Image src={premium} height={16} width={16} alt="premium" />
                  <p className="text-sm mt-1 text-gray-300">Try for $5.00</p>
                </div>
              </Link>
            </div>
          )}
        </div>
        <div className="mb-3">
          <Button
            color="danger"
            variant="faded"
            onClick={handleLogout}
            className="  w-full py-3 mt-4"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Followings Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center gap-1 border-b border-gray-600">
                Followings
              </ModalHeader>
              <ModalBody>
                <div className="h-[400px] overflow-y-scroll scroll_box">
                  {followingsUsersData?.data.data.followings.map(
                    (user: Partial<IUser>) => (
                      <div
                        key={user._id}
                        className="flex justify-between border-b items-center border-gray-600 py-1"
                      >
                        <div className="flex gap-3">
                          <div className="flex justify-center items-center">
                            <Image
                              height={30}
                              width={30}
                              src={user.profilePhoto}
                              alt="profile photo"
                              className="rounded-full"
                            />
                          </div>
                          <div>
                            <p className="text-gray-200">{user.name}</p>
                            <p className="text-sm text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="mr-4">
                          {loadingUserId !== user._id && (
                            <button
                              onClick={() => handleUnfollowRequest(user)}
                              className="bg-green-600 hover:bg-green-500 transition duration-150 text-white text-xs py-[3px] px-3 rounded-full"
                            >
                              Unfollow
                            </button>
                          )}
                          {loadingUserId === user._id && (
                            <button className="bg-green-600 hover:bg-green-500 transition duration-150 px-6 text-white text-xs py-[3px]  rounded-full">
                              <BsThreeDots />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Followers Modal */}
      <Modal isOpen={isFollowersOpen} onOpenChange={onFollowersOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center gap-1 border-b border-gray-600">
                Followers
              </ModalHeader>
              <ModalBody>
                <div className="h-[400px] overflow-y-scroll scroll_box">
                  {followersUsersData?.data.data.followers.map(
                    (user: Partial<IUser>) => (
                      <div
                        key={user._id}
                        className="flex justify-between border-b items-center border-gray-600 py-1"
                      >
                        <div className="flex gap-3">
                          <div className="flex justify-center items-center">
                            <Image
                              height={30}
                              width={30}
                              src={user.profilePhoto}
                              alt="profile photo"
                              className="rounded-full"
                            />
                          </div>
                          <div>
                            <p className="text-gray-200">{user.name}</p>
                            <p className="text-sm text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="mr-4">
                          <button className="text-xs py-1 px-3 rounded-full bg-green-600 hover:bg-green-500 transition duration-200">
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
