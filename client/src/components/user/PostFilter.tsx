"use client";
import { PostContext } from "@/src/context/post.provider";
import React, { useContext } from "react";

export default function PostFilter() {
  const { queryTerm, setQueryTerm } = useContext(PostContext);
  return (
    <div className=" flex justify-between px-16 sticky top-0 border-b-[0.5px] z-[999] border-gray-600 bg-black/30 backdrop-blur-md shadow-lg rounded-lg">
      <button
        onClick={() => setQueryTerm("recent")}
        className={` ${queryTerm === "recent" ? "font-medium text-white border-b-[3px] border-green-600" : "text-[#71767B]"}  transition duration-150 py-2.5 `}
      >
        Recent
      </button>
      <button
        onClick={() => setQueryTerm("popular")}
        className={` ${queryTerm === "popular" ? "font-medium text-white border-b-[3px] border-green-600" : "text-[#71767B]"}  transition duration-150 py-2.5 `}
      >
        Most Popular
      </button>
      <button
        onClick={() => setQueryTerm("premium")}
        className={` ${queryTerm === "premium" ? "font-medium text-white border-b-[3px] border-green-600" : "text-[#71767B]"}  transition duration-150 py-2.5 `}
      >
        Premium
      </button>
    </div>
  );
}
