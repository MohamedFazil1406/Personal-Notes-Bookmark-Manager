"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import axios from "axios";
import { auth } from "../firebaseClient";

const provider = new GoogleAuthProvider();

export default function GoogleSignInButton() {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);

      const idToken = await result.user.getIdToken();

      const resp = await axios.post(
        "http://localhost:3000/api/auth/session-login",
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          withCredentials: true,
        },
      );

      if (resp.status === 200) {
        window.location.href = "/dashboard";
      } else {
        throw new Error("Session login failed");
      }
    } catch (err) {
      // 🔁 Popup blocked / cancelled → fallback to redirect
      const code = err?.code;

      if (
        code === "auth/popup-blocked" ||
        code === "auth/cancelled-popup-request"
      ) {
        await signInWithRedirect(auth, provider);
        return;
      }

      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data);
      } else {
        console.error("Auth error:", err);
      }

      alert("Google sign-in failed. Check console.");
    }
  };

  return (
    <button
      onClick={handleSignIn}
      type="button"
      className="inline-flex items-center gap-3 px-4 py-2 rounded-lg shadow-sm
                 bg-white text-slate-700 border border-slate-200
                 hover:shadow-md active:scale-[0.99]
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {/* Google G icon */}
      <svg width="18" height="18" viewBox="0 0 533.5 544.3">
        <path
          fill="#4285F4"
          d="M533.5 278.4c0-18.1-1.6-35.5-4.6-52.4H272v99.3h147.5c-6.4 34.5-25.3 63.7-54 83.4v69.6h87.2c51-47 81.8-116.4 81.8-199.9z"
        />
        <path
          fill="#34A853"
          d="M272 544.3c73.7 0 135.6-24.5 180.8-66.6l-87.2-69.6c-24.3 16.3-55.4 26-93.6 26-72 0-133.1-48.7-154.9-114.1H28.4v71.8C74.1 481 166.1 544.3 272 544.3z"
        />
        <path
          fill="#FBBC05"
          d="M117.1 323.9c-11.9-35.8-11.9-74.9 0-110.7V141.4H28.4c-39.9 79.9-39.9 174.2 0 254.1l88.7-71.6z"
        />
        <path
          fill="#EA4335"
          d="M272 107.7c39.9 0 75.9 13.7 104.2 40.7l78-78C401.6 24 337.9 0 272 0 166.1 0 74.1 63.3 28.4 141.4l88.7 71.8C138.9 156.4 200 107.7 272 107.7z"
        />
      </svg>

      <span className="text-sm font-medium">Sign in with Google</span>
    </button>
  );
}
