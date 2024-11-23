import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import Image from 'next/image';
import { useGetFollowSuggetionUsers } from '@/src/hooks/user.hook';
import { Button } from '@nextui-org/button';
import { IUser } from '../../types';

export default function MobileFollowSugg({handleFollowRequest, loadingUserId}:any) {
    const { data: followSuggetionUsersData, isLoading } =
    useGetFollowSuggetionUsers();
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
                 <div className="h-32 w-32">
                   <Image
                     src={user?.profilePhoto}
                     height={500}
                     width={500}
                     className="h-full"
                     alt="User profile photo"
                   />
                 </div>
                 <p className="font-medium text-gray-300">{user.name}</p>
                 <p className="font-medium text-sm text-gray-400">
                   {user.email.slice(0, 12)}...
                 </p>
                 {loadingUserId !== user._id && (
                   <Button
                     variant="solid"
                     color="success"
                     className="w-full block mt-1"
                     radius="none"
                     size="sm"
                     onClick={() => handleFollowRequest(user)}
                   >
                     Follow
                   </Button>
                 )}
                 {loadingUserId === user._id && (
                   <Button
                     variant="solid"
                     color="success"
                     className="w-full block mt-1"
                     radius="none"
                     size="sm"
                   >
                     Following...
                   </Button>
                 )}
               </div>
             </SwiperSlide>
           ))}
         </Swiper>
       </div>
     )}
    </>
  )
}
