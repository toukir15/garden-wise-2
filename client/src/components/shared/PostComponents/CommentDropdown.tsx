import { items } from "@/src/const";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { Dropdown, DropdownItem, DropdownMenu } from "@nextui-org/react";
import { useContext } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

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
  const filterItems = items.filter((item) => {
    if (postUserId !== user?._id) {
      return item.key !== "delete" && item.key !== "edit";
    } else {
      return item;
    }
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
              <DropdownMenu
                aria-label="Post Actions"
                items={filterItems}
                key="dropdown-menu"
              >
                {(item) => (
                  <DropdownItem
                    onClick={() => {
                      item.key === "delete" && handlePostDelete(postId);
                      item.key === "edit" && handleEdit();
                    }}
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
};
