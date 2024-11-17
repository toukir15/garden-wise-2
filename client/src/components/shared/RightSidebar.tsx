"use client";
import React, { useContext, useState } from "react";
import { Input, Spinner } from "@nextui-org/react";
import { IoSearchSharp } from "react-icons/io5";
import { PostContext } from "@/src/context/post.provider";
import FollowUserList from "./RightSidebar/FollowUserList";

export default function RightSidebar() {
  const { setSearchTerm } = useContext(PostContext);

  // Function to handle the Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      setSearchTerm(target.value);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="hidden xl:block">
      {/* Search Input */}
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

      {/* Follow User List */}
      <div className="border-[0.5px] rounded-xl border-gray-700 pt-4 mt-4">
        <p className="px-2 border-b font-medium border-gray-700 pb-3">
          Suggested for you
        </p>
        <FollowUserList />
      </div>
    </div>
  );
}
