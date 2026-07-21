import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FONT_CLASSES, COLORS } from "@/constant/styles";
const ComingSoonModal = ({
  isOpen,
  onClose,
  title = "Coming Soon",
  message = "This page is under construction and will be available soon.",
  backgroundImageSrc
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (!mounted || !isOpen) return null;
  const modalContent = <div
    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
      {
    /* Full Overlay: Covers ALL homepage content with black semi-transparent + blur */
  }
      <div className="absolute inset-0">
        {backgroundImageSrc && <img
    src={backgroundImageSrc}
    alt="Modal Background"
    className="fixed inset-0 w-full h-full object-cover"
    style={{ zIndex: -1 }}
  />}
        {
    /* Black Semi-Transparent Overlay (Not Fully Black) + Blur */
  }
        {
    /* This tabunan/blurs everything underneath - homepage becomes invisible */
  }
        <div className="absolute inset-0 bg-black opacity-80 backdrop-blur-sm" />
      </div>

      {
    /* Modal Content: Only This is Sharp/Visible (On Top of Overlay) */
  }
      <div
    className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto p-6 sm:p-8"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Close Button */
  }
        <button
    onClick={onClose}
    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors"
    type="button"
    aria-label="Close modal"
  >
          ×
        </button>

        {
    /* Content: Clear and on top */
  }
        <div className="text-center pt-4">
          <h2
    id="modal-title"
    className={`text-2xl sm:text-3xl ${FONT_CLASSES.openSansBold} text-gray-900 mb-4`}
  >
            {title}
          </h2>
          <p className={`text-gray-600 ${FONT_CLASSES.rubikRegular} mb-6 leading-relaxed`}>
            {message}
          </p>
          <button
    onClick={onClose}
    className={`px-6 py-3 bg-[${COLORS.primary}] text-white rounded-full hover:bg-[#800000] transition-all hover:scale-105 shadow-lg ${FONT_CLASSES.openSansBold}`}
    type="button"
  >
            Close
          </button>
        </div>
      </div>
    </div>;
  return createPortal(modalContent, document.body);
};
var stdin_default = ComingSoonModal;
export {
  stdin_default as default
};
