const express = require("express");
const router = express.Router();
const bookmarkController = require("../controller/bookmark.controller");
const verifyFirebaseAuth = require("../middleware/firebaseAuth");

// Apply session verification middleware to all bookmark routes

router.post("/", verifyFirebaseAuth, bookmarkController.createBookmark);
router.get("/", verifyFirebaseAuth, bookmarkController.getAllBookmarks);
router.get("/:id", verifyFirebaseAuth, bookmarkController.getBookmarkById);
router.put("/:id", verifyFirebaseAuth, bookmarkController.updateBookmark);
router.delete("/:id", verifyFirebaseAuth, bookmarkController.deleteBookmark);

module.exports = router;
