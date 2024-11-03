import CreatePost from "@/src/components/user/CreatePost";
import PostFilter from "@/src/components/user/PostFilter";
import ViewPost from "@/src/components/user/ViewPosts";
import "react-quill/dist/quill.snow.css";

export default function Home() {
  return (
    <section className="flex flex-col h-[calc(100vh-16px)] post_scroll overflow-y-scroll  ">
      <PostFilter />
      <CreatePost />
      <ViewPost />
    </section>
  );
}
