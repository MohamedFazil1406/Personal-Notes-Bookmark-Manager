export default function SideBar() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#f7f9fb] min-h-screen">
        <h2 className="text-2xl text-[#2c3447] font-bold px-4 pt-4">
          📒 NoteMark
        </h2>

        <span className="block text-[#2c3447] text-xs px-4">
          Personal Notes & Bookmark Manager
        </span>

        <div className="pt-4 px-4">
          <hr className="border-t border-gray-300" />
        </div>

        <ul>
          <li className="p-4 hover:bg-[#e6e9ef] text-[#2c3447] text-xl cursor-pointer">
            📝 Notes
          </li>
          <li className="p-4 hover:bg-[#e6e9ef] text-xl text-[#2c3447] cursor-pointer">
            🔖 Bookmarks
          </li>
        </ul>
      </div>

      {/* Vertical divider */}
      <div className="w-px bg-gray-300 min-h-screen"></div>
    </div>
  );
}
