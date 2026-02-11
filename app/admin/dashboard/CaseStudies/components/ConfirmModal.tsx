import React from 'react';
import { useDarkMode } from '../../layout';

interface ConfirmModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  isEditMode,
  isLoading,
  onClose,
  onConfirm,
}) => {
  const { isdarkmode } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-[3rem] p-12 max-w-md w-full shadow-2xl ${isdarkmode ? 'bg-[#1f1f1f]' : 'bg-white'}`}>
        <h3 className={`text-2xl font-bold mb-4 ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
          {isEditMode ? 'Confirm Update' : 'Confirm Creation'}
        </h3>
        <p className={`mb-8 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
          {isEditMode 
            ? 'Are you sure you want to update this case study?' 
            : 'Are you sure you want to create this case study?'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
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
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-[#800000] text-white rounded-2xl font-bold hover:bg-[#600000] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};