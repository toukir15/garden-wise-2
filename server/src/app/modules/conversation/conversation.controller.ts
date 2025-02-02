/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { ConversationServices } from "./conversation.service";
import { catchAsync } from "../../utils/catchAsync";

const createConversation = catchAsync(async (req, res, next) => {
  const userId = req.user._id
  const result = await ConversationServices.createConversationIntoDB(req.body, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrive conversations successfully!",
    data: result,
  });
});

const getConversations = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  const result = await ConversationServices.getConversationsFromDB(currentUser);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrive conversations successfully!",
    data: result,
  });
});

export const ConversationControllers = {
  getConversations,
  createConversation
};
