import { Router } from "express";
import { MessageControllers } from "./message.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";

const router = Router();

router.post("/", MessageControllers.createMessage);
router.get("/:conversationId", MessageControllers.getMessages);
router.delete("/:messageId", auth(USER_ROLE.admin, USER_ROLE.user), MessageControllers.deleteMessage);
router.patch("/:messageId", MessageControllers.updateMessage);
router.patch(
  "/seen/:conversationId/:receiverId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  MessageControllers.updateSeenStatus
);

export const MessageRouter = router;
