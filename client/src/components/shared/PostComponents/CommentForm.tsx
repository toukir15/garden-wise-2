import React, { useContext } from "react";
import { IoSend } from "react-icons/io5";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useComment } from "@/src/hooks/comment.hook";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import Image from "next/image";

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg";

export default function CommentForm() {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { queryTerm, searchTerm, postId } = postStates;
  const { user } = useContext(UserContext) as IUserProviderValues;
  const { mutate: handleComment } = useComment({ queryTerm, searchTerm });
  const { register, handleSubmit, reset } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!data.text?.trim()) return;
    handleComment({ postId, text: data.text, user });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-2 px-4 py-3 border-t border-gray-800"
    >
      <div
        className="shrink-0 rounded-full overflow-hidden bg-gray-700"
        style={{ width: 32, height: 32 }}
      >
        <Image
          src={user?.profilePhoto || DEFAULT_AVATAR}
          alt="Your avatar"
          width={32}
          height={32}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 flex items-center bg-[#1d1c1c] rounded-full px-4 py-2 gap-2">
        <input
          {...register("text")}
          type="text"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-600 text-gray-200"
          placeholder="Write a comment…"
        />
        <button
          type="submit"
          className="text-green-500 hover:text-green-400 transition-colors duration-150 shrink-0"
        >
          <IoSend className="text-lg" />
        </button>
      </div>
    </form>
  );
}
