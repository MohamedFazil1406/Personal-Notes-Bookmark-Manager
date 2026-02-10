import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import Notescard from "../components/Notescard";
import Sidebar from "../components/SideBar";
import Search from "../components/Search";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  // 🔥 THIS is the key function
  const handleSuccess = () => {
    setRefresh((prev) => !prev);
  };

  /* ================= AUTH + FETCH DATA ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      setLoading(false);

      try {
        const token = await user.getIdToken();

        const [notesRes, bookmarksRes] = await Promise.all([
          axios.get("http://localhost:3000/api/notes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/bookmarks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setNotes(notesRes.data);
        setBookmarks(bookmarksRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    });

    return () => unsub();
  }, [navigate, refresh]); // 👈 refresh dependency

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-screen bg-[#f7f7fb] flex flex-col">
        {/* 🔹 TOP BAR ONLY */}
        <div className="bg-white border-b shadow-sm">
          <Search onSuccess={() => setRefresh((prev) => !prev)} />
        </div>

        {/* 🔹 PAGE BODY */}
        <div className="flex-1 bg-[#f7f7fb]">
          <h1 className="text-2xl font-bold m-4">Your Notes</h1>
          <hr className="border-t border-gray-300 m-4" />

          <div className="grid grid-cols-3 gap-4 m-4">
            {notes.map((note) => (
              <Notescard key={note._id} item={note} type="note" />
            ))}
          </div>

          <h1 className="text-2xl font-bold m-4">Your Bookmarks</h1>
          <hr className="border-t border-gray-300 m-4" />

          <div className="grid grid-cols-1 gap-4 m-4">
            {bookmarks.map((bm) => (
              <Notescard key={bm._id} item={bm} type="bookmark" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
