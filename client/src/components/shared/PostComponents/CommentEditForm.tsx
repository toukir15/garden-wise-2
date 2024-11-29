import React, { useContext } from "react";
import { IoCloseSharp, IoSend } from "react-icons/io5";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useEditComment } from "@/src/hooks/comment.hook";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";

export default function CommentEditForm() {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const {
    queryTerm,
    searchTerm,
    editComment,
    setEditComment,
    editCommentId,
    postId,
  } = postStates;
  const { mutate: handleEditComment } = useEditComment({
    queryTerm,
    searchTerm,
  });
  const { register, handleSubmit, reset } = useForm<FieldValues>();
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleEditComment({ commentId: editCommentId, text: data.text, postId });
    setEditComment("");
    reset();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center border-t border-gray-600 "
    >
      <div className="px-2"></div>
      <div className="w-full flex items-center justify-between">
        <input
          {...register("text")}
          type="text"
          id="comment"
          defaultValue={editComment}
          className="w-full mt-1 outline-none  py-3  text-sm comment_ploaceholder"
          placeholder="Write a comment..."
        />
        <button
          type="button"
          onClick={() => setEditComment("")}
          className="mx-2 bg-[#1D1C1C] p-[4px] text-red-600 hover:text-red-700 transition duration-150 rounded-full h-fit"
        >
          <IoCloseSharp />
        </button>
      </div>
      <button
        type="submit"
        className=" text-xl text-green-500 hover:text-green-600 bg-[#1D1C1C] py-[17px] pr-3 pl-4 transition duration-200"
      >
        <IoSend />
      </button>
    </form>
  );
}
