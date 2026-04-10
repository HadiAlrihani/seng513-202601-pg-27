// Appears on mobile for selecting profile editing options

const SettingsMenu = ({ isOpen, onClose, onSelectOption }) => {
  if (!isOpen) return null;

  const handleOptionClick = (option) => {
    onClose(); // Close settings menu
    onSelectOption(option); // Open the specific modal
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold">Account Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="p-4">
          <button
            onClick={() => handleOptionClick('username')}
            className="w-full text-left px-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-medium">Change Username</h3>
            <p className="text-sm text-gray-500">Update your display name</p>
          </button>

          <button
            onClick={() => handleOptionClick('email')}
            className="w-full text-left px-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-medium">Change Email</h3>
            <p className="text-sm text-gray-500">Update your email address</p>
          </button>

          <button
            onClick={() => handleOptionClick('password')}
            className="w-full text-left px-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-medium">Reset Password</h3>
            <p className="text-sm text-gray-500">Change your account password</p>
          </button>

          <button
            onClick={() => handleOptionClick('deactivate')}
            className="w-full text-left px-4 py-4 hover:bg-red-50 transition"
          >
            <h3 className="text-lg font-medium text-red-600">Deactivate Account</h3>
            <p className="text-sm text-red-400">Permanently delete your account</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;