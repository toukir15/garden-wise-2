import { Spinner } from "@nextui-org/react";
import React from "react";

export default function ProfilePostLoading({ height }: { height: string }) {
  return (
    <div className={`${height} w-full flex justify-center items-center`}>
      <Spinner size="lg" color="success"></Spinner>
    </div>
  );
}
