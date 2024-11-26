import { PostDropdown } from "./PostDropdown";
import { UserLink } from "./UserLink";

export const PostHeader = ({
  data,
  handleUserClick,
  toggleDropdown,
  setPostId,
  handlePostDelete,
  handleEditPost,
  handleSaveUnsave,
  isDropdownOpen,
  postId,
  user,
}: any) => {
  const postUserId = data.isShared ? data.sharedUser._id : data.post.user._id;
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
        setPostId={setPostId}
        handlePostDelete={handlePostDelete}
        handleEdit={handleEditPost}
        isOpen={isDropdownOpen && postId === data._id}
        postId={data._id}
        postUserId={postUserId}
        handleSaveUnsave={handleSaveUnsave}
      />
    </div>
  );
};
