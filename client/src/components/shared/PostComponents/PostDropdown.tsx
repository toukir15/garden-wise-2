import { items } from "@/src/const";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { useGetBookmarks, useUpdateBookmark } from "@/src/hooks/bookmark.hook";
import { Dropdown, DropdownItem, DropdownMenu } from "@nextui-org/react";
import { useContext } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { toast } from "sonner";

// Dropdown Menu Component
export const PostDropdown = ({
  toggleDropdown,
  handlePostDelete,
  handleEdit,
  isOpen,
  postId,
  postUserId,
}: any) => {
  const { user } = useContext(UserContext) as IUserProviderValues;
  const { data: bookmarksData } = useGetBookmarks();
  const bookmarkId =bookmarksData?.data.data._id
  const checkSave = bookmarksData?.data.data.posts.some(
    (post: { _id: string }) => post._id === postId
  );

  const {mutate: updateBookmark} = useUpdateBookmark()
  const handleSaveUnsave = (bookmarkId:string, postId:string, label: string) => {
    console.log(label)
    updateBookmark({bookmarkId, postId})
    if(label == "Save"){
      toast.success("Saved bookmark!", {duration: 2000})
    }
  }


  // Dynamically adjust dropdown items
  const filterItems = items
    .filter((item) => {
      if (postUserId !== user?._id) {
        return item.key !== "delete" && item.key !== "edit";
      } else {
        return item;
      }
    })
    .concat({
      key: "save",
      label: checkSave ? "Unsave" : "Save",
    });

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="mr-8 relative">
        <HiDotsHorizontal className="text-[20px] hover:text-green-500 transition duration-150" />
      </button>
      {isOpen && (
        <div className="rounded bg-white shadow-sm z-50 w-40 absolute flex flex-col -left-[170px]">
          <Dropdown>
          {[
              <DropdownMenu aria-label="Post Actions" items={filterItems}>
              {(item) => (
                <DropdownItem
                  onClick={() => {
                    if (item.key === "delete") handlePostDelete(postId);
                    if (item.key === "edit") handleEdit();
                    if (item.key === "save") handleSaveUnsave(bookmarkId, postId, item.label)
                  }}
                  key={item.key}
                  color={item.key === "delete" ? "danger" : "default"}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          ]}
          </Dropdown>
        </div>
      )}
    </div>
  );
};
