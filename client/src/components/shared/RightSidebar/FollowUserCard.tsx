import React from "react";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { IUser } from "../../../../types";
import { useRouter } from "next/navigation";

interface FollowUserCardProps {
  user: IUser;
  isLoading: boolean;
  onFollow: (user: Partial<IUser>) => void;
}

export default function FollowUserCard({
  user,
  isLoading,
  onFollow,
}: FollowUserCardProps) {
  const router = useRouter();

  const handlePostUser = (postUser: any) => {
    localStorage.setItem("user-profile", JSON.stringify(postUser));
    router.push(`/profile/${postUser._id}`);
  };

  return (
    <div
      onClick={() => handlePostUser(user)}
      className="py-3 border-b cursor-pointer hover:bg-[#080808] transition duration-150 border-gray-900"
    >
      <div className="flex gap-2 px-2 items-center">
        {/* Profile Photo */}
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

        {/* User Info and Follow Button */}
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="text-sm text-gray-200 font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">Suggested for you</p>
          </div>

          {isLoading ? (
            <button
              onClick={(e) => e.stopPropagation()} // Prevent navigation
              className="bg-green-600 hover:bg-green-500 transition duration-150 px-6 text-white text-xs py-[3px] rounded-full"
            >
              <BsThreeDots />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollow(user);
              }}
              className="bg-green-600 hover:bg-green-500 transition duration-150 text-white text-xs py-[3px] px-3 rounded-full"
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
