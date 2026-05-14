import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import React from 'react'
import { IUser } from '../../../types'
import UserList from '../shared/UserList'
import { Spinner } from '@nextui-org/react'

export default function FollowFollowingListModal({
  isOpen,
  onOpenChange,
  title,
  data,
  users: propUsers,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  loadingUserId,
  handleUnfollowRequest,
  actionType,
}: any) {
  const users: IUser[] = propUsers ?? data?.pages?.flatMap((page: any) =>
    title === "Followers"
      ? page?.data?.data?.followers ?? []
      : page?.data?.data?.followings ?? []
  ) ?? [];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 80 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Modal isOpen={isOpen} className='w-full h-full xl:h-auto absolute z-[999]' onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex justify-center gap-1 border-b border-gray-600">
          {title}
        </ModalHeader>
        <ModalBody>
          <div onScroll={handleScroll} className="h-[400px] overflow-y-auto scroll_box">
            {isLoading && (
              <div className="flex justify-center items-center h-full">
                <Spinner size="md" color="success" />
              </div>
            )}

            {users.map((user: Partial<IUser>) => (
              <UserList
                key={user._id}
                user={user}
                loadingUserId={loadingUserId}
                handleUnfollowRequest={handleUnfollowRequest}
                actionType={actionType}
              />
            ))}

            {isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <Spinner size="sm" color="success" />
              </div>
            )}

            {!isLoading && users.length === 0 && title === "Followings" && (
              <div className="h-full flex justify-center items-center p-4">
                <p className="text-gray-600 text-xl">You have no followings</p>
              </div>
            )}
            {!isLoading && users.length === 0 && title === "Followers" && (
              <div className="h-full flex justify-center items-center p-4">
                <p className="text-gray-600 text-xl">You have no followers</p>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
