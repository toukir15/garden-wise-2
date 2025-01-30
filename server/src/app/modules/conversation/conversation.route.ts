import { Router } from "express";
import { ConversationControllers } from "./conversation.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";

const router = Router();

router.get("/:id", auth(USER_ROLE.admin, USER_ROLE.user), ConversationControllers.getConversation);
router.get("/", auth(USER_ROLE.admin, USER_ROLE.user), ConversationControllers.getConversations);

export const ConversationRouter = router;
