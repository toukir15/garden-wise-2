import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import React, { useContext } from "react";
import LightGalleryImageView from "./LightGalleryImageView";
import { HiDotsHorizontal } from "react-icons/hi";
import PostHeader from "./post/PostHeader";
import PostDropdown from "./post/PostDropdown";
import PostDescription from "./post/PostDescription";
import PostActions from "./post/PostActions";

export default function Post(props: any) {
  const { user, setPostUser } = useContext(UserContext) as IUserProviderValues;
  const checkPostUser = user?._id == props.data?.post.user._id;

  const handlePostUser = (postUser: any) => {
    setPostUser(postUser);
    localStorage.setItem("user-profile", JSON.stringify(postUser));
  };

  return (
    <div
      className="my-4 shadow-md border-b border-gray-600"
      ref={props.navbarRef}
    >
      <div className="flex justify-between">
        <PostHeader
          user={user}
          data={props.data}
          handlePostUser={handlePostUser}
          checkPostUser={checkPostUser}
        />
        <div className="relative">
          <button
            onClick={() => props.toggleDropdown()}
            className="mr-8 relative"
          >
            <HiDotsHorizontal className="text-[20px] hover:text-green-500 transition duration-150" />
          </button>
          {props.isDropdownOpen && props.postId === props.data?._id && (
            <PostDropdown {...props} />
          )}
        </div>
      </div>
      <PostDescription description={props.data?.post?.description} />
      <div className="flex w-[90%] mx-auto justify-center pt-4 pb-6">
        <LightGalleryImageView images={props.data.post.images} />
      </div>
      <div className="w-[75%] mx-auto">
        <PostActions {...props} />
      </div>
    </div>
  );
}
