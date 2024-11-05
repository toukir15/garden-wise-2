import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import React from 'react'
import { IUser } from '../../../types'
import UserList from '../user/UserList'

export default function FollowFollowingListModal({ isOpen, onOpenChange, title, users, loadingUserId, handleUnfollowRequest }: any) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
      <ModalHeader className="flex justify-center gap-1 border-b border-gray-600">
        {title}
      </ModalHeader>
      <ModalBody>
        <div className="h-[400px] overflow-y-scroll scroll_box">
          {users.map((user: Partial<IUser>) => (
            <UserList
              key={user._id}
              user={user}
              loadingUserId={loadingUserId}
              handleUnfollowRequest={handleUnfollowRequest}
            />
          ))}
        </div>
      </ModalBody>
    </ModalContent>
  </Modal>
  )
}
