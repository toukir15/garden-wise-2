"use client";
import { PostContext } from "@/src/context/post.provider";
import { useUser } from "@/src/context/user.provider";
import { Input } from "@nextui-org/input";
import Image from "next/image";
import React, { useContext } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";


export default function PostFilter() {
  const { user } = useUser();
  const {isSearchbarOpen} = useContext(PostContext)
  const { queryTerm, setQueryTerm } = useContext(PostContext);
  return (
    <div className="px-4 xl:px-16 sticky top-0 border-b-[0.5px] z-[50] border-gray-600 bg-black/30 backdrop-blur-md shadow-lg rounded-lg">

    <AnimatePresence>
        {isSearchbarOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-3 pb-1 flex items-center gap-3"
          >
            <Image
              src={user?.profilePhoto}
              className="rounded-full h-8 w-8"
              height={30}
              width={30}
              alt="User Profile"
            />
            <Input
              isClearable
              size="sm"
              radius="full"
              placeholder="Type to search post..."
              startContent={
                <IoSearchSharp
                  size={20}
                  className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0"
                />
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className=" flex justify-between">
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
    </div>
  );
}
