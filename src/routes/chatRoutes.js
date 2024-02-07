const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { authenticateUserToken } = require("../utils/userAuthMiddleware");
const { authenticateToken } = require("../utils/middleware");

router.get("/chats", authenticateUserToken, chatController.getChats);

router.get("/admin/chats", authenticateToken, chatController.getChatsForAdmin);

router.get(
  "/admin/chats/:chatId/messages",
  authenticateToken,
  chatController.getMessagesForAdminChat
);

router.post("/chats/:chatId/admin/messages", authenticateToken, chatController.sendMessageForAdmin);

router.get("/chats/:chatId/messages", authenticateUserToken, chatController.getMessages);

router.post("/chats/:chatId/messages", authenticateUserToken, chatController.addMessage);

router.post("/chats/startOrContinue", authenticateUserToken, chatController.startOrContinueChat);

router.post("/chats/:chatId/assign-admin", authenticateToken, chatController.assignAdminToChat);

module.exports = router;
