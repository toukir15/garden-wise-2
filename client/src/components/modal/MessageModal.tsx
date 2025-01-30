import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/modal";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";

interface Message {
    id: number;
    text: string;
    sender: "me" | "other";
}

export default function MessageModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hey! How are you?", sender: "other" },
        { id: 2, text: "I'm good! What about you?", sender: "me" },
        { id: 3, text: "I'm doing great! Thanks for asking.", sender: "other" },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (input.trim() === "") return;
        setMessages([...messages, { id: messages.length + 1, text: input, sender: "me" }]);
        setInput("");
    };

    return (
        <Modal
            className="fixed -bottom-14 -right-5 w-96 h-[500px] max-w-full z-[999]"
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <ModalContent className="rounded-lg shadow-xl bg-gray-900 border border-gray-700 overflow-hidden">
                <ModalHeader className="flex items-center gap-3 px-2 py-1 bg-gray-800 border-b border-gray-700 text-white text-sm">
                    <div className="w-8 h-8 rounded-full border-[2px] border-green-500 overflow-hidden">
                        <img src="/toukir.jpg" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-base font-semibold">Toukir Ahmed</p>
                        <p className="text-xs text-green-400">Online</p>
                    </div>
                </ModalHeader>
                <ModalBody className="p-4 max-h-[400px] gap-2 message_body overflow-y-auto bg-gray-900 ">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`px-4 py-2 max-w-[75%] rounded-lg shadow-md text-sm ${msg.sender === "me"
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-gray-700 text-gray-200"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </ModalBody>
                <ModalFooter className="flex items-center gap-2 border-t border-gray-700 p-1 text-sm">
                    {/* <Input
                        className="flex-1 rounded-md text-white border-none focus:ring-2 focus:ring-blue-400 px-2 py-1"
                        color="default"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    /> */}
                    <input type="text" className="w-full py-2 pl-3 outline-none mx-1 rounded bg-[#2a313c]" placeholder="Type a message..." value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
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
