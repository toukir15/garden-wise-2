"use client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import { useGetFollowSuggetionUsers } from "@/src/hooks/user.hook";
import { IUser } from "../../../types";
import { Input, Spinner } from "@nextui-org/react";
import { useFollowUser } from "@/src/hooks/connection.hook";
import { BsThreeDots } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import { PostContext } from "@/src/context/post.provider";

export default function FollowRequest() {
  const { data: followSuggetionUsersData, isLoading } =
    useGetFollowSuggetionUsers();
  const { mutate: handleFollow } = useFollowUser();

  // State to keep track of the currently loading follow request user
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const { setSearchTerm } = useContext(PostContext);

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

  // Function to handle the Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      setSearchTerm(target.value);
    }
  };

  const handleClear = () => {
    setSearchTerm("")
  }

  return (
    <div className="hidden xl:block">
      <div>
        <Input
          onKeyDown={handleKeyDown}
          isClearable
          radius="full"
          onClear={handleClear}
          placeholder="Type to search post..."
          startContent={
            <IoSearchSharp
              size={20}
              className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0"
            />
          }
        />
      </div>

      <div className="border-[0.5px] rounded-xl border-gray-700 pt-4 mt-4">
        <p className="px-2 border-b font-medium border-gray-700 pb-3">
          Suggested for you
        </p>
        {isLoading && (
          <div className="flex justify-center">
            <div className="absolute top-40 h-fit">
              <Spinner color="success"></Spinner>
            </div>
          </div>
        )}
        <div>
          <div className="h-[calc(100vh-150px)] overflow-y-auto follow_box">
            {followSuggetionUsersData?.data.data.map((user: IUser) => (
              <div
                key={user._id}
                className="py-3 border-b hover:bg-[#080808] transition duration-150 border-gray-900"
              >
                <div className="flex gap-2 px-2 items-center">
                <div>
                    <div className="relative h-8 w-8">
                    <Image
                      src={user.profilePhoto}
                      alt="profile photo"
                      layout="fill"
                      className="rounded-full object-cover"
                    />
                  </div>
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
      </div>
    </div>
  );
}
