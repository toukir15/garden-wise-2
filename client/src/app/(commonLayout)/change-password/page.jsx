"use client";
import { useUser } from "@/src/context/user.provider";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";
import { Button, Input, Link } from "@nextui-org/react";

export default function page() {
  const { user } = useUser();
  return (
    <section className="flex justify-center flex-col items-center h-screen   ">
      <div className=" w-fit">
        <div className="p-4 flex flex-col justify-center items-center w-[500px] gap-4 border-gray-600">
          <Image
            src={user?.profilePhoto}
            className="rounded-full"
            height={150}
            width={150}
            alt="df"
          />
          <div className="flex justify-between text-center">
            <div>
              <p className=" text-2xl font-bold">{user?.name}</p>
            </div>
          </div>
        </div>
        <div>
          <Input
            className="mt-4"
            type="email"
            variant="underlined"
            label="Current Password"
          />
          <Input
            className="mt-4"
            type="email"
            variant="underlined"
            label="New Password"
          />
          <Input
            className="mt-4"
            type="email"
            variant="underlined"
            label="Confirm Password"
          />
          <div className="mt-8 w-full flex gap-4">
            <Button
              className="w-full"
              size="lg"
              color="success"
              variant="faded"
            >
              Save Password
            </Button>
            <Link className="w-full" href={"/edit-profile"}>
              <Button
                className="w-full"
                size="lg"
                color="danger"
                variant="faded"
              >
                Cancel Password
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
