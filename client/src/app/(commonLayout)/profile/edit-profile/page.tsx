"use client";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import "react-quill/dist/quill.snow.css";

export default function Page() {
  const { user } = useContext(UserContext) as IUserProviderValues;

  return (
    <section className="flex justify-center flex-col items-center h-screen p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="p-6 md:p-8 flex flex-col justify-center items-center gap-4 rounded-lg shadow-md">
          <div>
            <div className="flex justify-center">
              <div className="relative flex justify-center rounded-full overflow-hidden w-28 h-28 md:w-36 md:h-36">
                <Image
                  src={
                    user?.profilePhoto ||
                    "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  fill
                  className="object-cover"
                  alt="User Profile"
                />
              </div>
            </div>
            <div className="flex flex-col text-center mt-2 xl:mt-4">
              <p className="text-xl md:text-2xl font-bold">{user?.name}</p>
              <p className="font-medium text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
        <Link
          className="block mt-2 xl:mt-6"
          href={"/profile/edit-profile-details"}
        >
          <Button
            type="button"
            size="lg"
            color="success"
            className="w-full font-bold"
          >
            Edit Profile
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row mt-5 xl:mt-6 gap-4">
          <Link className="flex-1" href={"/profile/change-password"}>
            <Button
              type="button"
              size="lg"
              color="success"
              variant="faded"
              className="w-full font-bold"
            >
              Change Password
            </Button>
          </Link>
          <Link className="flex-1" href={`/profile/${user?._id}`}>
            <Button
              type="button"
              size="lg"
              color="danger"
              variant="faded"
              className="w-full font-bold"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
