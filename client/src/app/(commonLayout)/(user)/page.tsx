import PostFilter from "@/src/components/shared/PostFilter";
import ViewPost from "@/src/components/shared/ViewPosts";
import "react-quill/dist/quill.snow.css";
import MobileMenu from "@/src/components/MobileMenu";
import CreatePost from "@/src/components/shared/PostComponents/CreatePost";

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
