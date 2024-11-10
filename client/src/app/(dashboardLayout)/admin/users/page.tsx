"use client";
import { useDeleteUser, useGetUsers } from "@/src/hooks/admin.hook";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import Notiflix from "notiflix";

// Define a mock DataType interface
interface DataType {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
}

export default function UserManagement() {

  const {mutate: handleDelete} = useDeleteUser()
  const handleUserDelete = async (id: string) => {
    console.log(`Making user with ID ${id} an admin`);
    // Add logic to make user an admin
    Notiflix.Confirm.show(
      "Delete",
      "Are you sure you want to delete this user?",
      "Confirm",
      "Cancel",
      function () {
        handleDelete(id)
      },
      function () {
        console.log("Canceled");
      },
      {
        borderRadius: "8px",
        titleColor: "#d33",
        okButtonBackground: "#d33", 
        okButtonColor: "#fff", 
      }
    );
  };


  const columns: TableProps<DataType>["columns"] = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => {
        return <Tag color={"lime"}>{email}</Tag>;
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: string) => {
        return <Tag color={"purple"}>{address}</Tag>;
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        return <Tag color={"green"}>{role}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => handleUserDelete(record._id)}
            className="bg-red-500 hover:bg-red-600 transition duration-150 py-1 px-3 rounded text-white"
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];

  const {
    data: usersData,
    isLoading: userDataLoading,
    error: userDataError,
  } = useGetUsers();

  console.log(usersData);

  return (
    <div className="px-4 lg:px-32 mt-8 lg:mt-20">
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={usersData?.data.data.map((item: any) => {
            return { ...item, key: item._id };
          })}
          pagination={{ pageSize: 10 }}
          className="custom-table-header"
          scroll={{ x: "max-content" }}
          loading={userDataLoading}
        />
      </div>
    </div>
  );
}
