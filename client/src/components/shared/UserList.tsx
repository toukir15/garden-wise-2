import Image from "next/image";
import React from "react";
import { BsThreeDots } from "react-icons/bs";

export default function UserList({
  user,
  loadingUserId,
  handleUnfollowRequest,
  actionType,
}: any) {
  return (
    <div
      key={user._id}
      className="flex justify-between items-center py-1.5 border-b border-gray-600"
    >
      <div className="flex gap-3">
        <div className="flex justify-center items-center">
          <Image
            height={30}
            width={30}
            src={user.profilePhoto}
            alt="profile photo"
            className="rounded-full h-8 w-8"
          />
        </div>
        <div>
          <p className="text-gray-200">{user.name}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>
      {actionType && (
        <div className="mr-4">
          {loadingUserId !== user._id ? (
            <button
              onClick={() => handleUnfollowRequest(user)}
              className="py-[3px] px-4 text-xs rounded-full text-white hover:text-whitre bg-green-600 hover:bg-green-500 transition duration-200"
            >
              Unfollow
            </button>
          ) : (
            <button className="bg-green-600 hover:bg-green-500 transition duration-150 px-9 text-white text-xs py-[4px] rounded-full">
              <BsThreeDots />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
