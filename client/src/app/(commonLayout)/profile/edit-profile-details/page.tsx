"use client";

import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";
import { Button, Input, Link } from "@nextui-org/react";
import { useEditProfile } from "@/src/hooks/auth.hook";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { user } = useContext(UserContext) as IUserProviderValues;
  const router = useRouter();
  const { mutate: editProfile, isLoading, isSuccess } = useEditProfile();

  const { register, handleSubmit, formState: { errors } } = useForm();

  type TEditProfile = { name?: string; address?: string; profilePhoto?: File };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imagePreview = reader.result as string;
        setFiles([file]);
        setImagePreviews([imagePreview]);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: TEditProfile) => {
    const formData = new FormData();
    const profileDetails = JSON.stringify({
      name: data.name,
      address: data.address,
    });
    formData.append("data", profileDetails);
    if (files[0]) {
      formData.append("profilePhoto", files[0]);
    }
    editProfile(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully updated profile data!", { duration: 2000 });
      router.push("/");
    }
  }, [isSuccess, router]);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-4  rounded-lg shadow-lg"
        encType="multipart/form-data"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {imagePreviews.length > 0 ? (
              <label htmlFor="profilePhoto" className="cursor-pointer">
                {imagePreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-full overflow-hidden w-36 h-36 sm:w-48 sm:h-48"
                  >
                    <Image src={src} fill className="object-cover" alt="Profile Preview" />
                  </div>
                ))}
              </label>
            ) : (
              <label htmlFor="profilePhoto" className="cursor-pointer">
                <div className="relative rounded-full overflow-hidden w-36 h-36 sm:w-48 sm:h-48">
                  <Image
                    src={
                      user?.profilePhoto ||
                      "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                    }
                    fill
                    className="object-cover"
                    alt="Profile Photo"
                  />
                </div>
              </label>
            )}
            <input
              type="file"
              id="profilePhoto"
              className="hidden"
              onChange={handleFileChange}
            />
            <FaEdit className="absolute bottom-2 right-2 text-green-500 text-lg sm:text-xl" />
          </div>

          <div className="text-center">
            <p className="text-lg font-bold sm:text-2xl">{user?.name}</p>
            <p className="text-sm text-gray-500 font-medium sm:text-base">{user?.email}</p>
          </div>
        </div>

        <div className="mt-4">
          <Input
            type="text"
            variant="underlined"
            label="Name (Optional)"
            {...register("name")}
          />
          <Input
            type="text"
            variant="underlined"
            label="Address (Optional)"
            {...register("address")}
            className="mt-4"
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Button
            className="w-full"
            size="lg"
            color="success"
            variant="faded"
            type="submit"
            isLoading={isLoading}
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
          <Link className="w-full" href={"/profile/edit-profile"}>
            <Button
              className="w-full"
              size="lg"
              color="danger"
              variant="faded"
            >
              Cancel Changes
            </Button>
          </Link>
        </div>
      </form>
    </section>
  );
}
