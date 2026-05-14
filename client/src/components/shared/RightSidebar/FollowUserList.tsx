import React, { useState } from "react";
import { useGetFollowSuggetionUsers } from "@/src/hooks/user.hook";
import { useFollowUser } from "@/src/hooks/connection.hook";
import FollowUserCard from "./FollowUserCard";
import { IUser } from "../../../../types";
import FollowSuggetionLoading from "../../loading/FollowSuggetionLoading";
import { Spinner } from "@nextui-org/react";

export default function FollowUserList({ searchTerm = "" }: { searchTerm?: string }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetFollowSuggetionUsers();
  const { mutate: handleFollow } = useFollowUser();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const allUsers: IUser[] = data?.pages?.flatMap((page: any) => page?.data?.data?.users ?? []) ?? [];
  const visibleUsers = searchTerm.trim()
    ? allUsers.filter((u) => u.name.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    : allUsers;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 80 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleFollowRequest = (user: Partial<IUser>) => {
    if (!user._id) return;
    setLoadingUserId(user._id);
    handleFollow(
      { user },
      { onSettled: () => setLoadingUserId(null) }
    );
  };

  if (isLoading) return <FollowSuggetionLoading />;

  return (
    <div onScroll={handleScroll} className="flex flex-col flex-1 min-h-0 overflow-y-auto follow_box">
      {visibleUsers.map((user: IUser) => (
        <FollowUserCard
          key={user._id}
          user={user}
          isLoading={loadingUserId === user._id}
          onFollow={handleFollowRequest}
        />
      ))}

      {isFetchingNextPage && (
        <div className="flex justify-center py-3">
          <Spinner size="sm" color="success" />
        </div>
      )}
    </div>
  );
}
