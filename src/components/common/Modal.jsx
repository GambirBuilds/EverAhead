import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080C12]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div className={`relative w-full ${maxWidth} bg-[#111923] border border-white/10 rounded-2xl shadow-2xl p-6 text-[#F4F7FC] z-10 my-8 transition-all`}>
        <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-[#F4F7FC]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#9BAABC] hover:text-[#F4F7FC] hover:bg-white/5 p-1.5 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
