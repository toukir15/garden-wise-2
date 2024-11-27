import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import React, { useContext } from "react";

// Dynamically import ReactQuill to avoid SSR issues
import dynamic from "next/dynamic";
import { PostContext } from "@/src/context/post.provider";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface EditPostModalProps {
  isEditOpen: boolean;
  editOnOpenChange: (isOpen: boolean) => void;
  handlePostEdit: (e: React.FormEvent<HTMLFormElement>) => void;
  // editPostDescription: string;
}

export default function EditPostModal({
  isEditOpen,
  editOnOpenChange,
  handlePostEdit,
}: EditPostModalProps) {
  const { setEditPostDescription, editPostDescription } =
    useContext(PostContext);
  return (
    <Modal
      className="bg-[#121212]"
      isOpen={isEditOpen}
      size="2xl"
      onOpenChange={editOnOpenChange}
    >
      <form onSubmit={handlePostEdit}>
        <ModalContent className="absolute top-0 xl:top-8 xl:-translate-x-8">
          {(onClose) => (
            <>
              <ModalHeader className="flex text-center flex-col gap-1 border-b border-gray-600">
                Edit Post
              </ModalHeader>
              <ModalBody>
                {/* Rich Text Editor */}
                <div className="mt-3">
                  <ReactQuill
                    placeholder="Add a description..."
                    className="text-white custom-quill sm:h-[100px] lg:h-[150px]"
                    value={editPostDescription}
                    onChange={setEditPostDescription}
                    style={{ height: "100px" }} // Default height for small devices
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-green-500 py-2 mt-16 xl:mt-10 font-medium rounded-full w-full"
                  type="submit"
                  onPress={onClose}
                >
                  Edit Post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </form>
    </Modal>
  );
}
