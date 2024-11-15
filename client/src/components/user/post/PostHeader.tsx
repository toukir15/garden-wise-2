import Image from "next/image";
import Link from "next/link";
import { formatPostTime } from "@/src/utils/formatPostTime";
import { LuDot } from "react-icons/lu";

interface PostHeaderProps {
  user: any;
  data: any;
  handlePostUser: (postUser: any) => void;
  checkPostUser: boolean;
}

const PostHeader: React.FC<PostHeaderProps> = ({ user, data, handlePostUser, checkPostUser }) => (
  <Link
    onClick={() => handlePostUser(data?.post.user)}
    href={`${checkPostUser ? "/profile/my-profile" : "/profile/user-profile"}`}
    className="flex gap-2 items-center p-2 cursor-pointer w-fit"
  >
    <Image className="rounded-full" height={45} width={45} src={data?.post.user.profilePhoto} alt="User Avatar" />
    <div className="text-start">
      <div className="flex items-center">
        <p className="font-medium">{data.post.user?.name}</p>
        {data.post.user?.isVerified && <Image src="/verified.png" height={15} width={15} className="mx-1" alt="Profile" />}
        {data.post.isPremium && <p className="text-sm text-gray-500">Premium</p>}
        <LuDot />
        <p className="text-xs text-gray-400">{formatPostTime(data?.createdAt)}</p>
      </div>
      <p className="text-sm text-green-500">{data.post.category}</p>
    </div>
  </Link>
);

export default PostHeader;
