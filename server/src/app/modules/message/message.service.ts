import mongoose from "mongoose";
import { Conversation } from "../conversation/conversation.model";
import { User } from "../user/user.model";
import { TMessage, TMessageDeleteQuery } from "./message.interface";
import { Message } from "./message.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createMessageIntoDB = async (payload: TMessage) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Save the message into the database
    const createMessage = await Message.create([payload], { session });

    // Check if a conversation with the same participants already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [createMessage[0].senderId, payload.receiverId] },
    }).session(session);

    // If no existing conversation, create a new one
    if (!conversation) {
      const [newConversation] = await Conversation.create(
        [
          {
            participants: [createMessage[0].senderId, payload.receiverId],
          },
        ],
        { session }
      );
      conversation = newConversation;

      // Update conversation IDs in the user collection
      await User.findByIdAndUpdate(
        createMessage[0].senderId,
        { $addToSet: { conversations: conversation._id } },
        { new: true, session }
      );

      await User.findByIdAndUpdate(
        payload.receiverId,
        { $addToSet: { conversations: conversation._id } },
        { new: true, session }
      );
    }

    // Update conversationId in the message collection
    const updateMessage = await Message.findByIdAndUpdate(
      createMessage[0]._id,
      { conversationId: conversation._id },
      { new: true, session }
    );

    // push message id into coversation collection
    await Conversation.findByIdAndUpdate(
      updateMessage?.conversationId,
      {
        $addToSet: { messages: updateMessage?._id },
      },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return updateMessage;
  } catch (error) {
    // Abort the transaction and rollback
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Provide inconsistant data");
  }
};

const getMessagesFromDB = async (conversationId: string) => {
  const result = await Message.find({ conversationId: conversationId })
  return result
}

const deleteMessageFromDB = async (
) => {

};

const updateMessageIntoDB = async () => {

};

const updateSeenStatusIntoDB = async (

) => {

};

export const MessageServices = {
  createMessageIntoDB,
  deleteMessageFromDB,
  updateMessageIntoDB,
  updateSeenStatusIntoDB,
  getMessagesFromDB
};
