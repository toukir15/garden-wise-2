import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../services/message";
import { useEffect } from "react";
import { socket } from "../socket";


export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ messageData, conversationId }: any) => {
            return await sendMessage(messageData);
        },

        onSuccess: async (data) => {
            queryClient.invalidateQueries(["conversations"], {
                exact: true,
            });
            queryClient.invalidateQueries(["messages", data.data.conversationId], {
                exact: true,
            });
        },
    });
};

export const useGetMessages = (conversationId: string) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["messages", conversationId],
        queryFn: async () => {
            return await getMessages(conversationId);
        },
    });

    useEffect(() => {
        if (!conversationId) return;

        const handleNewMessage = (id: string) => {
            queryClient.invalidateQueries(["messages", id]);
        };

        // Socket event listener
        socket.on("message", handleNewMessage);

        return () => {
            socket.off("message", handleNewMessage);
        };
    }, [conversationId, queryClient]);

    return query;
};
