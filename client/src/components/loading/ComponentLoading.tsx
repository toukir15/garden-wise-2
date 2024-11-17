import { Spinner } from "@nextui-org/react";

export default function ComponentLoading() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Spinner size="lg" color="success"></Spinner>
    </div>
  );
}
