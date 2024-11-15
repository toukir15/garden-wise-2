import { Dropdown, DropdownItem, DropdownMenu } from "@nextui-org/react";

interface PostDropdownProps {
  user: any;
  data: any;
  items: any[];
  handlePostDelete: Function;
  editOnOpen: Function;
  setEditPostDescription: Function;
  postId: string;
  setPostId: Function;
}

const PostDropdown: React.FC<PostDropdownProps> = ({
  user,
  data,
  items,
  handlePostDelete,
  editOnOpen,
  setEditPostDescription,
  postId,
  setPostId,
}) => (
  <Dropdown>
  {[
      <DropdownMenu
      aria-label="Dynamic Actions"
      items={items.filter(
        (item) => user?._id === data.post.user._id || (item.key !== "delete" && item.key !== "edit")
      )}
    >
      {(item) => (
        <DropdownItem
          onClick={() => {
            if (item.key === "delete" && user?._id === data.post.user._id) handlePostDelete(postId);
            if (item.key === "edit" && user?._id === data.post.user._id) {
              editOnOpen();
              setEditPostDescription(data.post.description);
              setPostId(data._id);
            }
          }}
          key={item.key}
          color={item.key === "delete" ? "danger" : "default"}
          className={item.key === "delete" ? "text-danger" : ""}
        >
          {item.label}
        </DropdownItem>
      )}
    </DropdownMenu>
  ]}
  </Dropdown>
);

export default PostDropdown;
