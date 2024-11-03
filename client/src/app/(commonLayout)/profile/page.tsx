"use client"; // Ensure it's a client-side component

import CreatePost from "@/src/components/user/CreatePost";
import ViewMyPost from "@/src/components/user/ViewMyPosts";
import { PostContext } from "@/src/context/post.provider";
import { useUser } from "@/src/context/user.provider";
import { useCreatePayment } from "@/src/hooks/payment.hook";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Make sure this is correct
import { useContext, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import badge from "../../../../public/medal.png";

export default function page() {
  const { user } = useUser();
  const { postCount } = useContext(PostContext);
  const { mutate: handlePayment, data } = useCreatePayment();

  const handleProfileVerify = () => {
    if (postCount < 1) {
      toast.warning("To verify, the user needs at least 1 upvote", {
        duration: 2000,
        position: "top-right",
      });
      return; // Prevent further execution if there are no posts
    }
    handlePayment(); // Only call this if the condition is met
  };

  const router = useRouter(); // Initialize the router

  useEffect(() => {
    if (data?.data?.data?.url) {
      // Redirect only on the client side
      router.push(data.data.data.url);
    }
  }, [data, router]); // Re-run effect if `data` or `router` changes

  return (
    <section className="flex flex-col h-[calc(100vh-16px)] post_scroll overflow-y-scroll">
      <div className="p-4 gap-4 border-b border-gray-600">
        <div className="relative w-fit">
          <Image
            src={user?.profilePhoto}
            className="rounded-full"
            height={150}
            width={150}
            alt="Profile"
          />
          <Image
            src={badge}
            className="rounded-full absolute right-0 bottom-0"
            height={40}
            width={40}
            alt="Profile"
          />
        </div>
        <div className="flex justify-between">
          <div>
            <p className="mt-3 text-2xl font-bold">{user?.name}</p>
            <p className="font-medium text-gray-300">{user?.email}</p>
            <div className="flex gap-4 mt-2">
              <button className="text-gray-400 hover:border-b hover:border-b-white border-b border-b-black">
                <span className="text-white">10</span> Followers
              </button>
              <button className="text-gray-400 hover:border-b hover:border-b-white border-b border-b-black">
                <span className="text-white">10</span> Followers
              </button>
            </div>
          </div>
          <div className="mt-auto flex gap-3">
            {!user!?.isVerified && (
              <Button
                onClick={handleProfileVerify}
                color="success"
                variant="faded"
              >
                Verify
              </Button>
            )}
            <Link href="/edit-profile">
              <Button color="success" variant="faded">
                Edit Profile
              </Button>
            </Link>
            <Button color="danger" variant="faded">
              Logout
            </Button>
          </div>
        </div>
      </div>
      <CreatePost />
      <ViewMyPost />
    </section>
  );
}
