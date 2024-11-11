"use client";
import { useGetPayments } from "@/src/hooks/admin.hook";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";

interface DataType {
  _id: string;
  user: {
    name: string;
    email: string;
    isVerified: boolean;
  };
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserManagement() {

  // Define the columns for the table
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "User Name",
      dataIndex: ["user", "name"],  // Access nested user.name
      key: "name",
    },
    {
      title: "User Email",
      dataIndex: ["user", "email"],  // Access nested user.email
      key: "email",
      render: (email: string) => {
        return <Tag color={"blue"}>{email}</Tag>;
      },
    },
    {
      title: "Is Verified",
      dataIndex: ["user", "isVerified"],  
      key: "isVerified",
      render: (isVerified: boolean) => {
        return <Tag color={isVerified ? "green" : "red"}>{isVerified ? "Verified" : "Not Verified"}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => {
        return <Tag color="pink">{dayjs(createdAt).format("YYYY-MM-DD")}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => {
        return <Tag color="gold-inverse">${amount}</Tag>;
      },
    },
  ];

  // Fetch the payment data
  const {
    data: paymentsData,
    isLoading: isPaymentsDataLoading,
    error: paymentsError,
  } = useGetPayments();

  console.log(paymentsData);

  return (
    <div className="px-4 lg:px-32 mt-8 lg:mt-20">
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={paymentsData?.data.data.map((item: any) => {
            return { ...item, key: item._id };
          })}
          pagination={{ pageSize: 10 }}
          className="custom-table-header"
          scroll={{ x: "max-content" }}
          loading={isPaymentsDataLoading}
        />
      </div>
    </div>
  );
}
