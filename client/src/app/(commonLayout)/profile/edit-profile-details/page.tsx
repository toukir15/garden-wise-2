"use client";
import { useUser } from "@/src/context/user.provider";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";
import { Button, Input, Link } from "@nextui-org/react";
import { useEditProfile } from "@/src/hooks/auth.hook";
import { useForm } from "react-hook-form"; // Import useForm from react-hook-form
import { FaEdit } from "react-icons/fa";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { user } = useUser();
  const router = useRouter();
  const { mutate: editProfile, isLoading, isSuccess } = useEditProfile();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  type TEditProfile = { name?: string; address?: string; profilePhoto?: File };

  // Handle file changes for image preview
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

  // Form submission handler
  const onSubmit = (data: TEditProfile) => {
    const formData = new FormData();

    // Combine name and address into a single variable
    const profileDetails = JSON.stringify({
      name: data.name,
      address: data.address,
    });

    // Append combined data as a single variable
    formData.append("data", profileDetails);

    // Append file if available
    if (files[0]) {
      formData.append("profilePhoto", files[0]);
    }

    // Proceed to edit profile
    editProfile(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully updated profile data!", { duration: 2000 });
      router.push("/");
    }
  }, [isSuccess, router]);

  return (
    <section className="flex justify-center flex-col items-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" w-fit"
        encType="multipart/form-data"
      >
        <div className="p-4 flex flex-col justify-center items-center w-[500px] gap-4 border-gray-600">
          <div className="relative">
            {imagePreviews.length > 0 && (
              <label htmlFor="profilePhoto" className="cursor-pointer">
                {imagePreviews.map((src, idx) => (
                  <Image
                    key={idx}
                    src={src}
                    className="rounded-full"
                    height={150}
                    width={150}
                    alt="Profile Photo"
                  />
                ))}
              </label>
            )}
            {imagePreviews.length < 1 && (
              <label htmlFor="profilePhoto" className="cursor-pointer">
                <Image
                  src={user?.profilePhoto}
                  className="rounded-full"
                  height={150}
                  width={150}
                  alt="Profile Photo"
                />
              </label>
            )}
            <input
              type="file"
              id="profilePhoto"
              className="hidden"
              onChange={handleFileChange}
            />
            <FaEdit className="absolute bottom-0 right-4 text-green-500 text-[24px]" />
          </div>
          <div className="flex justify-between text-center">
            <div>
              <p className=" text-2xl font-bold">{user?.name}</p>
            </div>
          </div>
        </div>

        <div>
          {/* Name Input */}
          <Input
            className="mt-4"
            type="text"
            variant="underlined"
            label="Name (Optional)"
            {...register("name")}
            required={false}
          />

          {/* Address Input */}
          <Input
            className="mt-4"
            type="text"
            variant="underlined"
            label="Address (Optional)"
            {...register("address")}
            required={false}
          />

          <div className="mt-8 w-full flex gap-4">
            {!isLoading && (
              <Button
                className="w-full"
                size="lg"
                color="success"
                variant="faded"
                type="submit"
              >
                Save Changes
              </Button>
            )}
            {isLoading && (
              <Button
                className="w-full"
                size="lg"
                color="success"
                variant="faded"
                type="submit"
              >
                Updating...
              </Button>
            )}

            <Link className="w-full" href={"/edit-profile"}>
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
        </div>
      </form>
    </section>
  );
}
