import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/modal";
import React, { useState } from "react";
import profilePhoto from "../../../public/toukir.jpg"
import MessageModal from "./MessageModal";

const chats = [
    { id: 1, name: "Department of Management", message: "MD Rabiul Hasan...", time: "6h", unread: true },
    { id: 2, name: "Md Robiul Islam", message: "Reacted 😆 to your message", time: "19h", unread: false },
    { id: 3, name: "Nazmul Hossain", message: "You: Khelbi 😁", time: "20h", unread: false },
    { id: 4, name: "Callbridge", message: "MD Sojib sent a voice message", time: "21h", unread: true },
    { id: 5, name: "Md Ashikur Rahman", message: "You: Ay", time: "22h", unread: false },
    { id: 6, name: "Johir Ray Han", message: "..", time: "23h", unread: false },
    { id: 7, name: "MD Afzal", message: "You: 👍", time: "1d", unread: true },
    { id: 8, name: "MD Shajidur Rahaman Joy", message: "sent an attachment", time: "2d", unread: false },
    { id: 9, name: "গি ফু ' ত", message: "You: Koi tui", time: "2d", unread: true },
    { id: 10, name: "Tomal Baidya", message: "You: Tomal", time: "2d", unread: false },
];

export default function ConversationalModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { isOpen: isMessageOpen, onOpen: messageOnOpen, onClose: messageOnClose } = useDisclosure();
    return (
        <div>
            <Modal
                className="fixed -bottom-14 -right-5 w-[340px] h-[90%] border border-gray-600 max-w-full z-[999]"
                isOpen={isOpen}
                onOpenChange={(open) => !open && onClose()}
            >
                <ModalContent className="rounded-lg shadow-lg ml-auto">
                    <ModalHeader className="border-b border-gray-600  text-2xl font-semibold flex items-center justify-between p-3">
                        Chats
                    </ModalHeader>

                    {/* Chat List */}
                    <ModalBody className=" max-h-[94%] gap-0 overflow-y-auto py-0 px-0">
                        {chats.map((chat) => (
                            <div onClick={() => {
                                messageOnOpen()
                            }} key={chat.id} className="flex hover:bg-[#202022] transition duration-200 py-3 border-b border-gray-800 px-2 items-center gap-3 cursor-pointer ">
                                <img src="/toukir.jpg" alt={chat.name} className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{chat.name}</h4>
                                    <p className="text-gray-500 text-xs truncate">{chat.message}</p>
                                </div>
                                <div className="text-xs text-gray-400">{chat.time}</div>
                            </div>
                        ))}
                    </ModalBody>
                </ModalContent>
            </Modal>
            <MessageModal
                isOpen={isMessageOpen}
                onClose={messageOnClose}
            />
        </div>
    );
}
