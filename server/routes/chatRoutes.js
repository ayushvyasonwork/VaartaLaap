const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removefromGroup,
  addInGroup,
  renamegroup,
  fetchGroups,
  groupExit,
  addSelfInGroup,
} = require("../controllers/allChats");
const { auth } = require("../middlewares/auth");

const router = express.Router();
router.route("/creategroup").post(auth,createGroupChat);

router.route("/rename").put(auth, renamegroup);

router.route("/groupremove").put(auth, removefromGroup);

router.route("/groupadd").put(auth, addInGroup);
router.route("/:userId").post(auth, accessChat);

router.route("/").get(auth, fetchChats);
router.get('/fetchgroups',auth,fetchGroups);
router.put('/leavegroup',auth,groupExit);
router.put('/addselfingroup',auth,addSelfInGroup);



module.exports = router;
