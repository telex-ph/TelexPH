import React from 'react';
import { useDarkMode } from '../../layout';

interface DeleteModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  targetTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  isDeleting,
  targetTitle,
  onClose,
  onConfirm,
}) => {
  const { isdarkmode } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-[3rem] p-12 max-w-md w-full shadow-2xl ${isdarkmode ? 'bg-[#1f1f1f]' : 'bg-white'}`}>
        <h3 className={`text-2xl font-bold mb-4 ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
          Confirm Delete
        </h3>
        <p className={`mb-8 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
          Are you sure you want to delete "{targetTitle}"? This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`flex-1 px-6 py-3 rounded-2xl font-bold transition-colors ${
              isdarkmode 
                ? 'bg-white/10 text-white hover:bg-white/20' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};