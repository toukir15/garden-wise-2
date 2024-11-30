"use client";

import { useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useSendForgetEmail } from "@/src/hooks/auth.hook";
import { useEffect } from "react";
import { toast } from "sonner";

interface IForgetEmailForm {
  email: string;
}

export default function SendEmailPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgetEmailForm>();

  const { mutate: sendForgetEmail, isSuccess: isSendForgetEmailSuccess } =
    useSendForgetEmail();

  useEffect(() => {
    if (isSendForgetEmailSuccess) {
      toast.success("Check your email and change the password!", {
        duration: 2000,
      });
    }
  }, [isSendForgetEmailSuccess]);

  const onSubmit = (data: IForgetEmailForm) => {
    sendForgetEmail(data);
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#121212] shadow-lg rounded-2xl p-6 space-y-4"
        >
          <h1 className="text-xl font-medium text-gray-300 border-b pb-4">
            Enter your email to receive a verification link.
          </h1>
          <div className="space-y-2">
            <Input
              type="email"
              id="email"
              label="Email Address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              errorMessage={errors.email?.message}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Button type="submit" className="w-full" size="lg" color="success">
              Send Verification Email
            </Button>
          </div>
          <p className="text-[#b5b4b4] mt-3 md:mt-4">
            Already have an account?{" "}
            <Link
              href={`/login`}
              className="hover:cursor-pointer hover:underline hover:text-[#959595]"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
