const express = require("express");
const router = express.Router();
const admin = require("../../firebaseadmin");

router.post("/session-login", async (req, res) => {
  const idToken = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!idToken) {
    console.error("token:", idToken);
    return res.status(400).json({ message: "ID token is required" });
  }

  try {
    // 🔐 STEP 1: Verify ID token FIRST
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded ID token:", decodedToken);

    // 🔐 STEP 2: Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    // 🍪 STEP 3: Set cookie (correct for localhost)
    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: false, // 🔥 MUST be false on localhost
      sameSite: "lax", // 🔥 REQUIRED
      path: "/", // 🔥 Ensure cookie is sent on all routes
    });

    res.status(200).json({ message: "Session login successful" });
  } catch (err) {
    console.error("Session login error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
