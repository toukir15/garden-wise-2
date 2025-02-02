import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { comment, deleteComment, downvote, editComment, upvote } from "../services/comment";
import { IUser, TQueryAndSearch } from "../../types";
import { createConversation, getConversations } from "../services/conversation";

type TCommentPayload = {
    postId: string;
    text: string;
    user: IUser | null;
};

export const useGetConversations = () => {
    return useQuery({
        queryKey: ["conversations"],
        queryFn: async () => {
            return await getConversations();
        },
    });
};


export const useCreateConversation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (conversationData: any) => {
            return await createConversation(conversationData);
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