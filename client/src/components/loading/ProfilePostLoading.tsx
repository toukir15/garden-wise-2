import { Spinner } from "@nextui-org/react";
import React from "react";

export default function ProfilePostLoading() {
  return (
    <div className="h-[calc(100vh-400px)] w-full flex justify-center items-center">
      <Spinner size="lg" color="success"></Spinner>
    </div>
  );
}
