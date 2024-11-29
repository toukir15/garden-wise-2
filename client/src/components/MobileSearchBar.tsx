import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useContext } from "react";
import { IUserProviderValues, UserContext } from "../context/user.provider";
import { IPostProviderValues, PostContext } from "../context/post.provider";
import { Input } from "@nextui-org/input";
import { IoSearchSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function MobileSearchBar() {
  const { user } = useContext(UserContext) as IUserProviderValues;
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const router = useRouter();

  // Function to handle the Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      postStates.setSearchTerm(target.value);
      router.push("/");
    }
  };

  const handleValueChange = (value: string) => {
    if (value == "") {
      postStates.setSearchTerm("");
    }
  };

  const handleClear = () => {
    postStates.setSearchTerm("");
  };

  return (
    <>
      <AnimatePresence>
        {postStates.isSearchbarOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-3 pb-1 flex items-center gap-3"
          >
            <Image
              src={user?.profilePhoto || ""}
              className="rounded-full h-8 w-8"
              height={30}
              width={30}
              alt="User Profile"
            />
            <Input
              onKeyDown={handleKeyDown}
              onValueChange={handleValueChange}
              defaultValue={postStates.searchTerm}
              onClear={handleClear}
              isClearable
              size="sm"
              radius="full"
              placeholder="Type to search post..."
              startContent={
                <IoSearchSharp
                  size={20}
                  className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0"
                />
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
