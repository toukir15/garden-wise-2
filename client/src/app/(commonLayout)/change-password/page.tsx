"use client"; // ক্লায়েন্ট সাইড রেন্ডারিং সক্রিয় করার জন্য

import { useUser } from "@/src/context/user.provider"; 
import Image from "next/image"; 
import "react-quill/dist/quill.snow.css"; 
import { Button, Input, Link } from "@nextui-org/react"; 
import { useForm } from "react-hook-form"; 
import { useChangePassword } from "@/src/hooks/auth.hook";

export default function Page() {
  const { user } = useUser(); 

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const {
    mutate: handleChangePassword,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useChangePassword();
  const onSubmit = (data) => {
    console.log({oldPassword: data.oldPassword, newPassword: data.newPassword})
    handleChangePassword({oldPassword: data.oldPassword, newPassword: data.newPassword})
  };

  const newPassword = watch("newPassword");
  
  return (
    <section className="flex justify-center flex-col items-center h-screen">
      <div className="w-fit">
        <div className="p-4 flex flex-col justify-center items-center w-[500px] gap-4 border-gray-600">
          <Image
            src={user?.profilePhoto}
            className="rounded-full"
            height={150}
            width={150}
            alt="Profile Picture"
          />
          <div className="flex justify-between text-center">
            <div>
              <p className="text-2xl font-bold">{user?.name}</p>
            </div>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              className="mt-4"
              type="password"
              variant="underlined"
              label="Current Password" 
              {...register("oldPassword", { 
                required: "Current password is required", 
                minLength: { value: 6, message: "Current password must be at least 6 characters long" } // কমপক্ষে 6 অক্ষরের হতে হবে
              })}
            />
            {errors.currentPassword && <p className="text-red-500">{errors.currentPassword.message}</p>}

            <Input
              className="mt-4"
              type="password"
              variant="underlined"
              label="New Password" 
              {...register("newPassword", { 
                required: "New password is required", 
                minLength: { value: 6, message: "New password must be at least 6 characters long" }, // কমপক্ষে 6 অক্ষরের হতে হবে
              })}
            />
            {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}

            <Input
              className="mt-4"
              type="password"
              variant="underlined"
              label="Confirm Password" // পাসওয়ার্ড নিশ্চিত করার জন্য লেবেল
              {...register("confirmPassword", { 
                required: "Please confirm your password", // পাসওয়ার্ড নিশ্চিত করা আবশ্যক
                validate: (value) => {
                  // নিশ্চিত পাসওয়ার্ড নতুন পাসওয়ার্ডের সাথে মেলাতে হবে
                  return value === newPassword || "Passwords do not match"; // মেলালে সঠিক, না হলে এরর
                },
                minLength: { value: 6, message: "Confirm password must be at least 6 characters long" } // কমপক্ষে 6 অক্ষরের হতে হবে
              })}
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

            <div className="mt-8 w-full flex gap-4">
              <Button
                className="w-full"
                size="lg"
                color="success"
                variant="faded"
                type="submit" 
              >
                Save Password
              </Button>
              <Link className="w-full" href={"/edit-profile"}>
                <Button
                  className="w-full"
                  size="lg"
                  color="danger"
                  variant="faded"
                  type="button" 
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
