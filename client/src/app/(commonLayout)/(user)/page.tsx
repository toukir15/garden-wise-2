import CreatePost from "@/src/components/user/CreatePost";
import PostFilter from "@/src/components/user/PostFilter";
import ViewPost from "@/src/components/user/ViewPosts";
import { GoHomeFill, GoSearch } from "react-icons/go";
import "react-quill/dist/quill.snow.css";
import { BiMessageSquareDetail } from "react-icons/bi";
import { RiNotification4Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import MobileMenu from "@/src/components/user/MobileMenu";

export default function Home() {
  return (
    <section className="flex flex-col h-[calc(100vh-2px)] post_scroll overflow-y-scroll  ">
      <PostFilter />
      <CreatePost />
      <ViewPost />
      <MobileMenu/>
    </section>
  );
}
