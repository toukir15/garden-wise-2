import React, { useState } from "react";
import { useGetFollowSuggetionUsers } from "@/src/hooks/user.hook";
import { useFollowUser } from "@/src/hooks/connection.hook";
import FollowUserCard from "./FollowUserCard";
import { IUser } from "../../../../types";
import FollowSuggetionLoading from "../../loading/FollowSuggetionLoading";

export default function FollowUserList() {
  const { data: followSuggetionUsersData, isLoading } =
    useGetFollowSuggetionUsers();
  const { mutate: handleFollow } = useFollowUser();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleFollowRequest = (user: Partial<IUser>) => {
    if (!user._id) return;
    setLoadingUserId(user._id);
    handleFollow(
      { user: user },
      {
        onSettled: () => {
          setLoadingUserId(null);
        },
      }
    );
  };

  if (isLoading) {
    return <FollowSuggetionLoading />;
  }

  return (
    <div className="h-[calc(100vh-150px)] overflow-y-auto follow_box">
      {followSuggetionUsersData?.data.data.map((user: IUser) => (
        <FollowUserCard
          key={user._id}
          user={user}
          isLoading={loadingUserId === user._id}
          onFollow={handleFollowRequest}
        />
      ))}
    </div>
  );
}
