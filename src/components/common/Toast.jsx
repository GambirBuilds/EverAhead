import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md ${
        isError
          ? 'bg-red-950/90 border-red-500/30 text-red-200'
          : isInfo
          ? 'bg-[#172331]/95 border-[#75CFFF]/30 text-[#F4F7FC]'
          : 'bg-[#111923]/95 border-[#61F5BB]/30 text-[#F4F7FC]'
      }`}>
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        ) : isInfo ? (
          <Info className="w-5 h-5 text-[#75CFFF] shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[#61F5BB] shrink-0" />
        )}
        <p className="text-sm font-medium pr-2">{toast.message}</p>
        <button
          onClick={onClose}
          className="text-[#9BAABC] hover:text-[#F4F7FC] transition-colors p-1"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
