"use client";
import { CustomTable } from "@/src/components/table/table";
import { paymentColumns } from "@/src/components/table/table.const";
import { useGetPayments } from "@/src/hooks/admin.hook";

export default function UserManagement() {
  const {
    data: paymentsData,
    isLoading: isPaymentsDataLoading,
    error: paymentsError,
  } = useGetPayments();

  return (
    <div className="xl:px-4 lg:px-32 mt-8 lg:mt-20">
    <CustomTable
      columns={paymentColumns}
      data={paymentsData?.data.data || []}
      loading={isPaymentsDataLoading}
    />
  </div>
  );
}
