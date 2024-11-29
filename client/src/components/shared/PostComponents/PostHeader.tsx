import { useContext } from "react";
import { PostDropdown } from "./PostDropdown";
import { UserLink } from "./UserLink";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";

export const PostHeader = ({
  data,
  handleUserClick,
  handleEditPost,
  user,
}: any) => {
  const postUserId = data.isShared ? data.sharedUser._id : data.post.user._id;
  const { postStates, toggleDropdown } = useContext(
    PostContext
  ) as IPostProviderValues;
  const { isDropdownOpen, setPostId, postId } = postStates;
  return (
    <div className="flex w-full justify-between">
      <UserLink
        user={user}
        handleUserClick={handleUserClick}
        category={data.post.category}
        isPremium={data.post.isPremium}
        createdAt={data.createdAt}
      />
      <PostDropdown
        toggleDropdown={() => {
          toggleDropdown();
          setPostId(data._id);
        }}
        handleEdit={handleEditPost}
        isOpen={isDropdownOpen && postId === data._id}
        postId={data._id}
        postUserId={postUserId}
      />
    </div>
  );
};
