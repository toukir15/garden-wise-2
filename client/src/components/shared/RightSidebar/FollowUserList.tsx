import React, { useState, useEffect, useRef } from "react";
import { useGetFollowSuggetionUsers } from "@/src/hooks/user.hook";
import { useFollowUser } from "@/src/hooks/connection.hook";
import FollowUserCard from "./FollowUserCard";
import { IUser } from "../../../../types";
import FollowSuggetionLoading from "../../loading/FollowSuggetionLoading";
import { Spinner } from "@nextui-org/react";

const PAGE_SIZE = 5;

export default function FollowUserList() {
  const { data: followSuggetionUsersData, isLoading } = useGetFollowSuggetionUsers();
  const { mutate: handleFollow } = useFollowUser();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const allUsers: IUser[] = followSuggetionUsersData?.data.data ?? [];
  const visibleUsers = allUsers.slice(0, visibleCount);
  const hasMore = visibleCount < allUsers.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((c) => c + PAGE_SIZE);
            setIsLoadingMore(false);
          }, 400);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

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
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto follow_box">
      {visibleUsers.map((user: IUser) => (
        <FollowUserCard
          key={user._id}
          user={user}
          isLoading={loadingUserId === user._id}
          onFollow={handleFollowRequest}
        />
      ))}

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-2" />

      {isLoadingMore && (
        <div className="flex justify-center py-3">
          <Spinner size="sm" color="success" />
        </div>
      )}
    </div>
  );
}
