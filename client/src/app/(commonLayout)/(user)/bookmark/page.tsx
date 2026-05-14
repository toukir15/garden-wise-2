"use client";

import React from "react";
import ViewBookmark from "@/src/components/shared/ViewBookmark";
import { FaRegBookmark } from "react-icons/fa";
import MobileMenu from "@/src/components/MobileMenu";

export default function page() {
  return (
    <section className="flex flex-col min-h-screen">
      <h2 className="xl:py-4 py-3 text-center text-medium xl:text-xl font-medium border-b border-gray-600 sticky top-0 z-[50] bg-black/30 backdrop-blur-md flex justify-center items-center gap-2">
        <FaRegBookmark />
        <span>Bookmark posts</span>
      </h2>
      <ViewBookmark />
      <MobileMenu />
    </section>
  );
}
