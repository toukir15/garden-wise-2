import { formatRelativeTime } from "@/src/utils/formatRelativeTime";
import Image from "next/image";
import dayjs from "dayjs";
import { showConfirmation } from "@/src/utils/showConfirmation";
import { useDeleteComment } from "@/src/hooks/comment.hook";
import { useContext } from "react";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";

export const CommentItem = ({
  comment,
  postId,
}: {
  comment: any;
  postId: string;
  userId?: string;
}) => {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { queryTerm, searchTerm, setEditComment, setEditCommentId } =
    postStates;
  const { user } = useContext(UserContext) as IUserProviderValues;
  const { mutate: handleDelete } = useDeleteComment({ queryTerm, searchTerm });

  const handleCommentDelete = (commentId: string) => {
    showConfirmation(
      "Delete",
      "Are you sure you want to delete this comment?",
      () => handleDelete({ postId, commentId })
    );
  };

  const handleCommentEdit = (comment: string, commentId: string) => {
    setEditComment(comment);
    setEditCommentId(commentId);
  };

  return (
    <>
      <div key={comment._id} className={`flex w-fit mr-4 relative my-2 `}>
        <div className="pr-2 mt-2 shrink-0">
          <Image
            className="rounded-full"
            height={25}
            width={25}
            src={comment.user?.profilePhoto}
            alt="user image"
          />
        </div>
        <div className="relative">
          <div className="bg-[#1d1c1c] text-start py-1 pl-2 pr-24 rounded">
            <p>
              <span className="font-semibold text-green-500 text-sm">
                @{comment.user?.name}
              </span>
            </p>
            <p className="mb-1 text-gray-300 leading-[1.3] text-sm">
              {comment.text}
            </p>
            <span className="absolute text-xs top-1 text-gray-500 right-1 ">
              {formatRelativeTime(dayjs(comment.createdAt))}
            </span>
            {user?._id === comment.user._id && (
              <div className="absolute flex gap-2 text-xs bottom-1 right-1">
                <button
                  className="text-gray-400"
                  onClick={() => handleCommentEdit(comment.text, comment._id)}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCommentDelete(comment._id)}
                  className=" text-red-500 text-xs"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
