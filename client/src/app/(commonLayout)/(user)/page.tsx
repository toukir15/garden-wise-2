import CreatePost from "@/src/components/user/CreatePost";
import ViewPost from "@/src/components/user/ViewPosts";
import "react-quill/dist/quill.snow.css";

export default function Home() {
  return (
    <section className="flex flex-col h-[calc(100vh-16px)] post_scroll overflow-y-scroll  ">
      <div className=" flex justify-between px-16 sticky top-0 border-b-[0.5px] z-[999] border-gray-600 bg-black/30 backdrop-blur-md shadow-lg rounded-lg">
        <button className="text-[#71767B] hover:text-white transition duration-150 py-2.5 border-b-[3px] border-green-500">
          Recent
        </button>
        <button className="text-[#71767B] hover:text-white transition duration-150 py-2.5 border-b-[3px] border-green-500">
          Most Popular
        </button>
        <button className="text-[#71767B] hover:text-white transition duration-150 py-2.5 border-b-[3px] border-green-500">
          Premium
        </button>
      </div>

      <CreatePost />
      <ViewPost />
    </section>
  );
}
