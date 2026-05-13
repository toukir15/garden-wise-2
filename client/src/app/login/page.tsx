"use client";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form";
import GWInput from "@/src/components/form/GWInput";
import GWForm from "@/src/components/form/GWForm";
import { useUserLogin } from "@/src/hooks/auth.hook";
import { loginValidationSchema } from "@/src/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import logo from "../../../public/plant.png";
import { Button } from "@nextui-org/button";
import { socket } from "@/src/socket";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function PrefillButtons() {
  const { setValue } = useFormContext();

  const handlePrefill = (role: "admin" | "user") => {
    const credentials = {
      admin: { email: "admin@gmail.com", password: "123456" },
      user: { email: "user@gmail.com", password: "123456" },
    };
    setValue("email", credentials[role].email);
    setValue("password", credentials[role].password);
  };

  return (
    <div className="mt-6 flex gap-4">
      <Button
        type="button"
        color="warning"
        className="px-4 py-2"
        onPress={() => handlePrefill("admin")}
      >
        Login as Admin
      </Button>
      <Button
        type="button"
        color="secondary"
        className="px-4 py-2"
        onPress={() => handlePrefill("user")}
      >
        Login as User
      </Button>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useContext(UserContext) as IUserProviderValues;

  const {
    mutate: handleUserLogin,
    isSuccess,
    isLoading,
    isError,
    error,
    data,
  } = useUserLogin();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleUserLogin(data);
  };

  useEffect(() => {
    if (isSuccess) {
      try {
        const token = Cookies.get("accessToken");
        if (token) {
          const decoded: any = jwtDecode(token);
          setUser({
            _id: decoded._id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            profilePhoto: decoded.profilePhoto,
            isVerified: decoded.isVerified,
            bookmark: decoded.bookmark,
            address: decoded.address,
          });
          socket.emit("user", { _id: decoded._id });
          socket.emit("online");
        }
      } catch {}
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

          <p className="text-3xl font-medium mb-8 xl:mb-12 text-white">
            GardenWise
          </p>

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
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="md:w-fit mt-4 text-gray-400 hover:text-white transition duration-100">
            <Link
              href={"/send-email"}
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

          <PrefillButtons />
        </div>
      </GWForm>
    </div>
  );
}
