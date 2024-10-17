"use client";
import React, { useState } from "react";
import Image from "next/image";
import profile from "../../../public/toukir.jpg";
import { useGetFollowSuggetionUsers } from "@/src/hooks/user.hook";
import { IUser } from "../../../types";
import { Spinner } from "@nextui-org/react";
import { useFollowUser } from "@/src/hooks/connection.hook";
import { BsThreeDots } from "react-icons/bs";

export default function FollowRequest() {
  const { data: followSuggetionUsersData, isLoading } =
    useGetFollowSuggetionUsers();

  // State to keep track of the currently loading follow request user
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const { mutate: handleFollow } = useFollowUser();

  const handleFollowRequest = (user: Partial<IUser>) => {
    if (!user._id) return;
    setLoadingUserId(user._id);
    handleFollow(
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
      <p className="px-2 border-b border-gray-700 pb-3">Suggested for you</p>
      {isLoading && (
        <div className="flex justify-center">
          <div className="absolute top-20 h-fit">
            <Spinner color="success"></Spinner>
          </div>
        </div>
      )}
      <div>
        <div className="h-[calc(100vh-359px)] overflow-y-scroll follow_box">
          {followSuggetionUsersData?.data.data.map((user: IUser) => (
            <div
              key={user._id}
              className="py-3 border-b hover:bg-[#080808] transition duration-150 border-gray-900"
            >
              <div className="flex gap-2 px-2 items-center">
                <div>
                  <Image
                    className="rounded-full"
                    height={40}
                    width={40}
                    src={user?.profilePhoto || profile}
                    alt="profile image"
                  />
                </div>
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-sm text-gray-200 font-medium">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-400">Suggested for you</p>
                  </div>
                  {loadingUserId !== user._id && (
                    <button
                      onClick={() => handleFollowRequest(user)}
                      className="bg-green-600 hover:bg-green-500 transition duration-150 text-white text-xs py-[3px] px-3 rounded-full"
                    >
                      Follow
                    </button>
                  )}
                  {loadingUserId === user._id && (
                    <button className="bg-green-600 hover:bg-green-500 transition duration-150 px-6 text-white text-xs py-[3px]  rounded-full">
                      <BsThreeDots />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
