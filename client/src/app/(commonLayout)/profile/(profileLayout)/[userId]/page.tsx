"use client";

import { useContext } from "react";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { useGetUser } from "@/src/hooks/user.hook";
import MyProfile from "@/src/components/shared/Profile/MyProfile";
import VisitUserProfile from "@/src/components/shared/Profile/VisitUserProfile";
import ProfileLoading from "@/src/components/loading/ProfileLoading";

export default function Page({ params }: any) {
  const { user } = useContext(UserContext) as IUserProviderValues;
  const { userId } = params;
  const { data, isLoading } = useGetUser(userId);

  if (isLoading) {
    return <ProfileLoading />;
  }

  return (
    <div className=" border-x border-gray-700">
      {userId === user?._id ? (
        <MyProfile user={data?.data?.data} />
      ) : (
        <VisitUserProfile />
      )}
    </div>
  );
}
