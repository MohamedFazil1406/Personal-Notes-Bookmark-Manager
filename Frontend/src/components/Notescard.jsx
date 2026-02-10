import defaulticon from "../assets/default-icon.png";
import axios from "axios";
import { useState } from "react";
import { auth } from "../firebaseClient";

const tagColors = {
  Work: "bg-blue-100 text-blue-700 border-blue-300",
  Personal: "bg-green-100 text-green-700 border-green-300",
  Important: "bg-red-100 text-red-700 border-red-300",
  Shopping: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Study: "bg-purple-100 text-purple-700 border-purple-300",
  Travel: "bg-indigo-100 text-indigo-700 border-indigo-300",
  Finance: "bg-emerald-100 text-emerald-700 border-emerald-300",
  Health: "bg-pink-100 text-pink-700 border-pink-300",
  Ideas: "bg-cyan-100 text-cyan-700 border-cyan-300",
  Other: "bg-gray-100 text-gray-700 border-gray-300",
};

export default function Notescard({ item, type = "note" }) {
  const { _id, title, description, tags, url } = item;

  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editData, setEditData] = useState({
    title: title || "",
    description: description || "",
    tags: tags || "Other",
    url: url || "",
  });

  const tagClass = tagColors[tags] || tagColors.Other;
  const cardWidth = type === "bookmark" ? "w-full max-w-xl" : "w-64";
  const domain = getDomain(url);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      const endpoint =
        type === "note"
          ? `http://localhost:3000/api/notes/${_id}`
          : `http://localhost:3000/api/bookmarks/${_id}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      const endpoint =
        type === "note"
          ? `http://localhost:3000/api/notes/${_id}`
          : `http://localhost:3000/api/bookmarks/${_id}`;

      await axios.put(endpoint, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setLoading(false);
      setShowEdit(false);
    }
  };

  return (
    <>
      {/* CARD */}
      <div className={`bg-white rounded-lg shadow-md p-4 m-4 ${cardWidth}`}>
        <h3 className="text-lg font-bold mb-2">{title}</h3>

        <p className="text-gray-700 text-sm mb-4">
          {description || "No description added"}
        </p>

        {type === "bookmark" && (
          <div className="flex items-start gap-2 mb-4">
            <img
              src={
                domain
                  ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
                  : defaulticon
              }
              alt="favicon"
              className="w-6 h-6"
              onError={(e) => (e.target.src = defaulticon)}
            />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm break-all hover:underline"
            >
              {url}
            </a>
          </div>
        )}

        <hr className="border-t border-gray-300 my-2" />

        {type === "note" && (
          <>
            <span
              className={`inline-block rounded-2xl border px-2 py-1 text-xs font-medium ${tagClass}`}
            >
              #{tags}
            </span>
            <hr className="border-t border-gray-300 my-2" />
          </>
        )}

        <div className="flex justify-end gap-3 text-sm">
          {type === "bookmark" && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-700"
            >
              Open
            </a>
          )}

          <button
            onClick={() => setShowEdit(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showConfirm && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-2">Delete {type}?</h2>
              <p className="text-gray-600 text-sm mb-4">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Edit {type}</h2>

              <input
                className="w-full border p-2 rounded mb-3"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                placeholder="Title"
              />

              {type === "note" && (
                <textarea
                  className="w-full border p-2 rounded mb-3"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                />
              )}

              {type === "bookmark" && (
                <input
                  className="w-full border p-2 rounded mb-3"
                  value={editData.url}
                  onChange={(e) =>
                    setEditData({ ...editData, url: e.target.value })
                  }
                  placeholder="URL"
                />
              )}

              <input
                className="w-full border p-2 rounded mb-4"
                value={editData.tags}
                onChange={(e) =>
                  setEditData({ ...editData, tags: e.target.value })
                }
                placeholder="Tag"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* HELPER */
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}
