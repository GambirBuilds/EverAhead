import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import {
  ShieldCheck,
  User,
  ArrowRight,
  Cloud,
  CheckCircle2,
  Lock,
  ExternalLink,
  Info,
} from "lucide-react";

export default function AuthPage() {
  const { settings, updateSettings, showToast } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("local"); // 'local' | 'cloud'
  const [nameInput, setNameInput] = useState(
    settings?.userName || "Biswas Poudel",
  );
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");

  const handleContinueLocal = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateSettings({ userName: nameInput.trim() });
    }
    showToast(`Welcome to EverAhead, ${nameInput.trim()}`);
    navigate("/");
  };

  const handleConnectCloud = (e) => {
    e.preventDefault();
    showToast(
      "Cloud backend credentials received. Running in hybrid local-first mode.",
      "info",
    );
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#080C12] text-[#F4F7FC] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-block text-2xl font-extrabold tracking-tight text-[#F4F7FC]"
          >
            EverAhead
          </Link>
          <p className="text-xs text-[#9BAABC]">
            Personal Life Operating System · Authentication & Synchronization
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111923] border border-white/10 shadow-2xl space-y-6">
          {/* Segmented Mode Selector */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#172331] rounded-xl text-xs font-semibold text-[#9BAABC]">
            <button
              type="button"
              onClick={() => setActiveTab("local")}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "local"
                  ? "bg-[#111923] text-[#61F5BB] font-bold shadow-sm"
                  : "hover:text-[#F4F7FC]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Local-First (Active)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cloud")}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "cloud"
                  ? "bg-[#111923] text-[#75CFFF] font-bold shadow-sm"
                  : "hover:text-[#F4F7FC]"
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Optional Cloud Sync</span>
            </button>
          </div>

          {activeTab === "local" ? (
            <form onSubmit={handleContinueLocal} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#172331]/50 border border-white/5 space-y-1 text-xs text-[#9BAABC]">
                <div className="flex items-center gap-1.5 font-bold text-[#61F5BB]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zero-Login Local Mode</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  No remote passwords, emails, or third-party tracking required.
                  Your database persists securely inside your browser's
                  localStorage.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">
                  Your Name or Alias
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9BAABC] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Biswas Poudel"
                    className="w-full bg-[#172331] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleConnectCloud} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#172331]/50 border border-white/5 space-y-1 text-xs text-[#9BAABC]">
                <div className="flex items-center gap-1.5 font-bold text-[#75CFFF]">
                  <Info className="w-4 h-4" />
                  <span>Supabase Backend Integration</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  To sync across multiple devices, connect your Supabase
                  PostgreSQL instance with Row Level Security.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">
                  Supabase URL
                </label>
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F4F7FC] focus:outline-none focus:border-[#75CFFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">
                  Anon Public Key
                </label>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F4F7FC] focus:outline-none focus:border-[#75CFFF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#75CFFF] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#75CFFF]/90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Connect & Launch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-[#9BAABC]">
            <Link
              to="/"
              className="hover:text-[#F4F7FC] transition-colors underline"
            >
              Return to EverAhead Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
