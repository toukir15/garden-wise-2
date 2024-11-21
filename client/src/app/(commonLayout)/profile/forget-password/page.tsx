"use client"; 

import { IUserProviderValues, UserContext, useUser } from "@/src/context/user.provider"; 
import Image from "next/image"; 
import { Button, Link } from "@nextui-org/react"; 
import { useForm } from "react-hook-form"; 
import { useChangePassword } from "@/src/hooks/auth.hook";
import { toast } from "sonner";
import PasswordInput from "@/src/components/form/PasswordInput";
import { useContext, useEffect } from "react"; 
import { useRouter } from "next/navigation";

// Define the interface for the form data
interface IChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Page() {
  const {user} = useContext(UserContext) as IUserProviderValues
  const router = useRouter(); 
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IChangePasswordForm>();
  const {
    mutate: handleChangePassword,
    isSuccess,
    isLoading,
    error,
  } = useChangePassword();

  const onSubmit = (data: IChangePasswordForm) => {
    handleChangePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully changed password!", { duration: 2000, position: "top-right" });
      router.push('/'); 
    }
  }, [isSuccess, router]);

  const newPassword = watch("newPassword");

  return (
    <section className="flex justify-center flex-col items-center h-screen">
      <div className="w-fit">
        <div className="p-4 flex flex-col justify-center items-center w-[500px] gap-4 border-gray-600">
        <div className="relative rounded-full overflow-hidden w-[150px] h-[150px]">
              <Image
                src={
                  user?.profilePhoto ||
                  "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                fill
                className="object-cover"
                alt="df"
              />
            </div>
          <div className="flex justify-between text-center">
            <div>
              <p className="text-2xl font-bold">{user?.name}</p>
              <p className="text-sm text-gray-500 font-bold">{user?.email}</p>
            </div>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <PasswordInput
              label="New Password"
              register={register("newPassword", { 
                required: "New password is required", 
                minLength: { value: 6, message: "New password must be at least 6 characters long" }
              })}
              errors={errors.newPassword}
            />

            <PasswordInput
              label="Confirm Password"
              register={register("confirmPassword", { 
                required: "Please confirm your password",
                validate: (value) => value === newPassword || "Passwords do not match", 
                minLength: { value: 6, message: "Confirm password must be at least 6 characters long" } 
              })}
              errors={errors.confirmPassword}
            />

            <div className="mt-8 w-full flex gap-4">
              <Button
                className="w-full"
                size="lg"
                color="success"
                variant="faded"
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Password"}
              </Button>
              <Link className="w-full" href="/profile/edit-profile">
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
