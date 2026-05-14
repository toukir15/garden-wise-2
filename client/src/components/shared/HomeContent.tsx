"use client";
import { useContext } from "react";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import PostFilter from "./PostFilter";
import CreatePost from "./PostComponents/CreatePost";
import ViewPost from "./ViewPosts";
import ExploreView from "./ExploreView";

export default function HomeContent() {
  const { postStates } = useContext(PostContext) as IPostProviderValues;

  if (postStates.isSearchbarOpen) {
    return <ExploreView />;
  }

  return (
    <section className="flex flex-col min-h-screen">
      <PostFilter />
      <CreatePost />
      <ViewPost />
    </section>
  );
}
