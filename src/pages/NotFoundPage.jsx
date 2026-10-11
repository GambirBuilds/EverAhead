import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#080C12] text-[#F4F7FC] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#111923] border border-white/10 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#75CFFF]/10 border border-[#75CFFF]/30 flex items-center justify-center mx-auto text-[#75CFFF]">
          <Compass className="w-6 h-6" />
        </div>
        <div className="text-3xl font-extrabold font-mono text-[#61F5BB]">404</div>
        <h1 className="text-lg font-bold">Coordinate Not Found</h1>
        <p className="text-xs text-[#9BAABC] leading-relaxed">
          The route you are navigating to does not exist in this EverAhead installation.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-colors"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
