"use client";

import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import Image from "next/image";
import { Button, Link } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useChangePassword, useSendForgetEmail } from "@/src/hooks/auth.hook";
import { toast } from "sonner";
import PasswordInput from "@/src/components/form/PasswordInput";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

interface IChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Page() {
  const { user } = useContext(UserContext) as IUserProviderValues;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IChangePasswordForm>();

  const {
    mutate: handleChangePassword,
    isSuccess,
    isLoading,
    error,
  } = useChangePassword();

  const onSubmit = (data: IChangePasswordForm) => {
    handleChangePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully changed password!", {
        duration: 2000,
        position: "top-right",
      });
      router.push("/");
    }
  }, [isSuccess, router]);

  const { mutate: sendForgetEmail, isSuccess: isSendForgetEmailSuccess } =
    useSendForgetEmail();

  useEffect(() => {
    if (isSendForgetEmailSuccess) {
      toast.success("Check your email and change the password!", {
        duration: 2000,
      });
    }
  }, [isSendForgetEmailSuccess]);

  const newPassword = watch("newPassword");

  return (
    <section className="flex justify-center flex-col items-center h-screen px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        <div className="p-3 xl:p-6 flex flex-col justify-center items-center gap-6 rounded-lg shadow-lg">
          <div className="relative rounded-full overflow-hidden w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40">
            <Image
              src={
                user?.profilePhoto ||
                "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              fill
              className="object-cover"
              alt="Profile Picture"
            />
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-bold">
              {user?.name}
            </p>
            <p className="text-sm sm:text-base text-gray-500 font-semibold">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="xl:mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PasswordInput
              label="Current Password"
              register={register("oldPassword", {
                required: "Current password is required",
                minLength: {
                  value: 6,
                  message:
                    "Current password must be at least 6 characters long",
                },
              })}
              errors={errors.oldPassword}
            />
            {error && (
              <p className="text-red-500">Incorrect current password.</p>
            )}
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
                  message:
                    "Confirm password must be at least 6 characters long",
                },
              })}
              errors={errors.confirmPassword}
            />
            <div className="mt-8 xl:mt-6 flex flex-col gap-4 sm:flex-row">
              <Button
                className="w-full"
                size="lg"
                color="success"
                variant="faded"
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "Saving..." : "Save Password"}
              </Button>
              <Link href="/profile/edit-profile" className="w-full">
                <Button
                  className="w-full"
                  size="lg"
                  color="danger"
                  variant="faded"
                  type="button"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
