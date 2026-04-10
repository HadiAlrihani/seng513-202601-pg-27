export default function ProfileOverlay({ onClose, onProfile, onLogout }) {
  return (
    <div className="absolute top-full right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50">
      <button
        onClick={onProfile}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Profile
      </button>

      <button
        onClick={onLogout}
        className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
      >
        Logout
      </button>
    </div>
  );
}