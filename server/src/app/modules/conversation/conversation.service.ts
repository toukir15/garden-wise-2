import { Conversation } from "./conversation.model";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";


const createConversationIntoDB = async (payload: any, userId: string) => {
  const result = await Conversation.create({ participants: [payload.otherUserId, userId] })

  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { conversations: result._id } },
  );
  await User.findByIdAndUpdate(
    payload.otherUserId,
    { $addToSet: { conversations: result._id } },
  );
  return result
}
const getConversationsFromDB = async (currentUser: JwtPayload) => {
  const user = await User.findById(currentUser._id);
  if (!user) return [];

  const conversations = await Conversation.find({
    _id: { $in: user.conversations }
  })
    .populate({
      path: "messages",
      model: "Message",
    })
    .populate({
      path: "participants",
      model: "User",
    });

  const sortedConversation = conversations.sort(
    (a: any, b: any) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
  );

  const formattedConversations = sortedConversation.map((conversation) => {
    const sortedMessages: any = conversation.messages.sort(
      (a: any, b: any) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
    );
    const otherParticipant: any = conversation.participants.find(
      (participant: any) => participant._id.toString() !== user._id.toString()
    );

    return {
      _id: conversation._id,
      otherParticipant: {
        _id: otherParticipant._id,
        name: otherParticipant.name,
        profilePhoto: otherParticipant.profilePhoto
      },
      lastMessage: {
        _id: sortedMessages[0]?._id,
        text: sortedMessages[0]?.text,
        senderId: sortedMessages[0]?.senderId,
        isSeen: sortedMessages[0]?.isSeen,
        isRemove: sortedMessages[0]?.isRemove,
        createdAt: sortedMessages[0]?.createdAt,
      },
    };
  });
  formattedConversations.sort(
    (a, b) => new Date(b?.lastMessage?.createdAt).getTime() - new Date(a?.lastMessage?.createdAt).getTime()
  );
  return formattedConversations;
};

export const ConversationServices = {
  getConversationsFromDB,
  createConversationIntoDB
};
