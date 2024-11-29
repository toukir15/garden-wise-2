import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import { useGetFollowSuggetionUsers } from "@/src/hooks/user.hook";
import { Button } from "@nextui-org/button";
import { IUser } from "../../types";
import { IPostProviderValues, PostContext } from "../context/post.provider";
import MobileFollowSuggLoading from "./loading/MobileFollowSuggLoading";
import Link from "next/link";

export default function MobileFollowSugg({
  isPostsDataLoading,
}: {
  isPostsDataLoading: boolean;
}) {
  const { data: followSuggetionUsersData, isLoading } =
    useGetFollowSuggetionUsers();
  const { postFuncions, postStates } = useContext(
    PostContext
  ) as IPostProviderValues;
  const { handleFollowRequest } = postFuncions;
  const { loadingUserId } = postStates;
  if (isLoading || isPostsDataLoading) {
    return <MobileFollowSuggLoading />;
  }
  return (
    <>
      {followSuggetionUsersData?.data.data.length > 0 && (
        <div className="py-4 block xl:hidden">
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper w-full"
          >
            {followSuggetionUsersData?.data.data.map((user: IUser) => (
              <SwiperSlide>
                <div className="w-32">
                  <Link href={`/profile/${user._id}`}>
                    <div className="h-32 w-32">
                      <Image
                        src={user?.profilePhoto}
                        height={500}
                        width={500}
                        className="h-full"
                        alt="User profile photo"
                      />
                    </div>
                    <p className="font-bold mt-[4px] text-sm md:text-medium text-gray-300">
                      {user.name.slice(0, 10)}...
                    </p>
                    <p className="font-medium text-sm text-gray-400">
                      {user.email.slice(0, 12)}...
                    </p>
                  </Link>
                  <Button
                    variant="solid"
                    color="success"
                    className="w-32 block mt-1"
                    radius="none"
                    size="sm"
                    onClick={(e) => {
                      handleFollowRequest(user);
                      e.stopPropagation();
                    }}
                    isLoading={loadingUserId === user._id}
                  >
                    {loadingUserId !== user._id && "Follow"}
                  </Button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
}
