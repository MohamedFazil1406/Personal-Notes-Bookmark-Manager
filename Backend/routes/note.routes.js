const express = require("express");
const router = express.Router();
const noteController = require("../controller/note.controller");
const verifyFirebaseAuth = require("../middleware/firebaseAuth");

router.post("/", verifyFirebaseAuth, noteController.createNote);
router.get("/", verifyFirebaseAuth, noteController.getAllNotes);
router.get("/:id", verifyFirebaseAuth, noteController.getNoteById);
router.put("/:id", verifyFirebaseAuth, noteController.updateNote);
router.delete("/:id", verifyFirebaseAuth, noteController.deleteNote);

module.exports = router;
