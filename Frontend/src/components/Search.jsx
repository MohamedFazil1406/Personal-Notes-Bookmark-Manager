import AddButton from "./Addbutton";
import Dropdown from "./Dropdown";
import ProfileAvatar from "./ProfileAvatar";

export default function SearchBar({ onSuccess }) {
  return (
    <div className="flex items-center gap-2">
      {/* Search Input */}
      <div className="w-2xl m-4 flex-1">
        <div className="relative">
          {/* Search Icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width={18}
            height={18}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search notes or bookmarks..."
            className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Dropdown />

      {/* 🔥 PASS onSuccess DOWN */}
      <AddButton onSuccess={onSuccess} />

      <ProfileAvatar />
    </div>
  );
}
