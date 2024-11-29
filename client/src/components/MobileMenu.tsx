"use client";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import Link from "next/link";
import React, { useContext } from "react";
import { AiOutlinePieChart } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { GoHomeFill, GoSearch } from "react-icons/go";
import { IoBookmarkOutline } from "react-icons/io5";
import { IUserProviderValues, UserContext } from "../context/user.provider";
import { IoMdNotificationsOutline } from "react-icons/io";

export default function MobileMenu() {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { setIsSearchbarOpen, isSearchbarOpen } = postStates;
  const { user } = useContext(UserContext) as IUserProviderValues;
  return (
    <div className="xl:hidden flex justify-between px-6 xl:px-16 sticky bottom-0  py-3 xl:py-0  border-gray-600 bg-[#19191C] backdrop-blur-md shadow-lg">
      <Link href={"/"} passHref>
        <GoHomeFill className="text-[27px]" />
      </Link>
      <GoSearch
        onClick={() => setIsSearchbarOpen(!isSearchbarOpen)}
        className="text-[27px]"
      />
      {user?.role === "admin" && (
        <Link href={"/admin/dashboard"}>
          <AiOutlinePieChart className="text-[27px]" />
        </Link>
      )}
      {user?.role == "user" && (
        <button>
          <IoMdNotificationsOutline className="text-[28px]" />
        </button>
      )}

      <Link href={"/bookmark"}>
        <IoBookmarkOutline className="text-[26px]" />
      </Link>

      <Link href={`/profile/${user?._id}`}>
        <FaRegUser className="text-[24px]" />
      </Link>
    </div>
  );
}
