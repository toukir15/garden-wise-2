import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import React from 'react'
import { IUser } from '../../../types'
import UserList from '../user/UserList'
import { FaUserCircle } from 'react-icons/fa'

export default function FollowFollowingListModal({ isOpen, onOpenChange, title, users, loadingUserId, handleUnfollowRequest }: any) {
  console.log(title)
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
      <ModalHeader className="flex justify-center gap-1 border-b border-gray-600">
        {title}
      </ModalHeader>
      <ModalBody>
        <div className="h-[400px] overflow-y-auto scroll_box">
          {users.map((user: Partial<IUser>) => (
            <UserList
              key={user._id}
              user={user}
              loadingUserId={loadingUserId}
              handleUnfollowRequest={handleUnfollowRequest}
            />
          ))}
         {users.length < 1 && title === "Followings" && (
              <div className="h-full flex justify-center items-center  p-4 rounded-lg shadow-md">
                <p className="text-gray-600 text-xl">You have no followings</p>
              </div>
            )}
            {users.length < 1 && title === "Followers" && (
              <div className="h-full flex justify-center items-center  p-4 rounded-lg shadow-md">
                <p className="text-gray-600 text-xl">You have no followers</p>
              </div>
            )}
        </div>
      </ModalBody>
    </ModalContent>
  </Modal>
  )
}