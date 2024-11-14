"use client";
import { CustomTable } from "@/src/components/table/table";
import { postColumns } from "@/src/components/table/table.const";
import { useGetPosts } from "@/src/hooks/admin.hook";
import { useDeletePost } from "@/src/hooks/post.hook";
import { showConfirmation } from "@/src/utils/showConfirmation";

export default function PostManagement() {
  const { mutate: handleDelete } = useDeletePost({ queryTerm: "", searchTerm: "" });

  const handlePostDelete = (id: string) => {
    showConfirmation(
      "Delete",
      "Are you sure you want to delete this post?",
      () => handleDelete({ postId: id })
    );
  };

  const { data: postsData, isLoading: postsDataLoading } = useGetPosts();

  return (
    <div className="xl:px-4 lg:px-32 mt-8 lg:mt-20">
      <CustomTable
        columns={postColumns}
        data={postsData?.data.data || []}
        onDelete={handlePostDelete}
        deleteText="Delete Post"
        loading={postsDataLoading}
      />
    </div>
  );
}
