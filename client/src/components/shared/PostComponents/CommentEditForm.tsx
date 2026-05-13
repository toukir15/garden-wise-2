import React, { useContext } from "react";
import { IoCloseSharp, IoSend } from "react-icons/io5";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useEditComment } from "@/src/hooks/comment.hook";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";

export default function CommentEditForm() {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { queryTerm, searchTerm, editComment, setEditComment, editCommentId, postId } = postStates;
  const { mutate: handleEditComment } = useEditComment({ queryTerm, searchTerm });
  const { register, handleSubmit, reset } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleEditComment({ commentId: editCommentId, text: data.text, postId });
    setEditComment("");
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-2 px-4 py-3 border-t border-gray-800 bg-[#181818]"
    >
      <div className="flex-1 flex items-center bg-[#1d1c1c] rounded-full px-4 py-2 gap-2">
        <span className="text-xs text-green-400 shrink-0">Editing</span>
        <input
          {...register("text")}
          type="text"
          defaultValue={editComment}
          autoFocus
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-600 text-gray-200"
          placeholder="Edit your comment…"
        />
        <button
          type="button"
          onClick={() => setEditComment("")}
          className="text-gray-500 hover:text-red-400 transition-colors duration-150 shrink-0"
          title="Cancel"
        >
          <IoCloseSharp className="text-lg" />
        </button>
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
