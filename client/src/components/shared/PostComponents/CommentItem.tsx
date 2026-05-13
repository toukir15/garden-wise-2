import { formatRelativeTime } from "@/src/utils/formatRelativeTime";
import Image from "next/image";
import dayjs from "dayjs";
import { showConfirmation } from "@/src/utils/showConfirmation";
import { useDeleteComment } from "@/src/hooks/comment.hook";
import { useContext, useState } from "react";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import CommentReply from "./CommentReply";

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg";

export const CommentItem = ({
  comment,
  postId,
}: {
  comment: any;
  postId: string;
  userId?: string;
}) => {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const { queryTerm, searchTerm, setEditComment, setEditCommentId } = postStates;
  const { user } = useContext(UserContext) as IUserProviderValues;
  const { mutate: handleDelete } = useDeleteComment({ queryTerm, searchTerm });

  const [openCommentReplyID, setOpenCommentReplyID] = useState("");
  const [openCommentNestedReplyID, setCommentNestedReplyID] = useState("");

  const handleCommentDelete = (commentId: string) => {
    showConfirmation(
      "Delete",
      "Are you sure you want to delete this comment?",
      () => handleDelete({ postId, commentId })
    );
  };

  const handleCommentEdit = (text: string, commentId: string) => {
    setEditComment(text);
    setEditCommentId(commentId);
  };

  const isOwner = user?._id === comment.user?._id;

  return (
    <div className="flex flex-row items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors duration-150">
      {/* Avatar — fixed 36×36 container so image never overflows */}
      <div
        className="shrink-0 rounded-full overflow-hidden bg-gray-700"
        style={{ width: 36, height: 36 }}
      >
        <Image
          src={comment.user?.profilePhoto || DEFAULT_AVATAR}
          alt={comment.user?.name || "User"}
          width={36}
          height={36}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right column */}
      <div className="flex-1 min-w-0 text-left">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-green-400 leading-tight">
            @{comment.user?.name}
          </span>
          <span className="text-xs text-gray-500 leading-tight">
            {formatRelativeTime(dayjs(comment.createdAt))}
          </span>
        </div>

        {/* Comment text */}
        <p className="text-sm text-gray-200 mt-1 leading-relaxed break-words text-left">
          {comment.text}
        </p>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex items-center gap-3 mt-1.5">
            <button
              className="text-xs text-gray-500 hover:text-gray-200 transition-colors duration-150"
              onClick={() => handleCommentEdit(comment.text, comment._id)}
            >
              Edit
            </button>
            <span className="text-gray-700 text-xs select-none">·</span>
            <button
              onClick={() => handleCommentDelete(comment._id)}
              className="text-xs text-red-500/60 hover:text-red-400 transition-colors duration-150"
            >
              Delete
            </button>
          </div>
        )}

        {/* Replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-2">
            <CommentReply
              replies={comment.replies}
              postId={postId}
              commentId={comment._id}
              openCommentReplyID={openCommentReplyID}
              setOpenCommentReplyID={setOpenCommentReplyID}
              openCommentNestedReplyID={openCommentNestedReplyID}
              setCommentNestedReplyID={setCommentNestedReplyID}
            />
          </div>
        )}
      </div>
    </div>
  );
};
