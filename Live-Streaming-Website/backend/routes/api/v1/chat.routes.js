const express = require("express");
const router = express.Router();
const chatController = require("../../../controllers/chat.controller");
const auth = require("../../../middleware/auth");
const roleCheck = require("../../../middleware/roleCheck");

router.use(auth); // Uncomment when auth middleware is ready

router.post("/send", chatController.sendMessage);
router.get("/:streamId", chatController.fetchMessages);
// Ban user from chat
router.post("/ban", roleCheck.isStreamer, chatController.banUser);
// Delete chat message
router.delete(
  "/message/:messageId",
  roleCheck.isStreamer,
  chatController.deleteMessage
);
// Chat analytics for a stream
router.get("/:streamId/analytics", chatController.getChatAnalytics);

module.exports = router;
