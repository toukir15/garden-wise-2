"use client";
import { useState, useEffect, useContext } from "react";
import { useCreatePost } from "@/src/hooks/post.hook";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

export function useCreatePostForm() {
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { queryTerm, searchTerm } = postStates;
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

    handleCreatePost(formData, {
      onSuccess: () => {
        // onClose();
      },
      onError: (error) => {
        console.error("Post creation failed:", error);
      },
    });
  };

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

  return {
    description,
    setDescription,
    imagePreviews,
    handleFileChange,
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
  };
}
