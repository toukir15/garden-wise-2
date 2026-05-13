"use client";
import React, { useContext } from "react";
import { Input } from "@nextui-org/react";
import { IoSearchSharp } from "react-icons/io5";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import FollowUserList from "./RightSidebar/FollowUserList";
import { useRouter } from "next/navigation";
import categories from "../../assets/json/category.json";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { toast } from "sonner";

const CATEGORY_ICONS: Record<string, string> = {
  Vegetables: "🥦",
  Flowers: "🌸",
  Herbs: "🌿",
  Fruits: "🍎",
  Shrubs: "🌳",
  Trees: "🌲",
  Succulents: "🪴",
  Indoor: "🏠",
  Outdoor: "🌤️",
};

export default function RightSidebar() {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { user } = useContext(UserContext) as IUserProviderValues;
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      postStates.setSearchTerm(target.value);
      router.push("/");
    }
  };

  const handleValueChange = (value: string) => {
    if (value === "") postStates.setSearchTerm("");
  };

  const handleClear = () => postStates.setSearchTerm("");

  const handleCategoryClick = (label: string) => {
    if (label === "Premium") {
      if (!user?.isVerified) {
        toast.warning("Verify your account to access premium content!", { duration: 2000 });
        return;
      }
      postStates.setQueryTerm("premium");
    } else {
      postStates.setSearchTerm(label);
    }
    router.push("/");
  };

  return (
    <div className="hidden xl:flex xl:flex-col h-screen pt-4 gap-4">
      {/* Search */}
      <Input
        onKeyDown={handleKeyDown}
        onValueChange={handleValueChange}
        defaultValue={postStates.searchTerm}
        onClear={handleClear}
        isClearable
        radius="full"
        placeholder="Type to search post..."
        startContent={
          <IoSearchSharp
            size={20}
            className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0"
          />
        }
      />

      {/* Suggested for you — grows to fill remaining space */}
      <div className="border-[0.5px] rounded-xl border-gray-700 pt-4 flex flex-col flex-1 min-h-0">
        <p className="px-3 border-b font-medium border-gray-700 pb-3">
          Suggested for you
        </p>
        <FollowUserList />
      </div>

      {/* Browse by category */}
      <div className="border-[0.5px] rounded-xl border-gray-700 pt-4">
        <p className="px-3 border-b font-medium border-gray-700 pb-3">
          Browse by category
        </p>
        <div className="py-2 h-[280px] overflow-y-auto follow_box">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.label)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-lg">{CATEGORY_ICONS[cat.label] ?? "🌱"}</span>
              <span className="text-sm text-gray-300 font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
