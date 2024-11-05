"use client"; 

import CreatePost from "@/src/components/user/CreatePost";
import ViewMyPost from "@/src/components/user/ViewMyPosts";
import { PostContext } from "@/src/context/post.provider";
import { useUser } from "@/src/context/user.provider";
import { useCreatePayment } from "@/src/hooks/payment.hook";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import badge from "../../../../public/medal.png";
import { logout } from "@/src/services/auth";
import { useGetMyPosts } from "@/src/hooks/post.hook";

export default function Page() {
  const { user } = useUser();
  const { postCount } = useContext(PostContext);
  const { mutate: handlePayment, data } = useCreatePayment();
  const [isClient, setIsClient] = useState(false); // Track client-side rendering
  const router = useRouter();

  // get post hook
  const {
    data: postsData,
    isLoading: isPostsDataLoading,
    error: postsDataError,
  } = useGetMyPosts();

  useEffect(() => {
    setIsClient(true); // Set true when the component is mounted on the client
  }, []);

  const handleProfileVerify = () => {
    if (postCount < 1) {
      toast.warning("To verify, the user needs at least 1 upvote", {
        duration: 2000,
        position: "top-right",
      });
      return;
    }
    handlePayment();
  };

  const [showVerifyButton, setShowVerifyButton] = useState(false);
  useEffect(() => {
    if (user && !user.isVerified) {
      setShowVerifyButton(true);
    } else {
      setShowVerifyButton(false);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    if (data?.data?.data?.url) {
      router.push(data.data.data.url);
    }
  }, [data, router]);

  // Render nothing until client-side rendering is enabled
  if (!isClient) return null;

  return (
    <section className="flex flex-col h-screen post_scroll overflow-y-scroll">
      <div className="p-4 gap-4 border-b border-gray-600">
        <div className="relative w-[150px] h-[150px]">
          <Image
            src={
              user?.profilePhoto ||
              "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            fill
            className="object-cover rounded-full"
            alt="Profile"
          />
          <Image
            src={badge}
            className="rounded-full absolute right-0 bottom-0"
            height={40}
            width={40}
            alt="Badge"
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
                <span className="text-white">10</span> Following
              </button>
            </div>
          </div>
          <div className="mt-auto flex gap-3">
            {showVerifyButton && (
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
            <Button onClick={handleLogout} color="danger" variant="faded">
              Logout
            </Button>
          </div>
        </div>
      </div>
      <CreatePost />
      <ViewMyPost
        postsData={postsData}
        isPostsDataLoading={isPostsDataLoading}
      />
    </section>
  );
}
