import { Space, Table } from "antd";
import type { TableProps } from "antd";

interface CustomTableProps {
  columns: TableProps<any>["columns"];
  data: any[];
  onDelete?: (id: string) => void;
  deleteText?: string;
  loading: boolean;
  pageSize?: number;
}

export const CustomTable = ({
  columns =  [],
  data,
  onDelete,
  deleteText,
  loading,
  pageSize = 10,
}: CustomTableProps) => {
  const handleDelete = (id: string) => {
    onDelete && onDelete(id);
  };

  const tableColumns = deleteText
    ? [
        ...columns,
        {
          title: "Action",
          key: "action",
          render: (_: any, record: any) => (
            <Space size="middle">
              <button
                onClick={() => handleDelete(record._id)}
                className="bg-red-500 hover:bg-red-600 transition duration-150 py-1 px-3 rounded text-white"
              >
                {deleteText}
              </button>
            </Space>
          ),
        },
      ]
    : columns;

  return (
    <Table
      columns={tableColumns}
      dataSource={data.map((item) => ({ ...item, key: item._id }))}
      pagination={{ pageSize }}
      loading={loading}
      scroll={{ x: "max-content" }}
    />
  );
};
