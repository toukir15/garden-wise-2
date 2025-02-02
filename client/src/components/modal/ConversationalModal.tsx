import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/modal";
import React, { useState, useEffect } from "react";
import MessageModal from "./MessageModal";
import { calculateTime } from "@/src/utils/calculateTime";
import { Select } from "antd";
import { useGetUsers } from "@/src/hooks/admin.hook";
import { useCreateConversation } from "@/src/hooks/conversation.hook";
import { toast } from "sonner";

export default function ConversationalModal({
    isOpen,
    onClose,
    onOpen,
    conversationsData,
    isConversetionalDataLoading
}: {
    isOpen: boolean;
    onClose: () => void;
    onOpen: any;
    conversationsData: any;
    isConversetionalDataLoading: boolean
}) {
    const [conversation, setConversation] = useState<any>(null);
    const [receiverId, setReceiverId] = useState("");
    const { isOpen: isMessageOpen, onOpen: messageOnOpen, onClose: messageOnClose } = useDisclosure();
    const { data: userData } = useGetUsers();
    const { mutate, isSuccess } = useCreateConversation();

    const handleUserSelect = (value: string) => {
        const selectedChat = conversationsData?.data?.find(
            (chat: any) => chat.otherParticipant._id === value
        );

        if (!selectedChat) {
            mutate({ otherUserId: value });
            onOpen()
        } else {
            messageOnOpen()
            onOpen()
            setConversation(selectedChat)
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Conversation added successfully!", { duration: 2000 })
        }
    }, [isSuccess])

    return (
        <div>
            <Modal
                className="fixed -right-5 w-[340px] h-screen border border-gray-600 max-w-full z-[999]"
                isOpen={isOpen}
                onOpenChange={(open) => !open && onClose()}
            >
                <ModalContent className="rounded-lg shadow-lg ml-auto">
                    <ModalHeader className="border-b border-gray-600 text-2xl font-semibold flex flex-col p-3 gap-2">
                        <span>Chats</span>
                        <Select
                            showSearch
                            placeholder="Search user..."
                            optionFilterProp="label"
                            style={{ width: "100%" }}
                            onChange={handleUserSelect}
                            size="middle"
                            filterOption={(input, option: any) =>
                                option?.label?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {userData?.data?.data?.map((user: any) => (
                                <Select.Option key={user._id} value={user._id} label={user.name}>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={user.profilePhoto}
                                            alt={user.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-[15px] font-medium">{user.name}</span>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>


                    </ModalHeader>

                    <ModalBody className="max-h-[90%] gap-0 overflow-y-auto py-0 px-0">
                        {conversationsData?.isLoading ? (
                            // Skeleton Loader
                            [...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex animate-pulse py-3 border-b border-gray-800 px-2 items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-700 rounded w-32 mb-1"></div>
                                        <div className="h-3 bg-gray-700 rounded w-20"></div>
                                    </div>
                                    <div className="h-3 bg-gray-700 rounded w-10"></div>
                                </div>
                            ))
                        ) : (
                            conversationsData?.data?.map((chat: any) => (
                                <div
                                    onClick={() => {
                                        messageOnOpen();
                                        setReceiverId(chat.otherParticipant._id);
                                        setConversation(chat);
                                    }}
                                    key={chat.otherParticipant._id}
                                    className="flex hover:bg-[#202022] transition duration-200 py-3 border-b border-gray-800 px-2 items-center gap-3 cursor-pointer"
                                >
                                    <img
                                        src={chat.otherParticipant.profilePhoto}
                                        alt={chat.otherParticipant.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm">{chat.otherParticipant.name}</h4>
                                        <p className="text-xs text-start">
                                            {chat.lastMessage?.text?.slice(0, 25)}
                                            {chat.lastMessage?.text?.length > 25 && "..."}
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {calculateTime(chat.lastMessage?.createdAt)}
                                    </div>
                                </div>
                            ))
                        )}
                        {conversationsData?.data.length < 1 && !isConversetionalDataLoading && <div className="text-center text-gray-400 py-5">
                            No conversations available
                        </div>}

                    </ModalBody>
                </ModalContent>
            </Modal>

            {conversation?._id && (
                <MessageModal
                    isOpen={isMessageOpen}
                    onClose={messageOnClose}
                    conversation={conversation}
                    receiverId={receiverId}
                />
            )}
        </div>
    );
}