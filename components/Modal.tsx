import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg overflow-hidden shadow-xl max-w-3xl w-full mx-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-xl text-[var(--brand-dark)]">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;