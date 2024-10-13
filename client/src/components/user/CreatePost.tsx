"use client";
/* eslint-disable padding-line-between-statements */
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
import { useState } from "react";
import categories from "../../assets/json/category.json";
import profile from "../../../public/toukir.jpg";
import { useCreatePost } from "@/src/hooks/post.hook";
import { FaRegImage } from "react-icons/fa";

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => null,
});

export default function CreatePost() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [description, setDescription] = useState<string>(""); // Rich text description state
  const [files, setFiles] = useState<File[]>([]); // Image file state
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Image preview state
  const { mutate: handleCreatePost } = useCreatePost(); // Mutation to handle post submission

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Handle form submission
    const formData = new FormData();
    formData.append("data", JSON.stringify({ ...data, description }));
    files.forEach((file) => {
      formData.append(`file`, file);
    });
    handleCreatePost(formData); // Submit form data
  };

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const newPreviews = newFiles.map((file) => {
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    // Update image previews and file list
    Promise.all(newPreviews).then((previews) => {
      setFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...previews]);
    });
  };

  return (
    <div className="w-full border-b h-fit border-gray-700 py-4 ">
      <div className="flex gap-3 items-center px-4">
        <Image
          alt="Profile image"
          className="rounded-full"
          src={profile}
          height={40}
          width={40}
        />
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

      <Modal
        className="bg-[#121212]"
        isOpen={isOpen}
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent className="absolute top-8 -translate-x-9">
            {(onClose) => (
              <>
                <ModalHeader className="flex text-center flex-col gap-1 border-b border-gray-600">
                  Create post
                </ModalHeader>
                <ModalBody>
                  {/* Select Category */}
                  <Select
                    {...register("category")}
                    size="sm"
                    items={categories}
                    label="Select a category"
                    className="mt-3"
                    variant="bordered"
                  >
                    {(category) => (
                      <SelectItem key={category.label}>
                        {category.label}
                      </SelectItem>
                    )}
                  </Select>
                  {/* Add Images */}
                  <label
                    className="border py-2 px-4 text-center w-fit flex items-center gap-2 text-sm rounded-full mt-2 border-green-500 text-green-500"
                    htmlFor="addImage"
                  >
                    <span>
                      <FaRegImage />
                    </span>
                    <span>Add Images</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    id="addImage"
                    className="hidden"
                    multiple
                  />

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-col md:flex-row w-full md:items-center mb-2 ">
                      <div className={`flex w-full flex-wrap gap-3`}>
                        {imagePreviews.map((src, idx) => (
                          <div
                            key={idx}
                            className="h-28 w-28 border border-dashed p-2"
                          >
                            <img
                              className="w-full h-full"
                              alt="preview"
                              src={src}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rich Text Editor */}
                  <div className="mt-3">
                    <ReactQuill
                      placeholder="Add a description..."
                      className="text-white custom-quill"
                      value={description}
                      onChange={setDescription} // Updates state with description
                      style={{ height: "100px" }}
                    />
                  </div>

                  <Checkbox
                    {...register("premium")} // Register checkbox for premium post
                    defaultSelected={false}
                    size="md"
                    className="mt-10"
                  >
                    Premium
                  </Checkbox>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="bg-green-500 py-2 font-medium rounded-full w-full"
                    type="submit"
                    onPress={onClose}
                  >
                    Post
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
}
