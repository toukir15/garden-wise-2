import Image from "next/image";
import React, { useContext } from "react";
import toukir from "../../../public/toukir.jpg";
import { IoSend } from "react-icons/io5";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useComment } from "@/src/hooks/comment.hook";
import { PostContext } from "@/src/context/post.provider";

export default function CommentForm({ postId }: { postId: string }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { queryTerm, searchTerm } = useContext(PostContext);
  const { mutate: handleComment } = useComment({ queryTerm, searchTerm });
  const { register, handleSubmit, reset } = useForm<FieldValues>();
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleComment({ postId, text: data.text, user: user });
    reset();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center border-t border-gray-600 "
    >
      <div className="px-2">
        <Image
          className=" rounded-full"
          height={30}
          width={30}
          src={toukir}
          alt=""
        />
      </div>
      <input
        {...register("text")}
        type="text"
        id="comment"
        className="w-full mt-1 outline-none  py-3  text-sm comment_ploaceholder"
        placeholder="Write a comment..."
      />
      <button className=" text-xl text-green-500 hover:text-green-600 bg-[#1D1C1C] py-[17px] pr-3 pl-4 transition duration-200">
        <IoSend />
      </button>
    </form>
  );
}
