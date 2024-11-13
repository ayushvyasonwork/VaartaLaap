const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messages");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.route("/:chatId").get(auth, allMessages);
router.route("/sendmessage").post(auth, sendMessage);

module.exports = router;
