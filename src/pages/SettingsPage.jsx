import React, { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Modal from "../components/common/Modal.jsx";
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ShieldCheck,
  Moon,
  Sun,
  User,
  DollarSign,
  Clock,
  Sparkles,
  Database,
} from "lucide-react";

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    toggleTheme,
    setColorTheme,
    handleExportJSON,
    handleImportJSON,
    handleResetData,
    showToast,
  } = useApp();

  const [userName, setUserName] = useState(
    settings?.userName || "Biswas Poudel",
  );
  const [userTitle, setUserTitle] = useState(
    settings?.userTitle || "Systems Architect",
  );
  const [currency, setCurrency] = useState(settings?.currency || "NPR");
  const [focusDuration, setFocusDuration] = useState(
    String(settings?.defaultFocusDuration || 25),
  );

  // Reset confirmation modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetType, setResetType] = useState("demo"); // 'demo' | 'empty'

  // Profile save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateSettings({
      userName: userName.trim(),
      userTitle: userTitle.trim(),
      currency,
      defaultFocusDuration: Number(focusDuration),
    });
  };

  // Import file handler
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const success = handleImportJSON(parsed);
        if (success) {
          e.target.value = "";
        }
      } catch (err) {
        showToast("Invalid JSON file format", "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            Settings & Data Sovereignty
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            Manage your personal profile, visual theme, currency parameters, and
            local data persistence.
          </p>
        </div>
      </div>

      {/* User Profile Form */}
      <div className="p-6 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/8">
          <User className="w-4 h-4 text-[#61F5BB]" />
          <h2 className="text-sm font-bold text-[#F4F7FC]">
            Identity & Parameters
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">
                User Name
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">
                Role / Focus Domain
              </label>
              <input
                type="text"
                value={userTitle}
                onChange={(e) => setUserTitle(e.target.value)}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="NPR">Nepalese Rupee (NPR - रु)</option>
                <option value="USD">US Dollar (USD - $)</option>
                <option value="EUR">Euro (EUR - €)</option>
                <option value="GBP">British Pound (GBP - £)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">
                Default Focus Duration
              </label>
              <select
                value={focusDuration}
                onChange={(e) => setFocusDuration(e.target.value)}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="25">25 minutes (Standard Pomodoro)</option>
                <option value="45">45 minutes (Deep Block)</option>
                <option value="60">60 minutes (Ultra-Focus)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-colors shadow-sm"
            >
              Save Parameters
            </button>
          </div>
        </form>
      </div>

      {/* Visual Interface Theme & Color Palette */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Aesthetic Color Palette
            </h2>
          </div>
          <span className="text-xs text-[var(--text-secondary)] capitalize font-mono">
            Active: {settings?.colorTheme || "aurora"}
          </span>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Select an aesthetic color universe tailored for deep concentration,
          elevated spatial elegance, and high-contrast scannability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              id: "aurora",
              name: "Emerald Aurora",
              sub: "Deep Obsidian & Bioluminescent Mint",
              primary: "#00F5B8",
              secondary: "#38BDF8",
              bg: "#070A12",
            },
            {
              id: "nebula",
              name: "Cyber Nebula",
              sub: "Cosmic Twilight & Electric Violet",
              primary: "#C084FC",
              secondary: "#F43F5E",
              bg: "#090814",
            },
            {
              id: "ocean",
              name: "Deep Ocean",
              sub: "Oceanic Abyss & Vibrant Azure",
              primary: "#0EA5E9",
              secondary: "#14B8A6",
              bg: "#050E18",
            },
            {
              id: "amber",
              name: "Solar Eclipse",
              sub: "Dark Graphite & Luminous Amber",
              primary: "#F59E0B",
              secondary: "#FB7185",
              bg: "#0C0C0E",
            },
            {
              id: "light",
              name: "Alabaster Daylight",
              sub: "Crisp Modern Light Studio",
              primary: "#0D9488",
              secondary: "#0284C7",
              bg: "#F8FAFC",
            },
          ].map((item) => {
            const isSelected =
              (settings?.theme === "light" && item.id === "light") ||
              (settings?.theme !== "light" &&
                (settings?.colorTheme || "aurora") === item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === "light") {
                    if (settings?.theme !== "light") toggleTheme();
                  } else {
                    setColorTheme(item.id);
                  }
                }}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/40 bg-[var(--bg-surface-elevated)] shadow-lg"
                    : "border-[var(--border-subtle)] hover:border-white/20 bg-[var(--bg-surface-elevated)]/40"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {item.name}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-[var(--accent-primary)]">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mb-3">
                  {item.sub}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: item.bg }}
                  />
                  <div
                    className="w-5 h-5 rounded-full shadow-sm"
                    style={{ backgroundColor: item.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full shadow-sm"
                    style={{ backgroundColor: item.secondary }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Management & Portability */}
      <div className="p-6 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/8">
          <Database className="w-4 h-4 text-[#75CFFF]" />
          <h2 className="text-sm font-bold text-[#F4F7FC]">
            Data Backup & Portability
          </h2>
        </div>

        <p className="text-xs text-[#9BAABC] leading-relaxed">
          Your records are kept locally in your browser storage. You have 100%
          data sovereignty. Export a full JSON archive at any time, or import a
          verified backup to restore your system state.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Export Button */}
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#172331] hover:bg-[#1F2E40] border border-white/10 rounded-xl text-xs font-semibold text-[#F4F7FC] transition-colors"
          >
            <Download className="w-4 h-4 text-[#61F5BB]" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import Button */}
          <label className="flex items-center gap-2 px-4 py-2.5 bg-[#172331] hover:bg-[#1F2E40] border border-white/10 rounded-xl text-xs font-semibold text-[#F4F7FC] transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[#75CFFF]" />
            <span>Restore Backup (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          {/* Reload Demo Data */}
          <button
            onClick={() => {
              setResetType("demo");
              setIsResetConfirmOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#172331] hover:bg-[#1F2E40] border border-white/10 rounded-xl text-xs font-semibold text-[#C2A4FF] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Sample Data</span>
          </button>

          {/* Clear all data */}
          <button
            onClick={() => {
              setResetType("empty");
              setIsResetConfirmOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-950/40 hover:bg-red-950/80 border border-red-500/30 rounded-xl text-xs font-semibold text-red-300 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Local Storage</span>
          </button>
        </div>
      </div>

      {/* Local-First Security Disclosure */}
      <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 flex items-start gap-3 text-xs text-[#9BAABC]">
        <ShieldCheck className="w-5 h-5 text-[#61F5BB] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#F4F7FC] block">
            Privacy & Architecture Guarantee
          </span>
          <p className="leading-relaxed">
            EverAhead operates in a local-first architecture. Your goals,
            habits, financial figures, and personal reflections remain strictly
            within your browser environment. No telemetry, hidden analytical
            trackers, or advertising trackers are present.
          </p>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title={
          resetType === "empty"
            ? "Reset All Data"
            : "Reload Sample Demo Records"
        }
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            {resetType === "empty"
              ? "Warning: This will permanently wipe all local tasks, goals, habits, focus logs, and financial records. This action cannot be undone unless you have an exported backup."
              : "This will replace current records with the standard curated demo dataset for EverAhead OS."}
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(false)}
              className="px-4 py-2 text-xs text-[#9BAABC] hover:text-[#F4F7FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                handleResetData(resetType === "empty");
                setIsResetConfirmOpen(false);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                resetType === "empty"
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-[#61F5BB] text-[#080C12] hover:bg-[#61F5BB]/90"
              }`}
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
