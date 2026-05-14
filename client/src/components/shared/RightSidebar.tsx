"use client";
import React, { useContext, useState } from "react";
import { Input } from "@nextui-org/react";
import { IoSearchSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
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
  "Indoor Plants": "🏡",
  "Outdoor Plants": "🌤️",
  Landscaping: "🏞️",
  "Soil & Fertilizers": "🪣",
  Composting: "♻️",
  "Garden Design": "✏️",
  "Plant Diseases & Pests": "🐛",
  "Watering & Irrigation": "💧",
  "Pruning & Trimming": "✂️",
  "Container Gardening": "🪴",
  "Seasonal Gardening (Spring, Summer, Fall, Winter)": "🍂",
  Greenhouses: "🏗️",
  "Organic Gardening": "🌱",
};

export default function RightSidebar() {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { user } = useContext(UserContext) as IUserProviderValues;
  const router = useRouter();

  const { selectedCategories, setSelectedCategories, setSearchTerm, setQueryTerm } = postStates;

  const [userSearch, setUserSearch] = useState("");

  const handleClear = () => setUserSearch("");

  const applyCategories = (cats: string[]) => {
    setSearchTerm(cats.length > 0 ? cats.join("|") : "");
    router.push("/");
  };

  const handleCategoryClick = (label: string) => {
    if (label === "Premium") {
      if (!user?.isVerified) {
        toast.warning("Verify your account to access premium content!", { duration: 2000 });
        return;
      }
      setQueryTerm("premium");
      router.push("/");
      return;
    }

    const next = selectedCategories.includes(label)
      ? selectedCategories.filter((c) => c !== label)
      : [...selectedCategories, label];

    setSelectedCategories(next);
    applyCategories(next);
  };

  const handleRemoveCategory = (label: string) => {
    const next = selectedCategories.filter((c) => c !== label);
    setSelectedCategories(next);
    applyCategories(next);
  };

  return (
    <div className="hidden xl:flex xl:flex-col h-screen pt-4 pb-6 gap-4">
      {/* Search */}
      <Input
        value={userSearch}
        onValueChange={setUserSearch}
        onClear={handleClear}
        isClearable
        radius="full"
        placeholder="Search user..."
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
        <FollowUserList searchTerm={userSearch} />
      </div>

      {/* Browse by category */}
      <div className="border-[0.5px] rounded-xl border-gray-700 pt-4">
        <p className="px-3 border-b font-medium border-gray-700 pb-3">
          Browse by category
        </p>

        {/* Selected category chips */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-3 pt-2.5">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-1 bg-green-700/30 border border-green-600/50 text-green-400 text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {cat}
                <button
                  onClick={() => handleRemoveCategory(cat)}
                  className="hover:text-white transition-colors"
                >
                  <IoClose size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="py-2 h-[240px] overflow-y-auto follow_box">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.label);
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                  isSelected
                    ? "bg-green-700/20 text-green-400"
                    : "hover:bg-white/5 text-gray-300"
                }`}
              >
                <span className="text-lg">{CATEGORY_ICONS[cat.label] ?? "🌱"}</span>
                <span className="text-sm font-medium">{cat.label}</span>
                {isSelected && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
