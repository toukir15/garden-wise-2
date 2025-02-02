import { ISocketProviderValues, SocketContext } from "@/src/context/socket.provider";
import { IUserProviderValues, UserContext } from "@/src/context/user.provider";
import { useGetMessages, useSendMessage } from "@/src/hooks/message.hook";
import { socket } from "@/src/socket";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/modal";
import { Button, Spinner } from "@nextui-org/react";
import React, { useContext, useEffect, useRef, useState } from "react";

interface Message {
    _id: number;
    text: string;
    senderId: string;
    createAt: string
}

export default function MessageModal({ isOpen, onClose, conversation, receiverId }: { isOpen: boolean; onClose: () => void, conversation: any, receiverId: string }) {
    const { data: messageData, isLoading, isError } = useGetMessages(conversation._id);
    const { mutate, isSuccess, data } = useSendMessage();
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useContext(UserContext) as IUserProviderValues;
    const { activeUsers, isTyping } = useContext(SocketContext) as ISocketProviderValues;

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data?.data, messageData]);

    const sendMessage = async () => {
        if (message.trim() === "" || !user?._id) return;
        const messageData = {
            text: message,
            senderId: user?._id,
            receiverId,
            isSeen: {
                [user!._id]: false,
                [receiverId]: false
            },
            isRemove: {
                [user!._id]: false,
                [receiverId]: false
            },
        };
        mutate({ messageData, conversationId: conversation._id });
        setMessage("");
    };

    if (isSuccess) {
        socket.emit("message", data.data);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    // Typing tracking (Optimized)
    useEffect(() => {
        if (message.length > 0) {
            socket.emit("typing", { id: conversation.otherParticipant._id, isTyping: true });
        } else {
            socket.emit("typing", { id: conversation.otherParticipant._id, isTyping: false });
        }
    }, [message]);

    const checkOnline = activeUsers.some((user: any) => user._id == conversation.otherParticipant._id);

    return (
        <Modal
            className="fixed -bottom-14 -right-5 w-96 h-[500px] max-w-full z-[999]"
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <ModalContent className="rounded-lg shadow-xl bg-gray-900 border border-gray-700 overflow-hidden">
                {/* Modal Header */}
                <ModalHeader className="flex items-center gap-3 px-2 py-1 bg-gray-800 border-b border-gray-700 text-white text-sm">
                    <div className={`w-8 h-8 rounded-full border-[2px] ${checkOnline ? "border-green-500" : "border-gray-400"} overflow-hidden`}>
                        <img src={conversation.otherParticipant.profilePhoto} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-base font-semibold">{conversation.otherParticipant.name}</p>
                        {!isTyping && <p className={`text-xs ${checkOnline ? "text-green-400" : "text-gray-400"} `}>{checkOnline ? "Online" : "Offline"}</p>}
                        {isTyping && <p className={`text-xs font-normal text-gray-400 `}>Typing...</p>}
                    </div>
                </ModalHeader>

                {/* Modal Body (Messages) */}
                <ModalBody className="p-4 max-h-[400px] gap-2 message_body overflow-y-auto bg-gray-900">
                    {isLoading && <div className="flex justify-center items-center h-full">
                        <div className="text-center absolute translate-y-1/2 text-gray-400"><Spinner size="sm" color="success"></Spinner></div>
                    </div>}
                    {isError && <p className="text-center text-red-500">Failed to load messages</p>}
                    {!isLoading && !isError && messageData?.data.map((msg: Message) => (
                        <div
                            key={msg._id}
                            className={`px-4 py-2 max-w-[75%] rounded-lg shadow-md text-sm ${msg.senderId == user?._id
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-gray-700 text-gray-200"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </ModalBody>

                {/* Modal Footer (Input Field & Send Button) */}
                <ModalFooter className="flex items-center gap-2 border-t border-gray-700 p-1 text-sm">
                    <input
                        type="text"
                        className="w-full py-2 pl-3 outline-none mx-1 rounded bg-[#2a313c]"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button
                        onClick={sendMessage}
                        className="bg-green-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-green-600"
                    >
                        Send
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
