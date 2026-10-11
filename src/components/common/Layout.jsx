import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import Toast from './Toast.jsx';
import QuickAddModal from './QuickAddModal.jsx';
import {
  LayoutDashboard,
  SunMedium,
  CheckSquare,
  Target,
  Zap,
  CalendarDays,
  Clock,
  BookOpen,
  DollarSign,
  PenTool,
  BarChart3,
  Settings,
  Plus,
  Compass,
  Menu,
  X,
  Moon,
  ShieldCheck,
  ChevronRight,
  Palette,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/my-day', label: 'My Day', icon: SunMedium },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/habits', label: 'Habits', icon: Zap },
  { path: '/calendar', label: 'Calendar', icon: CalendarDays },
  { path: '/focus', label: 'Focus Studio', icon: Clock },
  { path: '/learning', label: 'Learning & Skills', icon: BookOpen },
  { path: '/finance', label: 'Personal Finance', icon: DollarSign },
  { path: '/journal', label: 'Journal', icon: PenTool },
  { path: '/insights', label: 'Insights & Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const PALETTES = [
  { id: 'aurora', name: 'Emerald Aurora', dot: '#00F5B8', desc: 'Bioluminescent Mint & Cyan' },
  { id: 'nebula', name: 'Cyber Nebula', dot: '#C084FC', desc: 'Cosmic Violet & Rose' },
  { id: 'ocean', name: 'Deep Ocean', dot: '#0EA5E9', desc: 'Electric Azure & Teal' },
  { id: 'amber', name: 'Solar Eclipse', dot: '#F59E0B', desc: 'Warm Amber & Gold' },
  { id: 'light', name: 'Alabaster Daylight', dot: '#0D9488', desc: 'Crisp Modern Light' },
];

export default function Layout({ children }) {
  const { toast, showToast, settings, toggleTheme, setColorTheme } = useApp();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [palettePickerOpen, setPalettePickerOpen] = useState(false);
  const paletteRef = useRef(null);
  const location = useLocation();

  const currentNav = NAV_ITEMS.find(item => item.path === location.pathname) || { label: 'Command Center' };
  const currentPalette = settings?.theme === 'light' ? 'light' : (settings?.colorTheme || 'aurora');

  // Close palette dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target)) {
        setPalettePickerOpen(false);
      }
    };
    if (palettePickerOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [palettePickerOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 relative">
      {/* Luminous Ambient Glow Spheres in background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-[var(--accent-primary)] opacity-[0.04] blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-[var(--accent-secondary)] opacity-[0.035] blur-[140px] rounded-full" />
        <div className="absolute -bottom-24 left-1/3 w-[500px] h-[500px] bg-[var(--accent-violet)] opacity-[0.025] blur-[150px] rounded-full" />
      </div>

      {/* Top Header - Strict Top Bar Contract */}
      <header className="sticky top-0 z-40 h-14 bg-[var(--bg-surface)]/90 border-b border-[var(--border-subtle)] backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-8 transition-colors duration-300">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/" className="text-base sm:text-lg font-extrabold tracking-tight text-[var(--text-primary)] whitespace-nowrap">
            EverAhead
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className="text-white/20">/</span>
            <span className="text-[var(--accent-primary)] font-semibold">{currentNav.label}</span>
          </div>
        </div>

        {/* Zone 2: Navigation links / Quick status (Single-line controls) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[var(--text-secondary)]">
          <Link to="/my-day" className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap">
            My Day
          </Link>
          <Link to="/tasks" className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap">
            Tasks
          </Link>
          <Link to="/goals" className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap">
            Goals
          </Link>
          <Link to="/focus" className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap">
            Focus Studio
          </Link>
          <Link to="/landing" className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap text-[var(--accent-secondary)]">
            OS Overview
          </Link>
        </nav>

        {/* Zone 3: 1 Primary Action + Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Theme Palette Picker Dropdown */}
          <div className="relative" ref={paletteRef}>
            <button
              onClick={() => setPalettePickerOpen(prev => !prev)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"
              title="Change Aesthetic Color Theme"
              aria-label="Change Color Theme"
            >
              <Palette className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
            </button>

            {palettePickerOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1">
                  Aesthetic Color Themes
                </div>
                <div className="space-y-1">
                  {PALETTES.map((p) => {
                    const isSelected = currentPalette === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setColorTheme(p.id);
                          setPalettePickerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                          isSelected
                            ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-bold shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: p.dot }}
                          />
                          <div>
                            <div className="font-semibold text-xs leading-none">{p.name}</div>
                            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{p.desc}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[var(--accent-primary)] text-xs font-bold">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-white/5 transition-colors"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle visual mode"
          >
            {settings?.theme === 'light' ? (
              <Moon className="w-4 h-4 text-[var(--accent-violet)]" />
            ) : (
              <SunMedium className="w-4 h-4 text-[var(--accent-primary)]" />
            )}
          </button>

          {/* Primary Quick Log Action */}
          <button
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent-primary)] text-[var(--btn-text)] text-xs font-bold rounded-xl hover:opacity-95 transition-all shadow-md whitespace-nowrap glow-primary"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Quick Log</span>
          </button>

          <Link
            to="/settings"
            className="flex items-center gap-2 pl-1 group"
            title="Account & Settings"
          >
            <img
              src="/src/assets/images/user_avatar_default_1791719920311.jpg"
              alt="Alex Mercer avatar"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)] transition-colors"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Desktop Sidebar (240px) */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] shrink-0 overflow-y-auto transition-colors duration-300">
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Personal OS
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent-primary)] font-bold border border-white/5 shadow-inner'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* System Footer info */}
          <div className="mt-auto p-3 border-t border-[var(--border-subtle)] space-y-2">
            <Link
              to="/landing"
              className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/60 border border-[var(--border-subtle)] hover:border-[var(--accent-secondary)]/40 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[var(--accent-secondary)]" />
                <span>OS Overview</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </Link>

            <div className="px-3 py-2 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Local-First Active
              </span>
              <span className="font-mono text-[10px]">v1.0</span>
            </div>
          </div>
        </aside>

        {/* Mobile Slide Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 max-w-[80vw] bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] h-full p-4 flex flex-col z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-3">
                <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">EverAhead OS</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1 flex-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent-primary)] font-bold'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
                <NavLink
                  to="/landing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[var(--accent-secondary)] hover:bg-white/5"
                >
                  <Compass className="w-4 h-4" />
                  <span>Public Landing Page</span>
                </NavLink>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-6 focus:outline-none">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Quick Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[var(--bg-surface)]/95 border-t border-[var(--border-subtle)] backdrop-blur-lg flex items-center justify-around z-30 px-2 text-[10px]">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'}`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </NavLink>
        <NavLink
          to="/my-day"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'}`
          }
        >
          <SunMedium className="w-4 h-4" />
          <span>My Day</span>
        </NavLink>
        <button
          onClick={() => setQuickAddOpen(true)}
          className="flex flex-col items-center justify-center w-10 h-10 -mt-5 bg-[var(--accent-primary)] text-[var(--btn-text)] rounded-full shadow-lg glow-primary font-bold"
          aria-label="Quick Add"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
        <NavLink
          to="/focus"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'}`
          }
        >
          <Clock className="w-4 h-4" />
          <span>Focus</span>
        </NavLink>
        <NavLink
          to="/insights"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'}`
          }
        >
          <BarChart3 className="w-4 h-4" />
          <span>Insights</span>
        </NavLink>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => showToast(null)} />
    </div>
  );
}
