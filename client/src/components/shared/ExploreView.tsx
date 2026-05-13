"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { IoClose, IoSearchSharp } from "react-icons/io5";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import ViewPost from "./ViewPosts";
import PostFilter from "./PostFilter";

export default function ExploreView() {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { searchTerm, setSearchTerm, setIsSearchbarOpen } = postStates;
  const [inputValue, setInputValue] = useState(searchTerm || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setSearchTerm(inputValue.trim());
  };

  const handleClose = () => {
    setSearchTerm("");
    setIsSearchbarOpen(false);
  };

  return (
    <section className="flex flex-col lg:border border-gray-600 min-h-screen">
      {/* Filter tabs — same as home */}
      <PostFilter />

      {/* Search bar — same wrapper & row structure as CreatePost */}
      <div className="w-full border-b border-gray-700 py-5">
        <div className="flex gap-2 items-center px-4">
          {/* Search pill — mirrors the Button p-5 rounded-full in CreatePost */}
          <div className="flex-1 flex items-center gap-3 bg-[#121212] rounded-full px-4 py-2.5 focus-within:ring-1 focus-within:ring-green-500 transition-all">
            <IoSearchSharp className="text-gray-500 text-base shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value === "") setSearchTerm("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search posts…"
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
            {inputValue && (
              <button
                onClick={() => { setInputValue(""); setSearchTerm(""); inputRef.current?.focus(); }}
                className="text-gray-500 hover:text-white transition-colors shrink-0"
              >
                <IoClose />
              </button>
            )}
          </div>
          {/* Close explore */}
          <button
            onClick={handleClose}
            className="shrink-0 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>
      </div>

      {/* Reuse the same ViewPost — it already filters by searchTerm */}
      <ViewPost />
    </section>
  );
}
