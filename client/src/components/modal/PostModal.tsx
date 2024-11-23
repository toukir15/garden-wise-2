import dynamic from "next/dynamic";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button, Checkbox, Select, SelectItem } from "@nextui-org/react";
import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import { FaRegImage } from "react-icons/fa";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface PostModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: (event?: BaseSyntheticEvent) => void; // Accept optional event
  handleSubmit: any;
  register: any;
  onSubmit: (data: any) => void;
  errors: any;
  categories: any[];
  description: string;
  setDescription: (value: string) => void;
  imagePreviews: string[];
  handleFileChange: (event: any) => void;
}


export default function PostModal({
  isOpen,
  onOpen,
  onClose,
  handleSubmit,
  register,
  onSubmit,
  errors,
  categories,
  description,
  setDescription,
  imagePreviews,
  handleFileChange,
}: PostModalProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

   const handleFormSubmit = (data: any) => {
    onSubmit(data);
    onClose();
  };


  return (
    <Modal
      className="bg-[#121212] absolute z-[999]"
      isOpen={isOpen}
      size="2xl"
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <ModalContent className="absolute top-0 xl:top-8 -translate-x-4">
          <ModalHeader className="flex text-center flex-col gap-1 border-b border-gray-600">
            Create post
          </ModalHeader>
          <ModalBody>
            {/* Category Selection */}
            <Select
              {...register("category", { required: true })}
              size="sm"
              items={categories}
              label="Select a category"
              className="mt-3"
              variant="bordered"
            >
              {(category: any) => (
                <SelectItem key={category.label}>{category.label}</SelectItem>
              )}
            </Select>
            {errors.category && (
              <p className="text-red-500">Category is required</p>
            )}

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
              <div className="flex flex-col md:flex-row w-full md:items-center mb-2">
                <div className="flex w-full flex-wrap gap-3">
                  {imagePreviews.map((src: string, idx: number) => (
                    <div
                      key={idx}
                      className="h-28 w-28 border border-dashed p-2"
                    >
                      <img className="w-full h-full" alt="preview" src={src} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rich Text Editor */}
            <div className="mt-3">
              {ReactQuill && (
                <ReactQuill
                  placeholder="Add a description..."
                  className="text-white custom-quill"
                  value={description}
                  onChange={setDescription}
                  style={{ height: "100px" }}
                />
              )}
            </div>

            <Checkbox
              {...register("isPremium")}
              defaultSelected={false}
              size="md"
              className="mt-16 xl:mt-10"
              color="success"
            >
              Premium
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-green-500 py-2 font-medium rounded-full w-full"
              type="submit"
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
