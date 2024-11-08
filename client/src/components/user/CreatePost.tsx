"use client";
import Image from "next/image";
import { useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import categories from "../../assets/json/category.json";
import Loading from "../Loading";
import PostModal from "../modal/PostModal";
import { useUser } from "@/src/context/user.provider";
import { useCreatePostForm } from "../hooks/useCreatePostForm";

export default function CreatePost() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClient, setIsClient] = useState(false);
  const { user } = useUser();

  const {
    description,
    setDescription,
    imagePreviews,
    handleFileChange,
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
  } = useCreatePostForm();

  // Ensure client-side rendering to avoid hydration errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      {isLoading && <Loading />}
      <div className="w-full border-b h-fit border-gray-700 py-5">
        <div className="flex gap-2 items-center px-4">
          <div className="rounded-full overflow-hidden w-[40px] h-[40px] relative">
            <Image
              alt="Profile image"
              src={
                user?.profilePhoto ||
                "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              fill
              className="object-cover"
            />
          </div>
          <Button
            className="p-5 rounded-full text-sm w-full cursor-pointer flex justify-start bg-[#121212]"
            onPress={onOpen}
          >
            <input
              disabled
              placeholder="What's on your mind?"
              className="bg-[#121212]"
              type="text"
            />
          </Button>
        </div>

        <PostModal
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          handleSubmit={handleSubmit}
          register={register}
          onSubmit={(data ) => onSubmit(data, onClose)} 
          errors={errors}
          categories={categories}
          description={description}
          setDescription={setDescription}
          imagePreviews={imagePreviews}
          handleFileChange={handleFileChange}
        />
      </div>
    </>
  );
}
