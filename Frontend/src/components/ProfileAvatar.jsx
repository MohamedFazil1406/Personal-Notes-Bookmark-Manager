"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseClient";

export default function ProfileAvatar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // 🔐 Listen to Firebase auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({
          name: u.displayName || "User",
          email: u.email || "",
          photo: u.photoURL || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  // ❌ Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🚪 LOGOUT (FIXED)
  const handleLogout = async () => {
    try {
      // 1️⃣ clear backend session cookie
      await fetch("http://localhost:3000/api/auth/session-logout", {
        method: "POST",
        credentials: "include",
      });

      // 2️⃣ firebase sign out
      await signOut(auth);

      // 3️⃣ redirect to landing page
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // not logged in → no avatar
  if (!user) return null;

  return (
    <div className="relative m-4" ref={ref}>
      {/* 👤 Avatar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full overflow-hidden border border-gray-300"
      >
        <img
          src={user.photo || "/avatar.png"}
          alt="Profile"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </button>

      {/* 📂 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-xl border bg-white shadow-lg z-50">
          <div className="flex items-center gap-3 p-4 border-b">
            <img
              src={user.photo}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
