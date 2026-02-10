import { useEffect, useRef, useState } from "react";

export default function Dropdown({ tags = [], selected = "All", onSelect }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ FINAL: only DB tags, cleaned
  const uniqueTags = [
    "All",
    ...Array.from(new Set(tags.map((t) => t?.trim()).filter(Boolean))),
  ];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left m-4">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        {selected}
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg z-50">
          <ul className="py-1 text-sm text-gray-700">
            {uniqueTags.map((tag) => (
              <li
                key={tag}
                onClick={() => {
                  onSelect(tag);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
