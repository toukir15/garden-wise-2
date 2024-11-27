"use client";
import { PostContext } from "@/src/context/post.provider";
import Link from "next/link";
import React, { useContext } from "react";
import { AiOutlinePieChart } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { GoHomeFill, GoSearch } from "react-icons/go";
import { IoBookmarkOutline } from "react-icons/io5";
import { IUserProviderValues, UserContext } from "../context/user.provider";

export default function MobileMenu() {
  const { setIsSearchbarOpen, isSearchbarOpen } = useContext(PostContext);
  const { user } = useContext(UserContext) as IUserProviderValues;
  return (
    <div className="xl:hidden flex justify-between px-4 xl:px-16 sticky -bottom-0 py-3 xl:py-0 border-b-[0.5px] xl:border-0 z-[50] border-gray-600 bg-[#19191C] backdrop-blur-md shadow-lg">
      <Link href={"/"} passHref>
        <GoHomeFill className="text-[30px]" />
      </Link>
      <GoSearch
        onClick={() => setIsSearchbarOpen(!isSearchbarOpen)}
        className="text-[30px]"
      />
      <Link href={"/admin/dashboard"}>
        <AiOutlinePieChart className="text-[30px]" />
      </Link>

      <Link href={"/bookmark"}>
        <IoBookmarkOutline className="text-[30px]" />
      </Link>

      <Link href={`/profile/${user?._id}`}>
        <FaRegUser className="text-[27px]" />
      </Link>
    </div>
  );
}
