import { Spinner } from "@nextui-org/react";

export default function ComponentLoading() {
  return (
    <div className=" h-[calc(100vh-400px)] xl:h-screen w-full flex justify-center items-center">
      <Spinner size="lg" color="success"></Spinner>
    </div>
  );
}
