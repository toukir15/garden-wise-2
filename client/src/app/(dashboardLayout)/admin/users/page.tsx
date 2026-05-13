"use client";
import { CustomTable } from "@/src/components/table/table";
import { usersColumns } from "@/src/components/table/table.const";
import { useDeleteUser, useGetUsers } from "@/src/hooks/admin.hook";
import { showConfirmation } from "@/src/utils/showConfirmation";

export default function UserManagement() {
  const { mutate: handleDelete } = useDeleteUser();

  const handleUserDelete = (id: string) => {
    showConfirmation(
      "Delete",
      "Are you sure you want to delete this user?",
      () => handleDelete(id)
    );
  };

  const { data: usersData, isLoading: userDataLoading } = useGetUsers();
  return (
    <div className="xl:px-4 lg:px-32 mt-8 lg:mt-20">
      <CustomTable
        columns={usersColumns}
        data={usersData?.data.data || []}
        onDelete={handleUserDelete}
        deleteText="Delete"
        loading={userDataLoading}
      />
    </div>
  );
}
