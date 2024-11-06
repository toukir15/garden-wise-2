"use client";
import { useUser } from "@/src/context/user.provider";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";
import "react-quill/dist/quill.snow.css";

export default function page() {
  const { user } = useUser();

  return (
    <section className="flex justify-center flex-col items-center h-screen   ">
      <div className=" w-fit">
        <div className="p-8 flex flex-col justify-center items-center w-[500px] gap-4 border-gray-600">
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
              {/* <p className="font-medium text-gray-400">{user?.email}</p> */}
            </div>
          </div>
        </div>
        <Link className="w-full font-bold" href={"/profile/edit-profile-details"}>
          <Button size="lg" color="success" className="w-full font-bold">
            Edit Profile
          </Button>
        </Link>
        <div className="flex mt-8 w-full gap-6">
          <Link className="w-full font-bold" href={"/profile/change-password"}>
            <Button
              size="lg"
              className="w-full"
              color="success"
              variant="faded"
            >
              Change Password
            </Button>
          </Link>
          <Button
            size="lg"
            color="danger"
            variant="faded"
            className="w-full font-bold"
          >
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
}