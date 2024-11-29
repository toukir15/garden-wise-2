"use client";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import React, { useContext } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MobileSearchBar from "../MobileSearchBar";

export default function PostFilter() {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { queryTerm, setQueryTerm, isSearchbarOpen } = postStates;
  const router = useRouter();

  const { user } = useContext(UserContext) as IUserProviderValues;
  const handleVerifyPosts = () => {
    if (!user?.isVerified) {
      toast.warning("Verify user to access premium content!", {
        duration: 2000,
      });
      router.push(`/profile/${user!._id}`);
      return;
    }
    setQueryTerm("premium");
  };

  return (
    <div className="px-4 xl:px-16 sticky top-0 border-b-[0.5px] z-[50] border-gray-600 bg-black/30 backdrop-blur-md shadow-lg rounded-lg">
      <MobileSearchBar />

      <div className=" flex justify-between">
        <button
          onClick={() => setQueryTerm("recent")}
          className={` ${queryTerm === "recent" ? "font-medium text-white border-b-[3px] border-green-600" : "text-[#71767B]"}  transition duration-200 py-2.5 hover:text-white hover:font-medium `}
        >
          Recent
        </button>
        <button
          onClick={() => setQueryTerm("popular")}
          className={` ${queryTerm === "popular" ? "font-medium text-white border-b-[3px] border-green-600" : "text-[#71767B]"}  transition duration-200 py-2.5 hover:text-white hover:font-medium `}
        >
          Most Popular
        </button>
        <button
          onClick={handleVerifyPosts}
          className={` ${queryTerm === "premium" ? "font-medium text-white border-b-[3px] border-green-600" : "text-[#71767B]"}  transition duration-200 py-2.5 hover:text-white hover:font-medium `}
        >
          Premium
        </button>
      </div>
    </div>
  );
}
