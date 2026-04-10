// The modals will appear when a user tries to make changes to their profile

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none">
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;