"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SubmitHandler } from "react-hook-form";
import Image from "next/image";
import GWInput from "@/src/components/form/GWInput";
import GWForm from "@/src/components/form/GWForm";
import { registerValidationSchema } from "@/src/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserRegister } from "@/src/hooks/auth.hook";
import logo from "../../../public/plant.png";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@nextui-org/button";

type TSignupData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
};

export default function SignupPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const router = useRouter();

  // Use mutation for registering the user
  const {
    mutate: handleUserRegister,
    isSuccess,
    isLoading,
    isError,
  } = useUserRegister();

  // Submit handler
  const onSubmit: SubmitHandler<TSignupData> = (data) => {
    const formData = new FormData();
    // Show loading toast and store its ID

    formData.append("data", JSON.stringify(data));
    if (files.length > 0) {
      formData.append("file", files[0]); // Ensure the key matches backend expectations
    }

    // Call the mutation
    handleUserRegister(formData);
  };

  // Handle side effects when success or error occurs
  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        toast.success("Signed up successfully!", { duration: 2000 });
        router.push("/");
      }

      if (isError) {
        toast.error("Registration failed. Please try again.", {
          duration: 2000,
        });
      }
    }
  }, [isLoading, isSuccess, isError, router]);

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

  return (
    <div className="h-screen flex justify-center items-center">
      <GWForm
        onSubmit={onSubmit}
        resolver={zodResolver(registerValidationSchema)}
      >
        <div className="xl:bg-[#121212] w-[400px] xl:w-[600px] shadow-lg py-[30px] rounded-2xl flex justify-center items-center flex-col">
          <Image
            src={logo}
            width={200}
            height={200}
            alt="logo"
            className="w-16 mb-4"
          />
          <h3 className="text-3xl font-medium mb-8 text-white">GardenWise</h3>

          {/* Name Field */}
          <div className="flex flex-col w-4/5 md:w-3/5 mb-4 xl:mb-6">
            <GWInput name="name" label="Name" />
          </div>

          {/* Email Field */}
          <div className="flex flex-col w-4/5 md:w-3/5 mb-4 xl:mb-6">
            <GWInput name="email" label="Email" type="email" />
          </div>

          {/* Profile photo Field */}
          <div className="flex items-center gap-4 w-4/5 md:w-3/5  mb-4 xl:mb-6">
            <div>
              <label
                htmlFor="profilePhoto"
                className="border w-fit py-2 px-4 rounded-full border-green-500 cursor-pointer text-green-500 text-sm"
              >
                Profile photo
              </label>
              <input
                type="file"
                id="profilePhoto"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="h-20 w-20 border border-dashed p-2">
                    <img className="w-full h-full" alt="preview" src={src} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col w-4/5 md:w-3/5 mb-4 xl:mb-6">
            <GWInput name="password" label="Password" type="password" />
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col w-4/5 md:w-3/5 mb-4 xl:mb-6">
            <GWInput
              name="confirmPassword"
              label="Confirm password"
              type="password"
            />
          </div>

          {/* Address Field */}
          <div className="flex flex-col w-4/5 md:w-3/5 mb-6">
            <GWInput name="address" label="Address" />
          </div>

          <Button
            type="submit"
            color="success"
            className="w-4/5 md:w-3/5 py-[10px] px-12 rounded-xl font-bold mt-2"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>

          <p className="text-[#b5b4b4] mt-3 md:mt-4">
            Already have an account?{" "}
            <Link
              href={`/login`}
              className="hover:cursor-pointer hover:underline hover:text-[#959595]"
            >
              Login
            </Link>
          </p>
        </div>
      </GWForm>
    </div>
  );
}
