require("dotenv").config();
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

console.log("ENV PROJECT ID:", process.env.FIREBASE_PROJECT_ID);
console.log("ENV CLIENT EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("ENV PRIVATE KEY EXISTS:", !!process.env.FIREBASE_PRIVATE_KEY);

console.log(
  "🔥 Firebase Admin project:",
  admin.app().options.credential.projectId,
);

module.exports = admin;
