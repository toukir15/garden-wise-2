import Image from 'next/image'
import React from 'react'

export default function UserList({ user, loadingUserId, handleUnfollowRequest }: any) {
  return (
    <div key={user._id} className="flex justify-between items-center py-1.5 border-b border-gray-600">
    <div className="flex gap-3">
     <div className='flex justify-center items-center'>
     <Image
        height={30}
        width={30}
        src={user.profilePhoto}
        alt="profile photo"
        className="rounded-full h-8 w-8"
      />
     </div>
      <div>
        <p className="text-gray-200">{user.name}</p>
        <p className="text-xs text-gray-400">{user.email}</p>
      </div>
    </div>
    <div className="mr-4">
      {loadingUserId !== user._id ? (
        <button
          onClick={() => handleUnfollowRequest(user)}
          className="py-[2px] px-4 text-sm rounded-full bg-gray-600"
        >
          Unfollow
        </button>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  </div>
  )
}
