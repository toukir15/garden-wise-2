/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { MessageServices } from "./message.service";
import { catchAsync } from "../../utils/catchAsync";

const createMessage = catchAsync(async (req, res, next) => {
  const messageData = req.body;
  const result = await MessageServices.createMessageIntoDB(messageData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Send message successfully!",
    data: result,
  });
});

const deleteMessage = catchAsync(async (req, res, next) => {
  const messageId = req.params.messageId;
  const query = req.query;
  const userId = req.user._id;
  const result = await MessageServices.deleteMessageFromDB(
    messageId,
    userId,
    query
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete message successfully!",
    data: result,
  });
});

const updateMessage = catchAsync(async (req, res, next) => {
  const messageId = req.params.messageId;
  const newMessage = req.body.newMessage;
  const result = await MessageServices.updateMessageIntoDB(
    messageId,
    newMessage
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update message successfully!",
    data: result,
  });
});
const updateSeenStatus = catchAsync(async (req, res, next) => {
  const conversationId = req.params.conversationId;
  const receiverId = req.params.receiverId;
  const result = await MessageServices.updateSeenStatusIntoDB(
    conversationId,
    receiverId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update message seen status successfully!",
    data: result,
  });
});

export const MessageControllers = {
  createMessage,
  deleteMessage,
  updateMessage,
  updateSeenStatus,
};
