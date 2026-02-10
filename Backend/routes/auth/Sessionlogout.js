const express = require("express");
const router = express.Router();
const admin = require("../../firebaseadmin");

// POST /api/session-logout
router.post("/session-logout", async (req, res) => {
  try {
    // Clear the session cookie
    res.clearCookie("session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Session logout successful" });
  } catch (err) {
    console.error("Error during session logout:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
