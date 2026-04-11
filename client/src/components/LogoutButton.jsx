export default function LogoutButton({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* Modal box */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm">
        <h2 className="text-xl font-semibold mb-4">
          Log out?
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to log out?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}