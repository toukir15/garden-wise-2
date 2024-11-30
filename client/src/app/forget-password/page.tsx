"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@nextui-org/react";
import PasswordInput from "@/src/components/form/PasswordInput";
import { useEffect } from "react";
import { useForgetPassword } from "@/src/hooks/auth.hook";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

interface IResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export default function ForgetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const decoded: any = jwtDecode(token as string);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IResetPasswordForm>();

  const {
    mutate: resetPassword,
    isLoading,
    isSuccess,
    error,
  } = useForgetPassword();

  const newPassword = watch("newPassword");

  const onSubmit = (data: IResetPasswordForm) => {
    if (!token) {
      toast.error("Invalid or expired token.", { position: "top-right" });
      return;
    }

    resetPassword({
      token,
      newPassword: data.newPassword,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password reset successfully!", {
        duration: 2000,
        position: "top-right",
      });
      router.push("/login");
    }
  }, [isSuccess, router]);

  return (
    <section className="flex justify-center items-center h-screen px-4 sm:px-6 md:px-8 bg-black">
      <div className="w-full max-w-lg  shadow-xl rounded-lg  space-y-6">
        {/* Profile Picture and User Info */}
        <div className="text-center">
          <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden shadow-lg">
            <Image
              src={
                decoded?.profilePhoto ||
                "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              fill
              className="object-cover"
              alt="Profile Picture"
            />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">
            {decoded?.name}
          </h3>
          <p className="text-gray-400">{decoded?.email}</p>
        </div>

        {/* Password Reset Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <PasswordInput
            label="New Password"
            register={register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "New password must be at least 6 characters long",
              },
            })}
            errors={errors.newPassword}
          />
          <PasswordInput
            label="Confirm Password"
            register={register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
              minLength: {
                value: 6,
                message: "Confirm password must be at least 6 characters long",
              },
            })}
            errors={errors.confirmPassword}
          />
          <Button
            className="w-full"
            size="lg"
            color="success"
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
          {error && (
            <p className="text-red-400 text-center">
              Error: {error.message || "Unable to reset password."}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
