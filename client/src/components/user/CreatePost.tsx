"use client";

import Image from "next/image";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Checkbox, Select, SelectItem } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState, useContext, useEffect } from "react";
import categories from "../../assets/json/category.json";
import profile from "../../../public/toukir.jpg";
import { useCreatePost } from "@/src/hooks/post.hook";
import { FaRegImage } from "react-icons/fa";
import Loading from "../Loading";
import { PostContext } from "@/src/context/post.provider";
import PostModal from "../modal/PostModal";
import { useUser } from "@/src/context/user.provider";

// Dynamically import ReactQuill for rich text editing
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function CreatePost() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [description, setDescription] = useState<string>(""); // Rich text description state
  const [files, setFiles] = useState<File[]>([]); // Image file state
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Image preview state
  const { queryTerm, searchTerm } = useContext(PostContext);
  const [isClient, setIsClient] = useState(false);
  const { user } = useUser();

  // Ensure client-side rendering to avoid hydration errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch post mutation
  const { mutate: handleCreatePost, isLoading } = useCreatePost({
    queryTerm,
    searchTerm,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ ...data, description }));
    files.forEach((file) => {
      formData.append("file", file);
    });
    handleCreatePost(formData);
    onClose(); 
  };

  // Handle file changes and set preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const newPreviews = newFiles.map((file) => {
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviews).then((previews) => {
      setFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...previews]);
    });
  };

  useEffect(() => {
    setImagePreviews((prev) => (prev.length ? prev : []));
  }, [files]);

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
          onSubmit={onSubmit}
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
