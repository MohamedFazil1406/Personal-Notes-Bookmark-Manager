import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { auth } from "../firebaseClient";

export default function AddButton({ onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState(""); // "note" | "bookmark"
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openForm = (selectedType) => {
    setType(selectedType);
    setShowForm(true);
    setIsOpen(false);
  };

  return (
    <>
      {/* Add Button */}
      <div ref={dropdownRef} className="relative inline-block m-4">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 justify-center w-24 h-10
                     bg-blue-500 text-white rounded-xl px-4 shadow-lg
                     hover:bg-blue-600 transition-colors"
        >
          <span>＋</span>
          <span>Add</span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="absolute left-0 mt-2 w-40 rounded-md
                          border border-gray-200 bg-white shadow-lg z-10"
          >
            <ul className="py-1 text-sm text-gray-700">
              <li
                onClick={() => openForm("note")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Add Notes
              </li>
              <li
                onClick={() => openForm("bookmark")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Add Bookmark
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <FormCard
            type={type}
            onClose={() => setShowForm(false)}
            onSuccess={onSuccess} // ✅ PASS DOWN
          />
        </>
      )}
    </>
  );
}

/* ================= FORM CARD ================= */

function FormCard({ type, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add items.");
      return;
    }

    try {
      setLoading(true);

      const token = await user.getIdToken();

      const endpoint =
        type === "bookmark"
          ? "http://localhost:3000/api/bookmarks"
          : "http://localhost:3000/api/notes";

      const payload = {
        title,
        description,
        ...(type === "bookmark" && { url }),
        ...(type === "note" && {
          tags: tags.split(",").map((t) => t.trim()),
        }),
      };

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        onSuccess && onSuccess(); // ✅ refresh dashboard
        onClose(); // ✅ close modal
      } else {
        alert(`Failed to add ${type}.`);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert(`An error occurred while adding the ${type}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border p-6 flex flex-col gap-3">
        <h2 className="text-lg font-semibold capitalize">Add {type}</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border rounded-md px-3 py-2"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border rounded-md px-3 py-2"
        />

        {type === "bookmark" && (
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
            className="border rounded-md px-3 py-2"
          />
        )}

        {type === "note" && (
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="border rounded-md px-3 py-2"
          />
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="border px-4 py-2 rounded-md">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
