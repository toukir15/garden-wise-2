"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FieldValues, SubmitHandler } from "react-hook-form";
import GWInput from "@/src/components/form/GWInput";
import GWForm from "@/src/components/form/GWForm";
import { useSendForgetEmail, useUserLogin } from "@/src/hooks/auth.hook";
import { loginValidationSchema } from "@/src/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import logo from "../../../public/plant.png";
import { Button } from "@nextui-org/button";

export default function LoginPage() {
  const router = useRouter();
  const {
    mutate: handleUserLogin,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useUserLogin();

  // Form submission handler
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleUserLogin(data);
  };

  // Side effects for login success or error handling
  useEffect(() => {
    if (isSuccess) {
      toast.success("Logged in successfully!", { duration: 2000 });
      router.push("/");
    }

    if (isError) {
      toast.error(`Login failed: ${error?.message || "Unknown error"}`, {
        duration: 3000,
      });
    }
  }, [isSuccess, isError, error, router]);

  return (
    <div className="h-screen flex justify-center items-center px-4">
      <GWForm onSubmit={onSubmit} resolver={zodResolver(loginValidationSchema)}>
        <div className="xl:bg-[#121212] w-[400px] xl:w-[600px] shadow-lg py-[80px] rounded-2xl flex justify-center items-center flex-col">
          {/* Logo */}
          <Image
            src={logo}
            width={200}
            height={200}
            alt="logo"
            className="w-16 mb-4"
          />
          <h3 className="text-3xl font-medium mb-8 xl:mb-12 text-white">
            GardenWise
          </h3>

          {/* Email Field */}
          <div className="flex flex-col w-4/5 md:w-3/5 mb-6">
            <GWInput name="email" label="Email" type="email" />
          </div>

          {/* Password Field */}
          <div className="flex flex-col w-4/5 md:w-3/5 mb-6">
            <GWInput name="password" label="Password" type="password" />
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            color="success"
            className="w-4/5 md:w-3/5 py-[10px] px-12 rounded-xl font-bold mt-2"
            disabled={isLoading} // Disable button during loading
            isLoading={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="md:w-fit mt-4 text-gray-400 hover:text-white transition duration-100">
            <Link
              href={"/forget-password"}
              className="hover:border-b border-b border-b-[#121212] hover:border-b-white "
            >
              Forget password?
            </Link>
          </div>

          {/* Sign-Up Link */}
          <p className="text-[#b5b4b4] mt-2">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register`}
              className="hover:cursor-pointer hover:underline hover:text-[#959595]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </GWForm>
    </div>
  );
}
