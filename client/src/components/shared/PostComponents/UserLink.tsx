import Image from "next/image";
import Link from "next/link";
import verified from "../../../../public/verified.png";
import { formatPostTime } from "@/src/utils/formatPostTime";
import { LuDot } from "react-icons/lu";

export const UserLink = ({
  user,
  isOwner,
  handleUserClick,
  isPremium,
  createdAt,
  category,
  isShared,
}: any) => {
  const handlePostUser = (postUser: any) => {
    localStorage.setItem("user-profile", JSON.stringify(postUser));
  };
  return (
    <Link
      onClick={() => {
        handleUserClick(user);
        handlePostUser(user);
      }}
      href={isOwner ? "/profile/my-profile" : "/profile/user-profile"}
      className="flex gap-2 items-center p-2 cursor-pointer w-fit text-start"
    >

      <div>
        <div className={`relative ${isShared ? "h-9 w-9": "h-10 w-10"} `}>
          <Image
            src={user.profilePhoto}
            alt="profile photo"
            layout="fill"
            className="rounded-full object-cover"
          />
        </div>
      </div>

      <div className="text-start">
        <div className="flex  items-center">
          <p className="font-medium">{user?.name}</p>
          {user?.isVerified && (
            <Image
              src={verified}
              height={15}
              width={15}
              className="mx-1"
              alt="Profile"
            />
          )}
          {isPremium && (
            <p
              className={`text-sm text-gray-500 ${!user?.isVerified && "ml-2 relative"}`}
            >
              Premium
            </p>
          )}
          <LuDot />
          <p className="text-xs text-gray-400">{formatPostTime(createdAt)}</p>
        </div>
        <p className="text-sm text-green-500">{category}</p>
      </div>
    </Link>
  );
};