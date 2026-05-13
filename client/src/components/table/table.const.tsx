import { Tag } from "antd";
import dayjs from "dayjs";

export const usersColumns = [
  {
    title: "User Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email: string) => <Tag color="lime">{email}</Tag>,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (address: string) => <Tag color="purple">{address}</Tag>,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role: string) => <Tag color="green">{role}</Tag>,
  },
];

export const postColumns = [
  {
    title: "User Name",
    dataIndex: "userName",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email: string) => <Tag color="purple">{email}</Tag>,
  },
  {
    title: "Upvotes",
    dataIndex: "upvotes",
    key: "upvotes",
    render: (upvotes: string) => <Tag color="green">{upvotes}</Tag>,
  },
  {
    title: "Downvotes",
    dataIndex: "downvotes",
    key: "downvotes",
    render: (downvotes: string) => <Tag color="red">{downvotes}</Tag>,
  },
  {
    title: "Comments",
    dataIndex: "comments",
    key: "comments",
    render: (comments: string) => <Tag color="magenta">{comments}</Tag>,
  },
];

export const paymentColumns = [
  {
    title: "User Name",
    dataIndex: ["user", "name"], 
    key: "name",
  },
  {
    title: "User Email",
    dataIndex: ["user", "email"], 
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
      return (
        <Tag color={isVerified ? "green" : "red"}>
          {isVerified ? "Verified" : "Not Verified"}
        </Tag>
      );
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
