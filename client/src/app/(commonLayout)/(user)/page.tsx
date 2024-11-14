import CreatePost from "@/src/components/user/CreatePost";
import PostFilter from "@/src/components/user/PostFilter";
import ViewPost from "@/src/components/user/ViewPosts";
import "react-quill/dist/quill.snow.css";
import MobileMenu from "@/src/components/user/MobileMenu";

export default function Home() {
  return (
    <section className="flex flex-col border border-gray-600  min-h-screen">
      <PostFilter />
      <CreatePost />
      <ViewPost />
      <MobileMenu />
    </section>
  );
}
