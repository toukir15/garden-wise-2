import { Dropdown, DropdownItem, DropdownMenu } from "@nextui-org/react";
import Image from "next/image";
import React, { useContext } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { items } from "@/src/const";
import dayjs from "dayjs";
import { FaDownLong, FaUpLong } from "react-icons/fa6";
import LightGalleryImageView from "./LightGalleryImageView";
import { IoIosShareAlt } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import relativeTime from "dayjs/plugin/relativeTime";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import Link from "next/link";
import { formatPostTime } from "@/src/utils/formatPostTime";
import { LuDot } from "react-icons/lu";
import verified from "../../../public/verified.png";
import { UserLink } from "./SharedPost/UserLink";

dayjs.extend(relativeTime);

// Helper Component for User Link
// const UserLink = ({ user, isOwner, handleUserClick }: any) => (
//   <Link
//     onClick={() => handleUserClick(user)}
//     href={isOwner ? "/profile/my-profile" : "/profile/user-profile"}
//     className="flex gap-2 items-center p-2 cursor-pointer w-fit text-start"
//   >
//     <Image
//       className="rounded-full"
//       height={45}
//       width={45}
//       src={user.profilePhoto}
//       alt=""
//     />
//     {/* <div className="text-start">
//       <div className="flex items-center">
//         <p className="font-medium">{user?.name}</p>
//         {user?.isVerified && (
//           <Image
//             src={verified}
//             height={15}
//             width={15}
//             className="mx-1"
//             alt="Profile"
//           />
//         )}
//       </div>  
//     </div> */}    
//   </Link>
// );

// Post Content Display Component
const PostContent = ({ description, category }: any) => (
  <div className="pl-4">
    <div dangerouslySetInnerHTML={{ __html: description || "" }}></div>
    <p className="text-sm text-green-500">{category}</p>
  </div>
);

// Dropdown Menu Component
const PostDropdown = ({
  toggleDropdown,
  setPostId,
  handlePostDelete,
  handleEdit,
  isOpen,
  postId,
}: any) => (
  <div className="relative">
    <button onClick={toggleDropdown} className="mr-8 relative">
      <HiDotsHorizontal className="text-[20px] hover:text-green-500 transition duration-150" />
    </button>
    {isOpen && (
      <div className="rounded bg-white shadow-sm z-50 w-40 absolute flex flex-col -left-[170px]">
        <Dropdown>
          {[
            <DropdownMenu
              aria-label="Post Actions"
              items={items}
              key="dropdown-menu"
            >
              {(item) => (
                <DropdownItem
                  onClick={() =>
                    item.key === "delete"
                      ? handlePostDelete(postId)
                      : handleEdit()
                  }
                  key={item.key}
                  color={item.key === "delete" ? "danger" : "default"}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>,
          ]}
        </Dropdown>
      </div>
    )}
  </div>
);

// Main Component
export default function SharedPost({
  data,
  isDropdownOpen,
  toggleDropdown,
  setPostId,
  handlePostDelete,
  handlePostDownvote,
  handlePostUpvote,
  setIsOpenComment,
  setOpenSharedComment,
  upvoteStatus,
  images,
  downvoteStatus,
  onOpen,
  editOnOpen,
  setEditPostDescription,
  postId,
}: any) {
  const { setPostUser, user } = useContext(UserContext) as IUserProviderValues;

  const isSharedPostOwner = user?._id === data?.sharedUser._id;
  const isPostOwner = user?._id === data?.post.user._id;

  const handleUserClick = (postUser: any) => setPostUser(postUser);

  const handleEditPost = () => {
    editOnOpen();
    setEditPostDescription(data.description);
    setPostId(data._id);
  };

  return (
    <div key={data._id} className="mt-4 shadow-md border-b border-gray-600">
      <div className="flex justify-between">
        <UserLink
          user={data.sharedUser}
          isOwner={isSharedPostOwner}
          handleUserClick={handleUserClick}
        />
        <PostDropdown
          toggleDropdown={() => {
            toggleDropdown();
            setPostId(data._id);
          }}
          setPostId={setPostId}
          handlePostDelete={handlePostDelete}
          handleEdit={handleEditPost}
          isOpen={isDropdownOpen && postId === data._id}
          postId={data._id}
        />
      </div>

      <PostContent
        description={data.description}
        category={data.post.category}
      />

      <div className="mx-6 border border-gray-600 p-2 mt-2 rounded-lg">
        <UserLink
          user={data.post.user}
          isOwner={isPostOwner}
          handleUserClick={handleUserClick}
        />
        <PostContent
          description={data.post.description}
          category={data.post.category}
        />

        <div className="flex w-[90%] mx-auto justify-center pt-4 pb-8">
          <LightGalleryImageView images={images} />
        </div>
      </div>

      <div className="flex justify-between mt-4 px-16 pb-4">
        <button
          onClick={() => handlePostUpvote(data.votes?._id, data?._id)}
          className={` ${upvoteStatus ? "text-green-500" : "hover:text-gray-400"} flex items-center transition duration-150`}
        >
          <FaUpLong className="text-[20px]" />
          <p>{data.votes.upvote?.length || 0}</p>
        </button>
        <button
          onClick={() => handlePostDownvote(data.votes?._id, data?._id)}
          className={` ${downvoteStatus ? "text-green-500" : "hover:text-gray-400"} flex items-center transition duration-150`}
        >
          <FaDownLong className="text-[20px]" />
          <p>{data.votes?.downvote?.length || 0}</p>
        </button>
        <button
          onClick={() => {
            setPostId(data._id);
            setIsOpenComment(false);
            setOpenSharedComment(true);
          }}
          className="flex items-center gap-1 hover:text-gray-400 transition duration-150"
        >
          <FaComment className="text-txt-200" />
          <p>{data?.comments?.length || 0}</p>
        </button>
        <button
          onClick={() => {
            setPostId(data._id);
            onOpen();
          }}
          className="flex bg-black items-center gap-1 hover:text-gray-400 transition duration-150"
        >
          <IoIosShareAlt className="text-2xl text-txt-200" />
        </button>
      </div>
    </div>
  );
}



