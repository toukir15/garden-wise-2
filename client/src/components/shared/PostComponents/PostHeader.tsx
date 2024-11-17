import { PostDropdown } from "./PostDropdown";
import { UserLink } from "./UserLink";

export const PostHeader = ({
  data,
  isOwner,
  handleUserClick,
  toggleDropdown,
  setPostId,
  handlePostDelete,
  handleEditPost,
  isDropdownOpen,
  postId,
  user,
}: any) => {
  const postUserId = data.isShared ? data.sharedUser._id : data.post.user._id;
  return (
    <div className="flex w-full justify-between">
      <UserLink
        user={user}
        isOwner={isOwner}
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
        setPostId={setPostId}
        handlePostDelete={handlePostDelete}
        handleEdit={handleEditPost}
        isOpen={isDropdownOpen && postId === data._id}
        postId={data._id}
        postUserId={postUserId}
      />
    </div>
  );
};
