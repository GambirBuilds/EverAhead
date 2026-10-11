import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Target,
  Clock,
  DollarSign,
  PenTool,
  BarChart3,
  BookOpen,
  Sparkles,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080C12] text-[#F4F7FC] selection:bg-[#61F5BB]/20 selection:text-[#61F5BB]">
      {/* Landing Header - Strict Top Bar Contract */}
      <header className="sticky top-0 z-50 h-16 bg-[#080C12]/90 border-b border-white/8 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <Link to="/" className="text-xl font-extrabold tracking-tight text-[#F4F7FC] whitespace-nowrap shrink-0">
          EverAhead
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9BAABC]">
          <a href="#philosophy" className="hover:text-[#F4F7FC] transition-colors whitespace-nowrap shrink-0">Philosophy</a>
          <a href="#architecture" className="hover:text-[#F4F7FC] transition-colors whitespace-nowrap shrink-0">Architecture</a>
          <a href="#modules" className="hover:text-[#F4F7FC] transition-colors whitespace-nowrap shrink-0">Capabilities</a>
          <a href="#privacy" className="hover:text-[#F4F7FC] transition-colors whitespace-nowrap shrink-0">Privacy</a>
        </nav>

        {/* Zone 3: 1 Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-sm whitespace-nowrap"
          >
            <span>Launch Command OS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111923] border border-[#61F5BB]/30 text-xs text-[#61F5BB]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Operating System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F7FC] leading-[1.1] text-balance">
              Your life. Your goals. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#61F5BB] via-[#75CFFF] to-[#C2A4FF]">
                Your next level.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#9BAABC] leading-relaxed max-w-xl text-balance">
              EverAhead is a futuristic personal life operating system engineered for high agency individuals. Organize daily priorities, accomplish multi-horizon goals, forge unbroken habit streaks, allocate capital, and study deeply without noise.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/"
                className="flex items-center gap-2.5 px-6 py-3 bg-[#61F5BB] text-[#080C12] text-sm font-extrabold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-lg shadow-[#61F5BB]/10"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/my-day"
                className="flex items-center gap-2 px-5 py-3 bg-[#111923] hover:bg-[#172331] border border-white/10 rounded-xl text-sm font-semibold text-[#F4F7FC] transition-colors"
              >
                <span>View My Day Cockpit</span>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-6 text-xs text-[#9BAABC] border-t border-white/8">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#61F5BB]" />
                100% Local-First
              </span>
              <span>·</span>
              <span>Zero telemetry tracking</span>
              <span>·</span>
              <span>Zero subscription paywall</span>
            </div>
          </div>

          {/* Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#111923] group">
              <img
                src="/src/assets/images/everahead_os_hero_1791719902679.jpg"
                alt="EverAhead OS Interface concept"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080C12] via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Storytelling & Architecture Grid */}
      <section id="modules" className="px-6 lg:px-12 py-20 border-t border-white/8 bg-[#0D131C]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#61F5BB]">
              Full System Topology
            </h2>
            <p className="text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
              Eight Integrated Life Domains. One Cohesive Canvas.
            </p>
            <p className="text-sm text-[#9BAABC]">
              No fragmented spreadsheets, forgotten notes, or disconnected apps. Everything links to your primary horizon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Module 1: Tasks */}
            <div className="p-6 rounded-2xl bg-[#111923] border border-white/8 space-y-3 hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#61F5BB]/10 border border-[#61F5BB]/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#61F5BB]" />
              </div>
              <h3 className="text-base font-bold text-[#F4F7FC]">Action & Tasks</h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Prioritized queue with overdue alerts, objective linkage, search, and immediate execution filters.
              </p>
            </div>

            {/* Module 2: Goals */}
            <div className="p-6 rounded-2xl bg-[#111923] border border-white/8 space-y-3 hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#75CFFF]/10 border border-[#75CFFF]/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#75CFFF]" />
              </div>
              <h3 className="text-base font-bold text-[#F4F7FC]">Horizon Objectives</h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Break major life milestones into sequential checkable steps with mathematically derived completion progress.
              </p>
            </div>

            {/* Module 3: Habits */}
            <div className="p-6 rounded-2xl bg-[#111923] border border-white/8 space-y-3 hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-[#F4F7FC]">Atomic Consistency</h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                7-day matrix with real contiguous date streak calculations. Never fabricate false adherence.
              </p>
            </div>

            {/* Module 4: Focus Studio */}
            <div className="p-6 rounded-2xl bg-[#111923] border border-white/8 space-y-3 hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#C2A4FF]/10 border border-[#C2A4FF]/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C2A4FF]" />
              </div>
              <h3 className="text-base font-bold text-[#F4F7FC]">Focus Studio</h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Customizable Pomodoro timer with Web Audio pink noise synthesis and persistent tab-safe countdown.
              </p>
            </div>

            {/* Module 5: Skills */}
            <div className="p-6 rounded-2xl bg-[#111923] border border-white/8 space-y-3 hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#75CFFF]/10 border border-[#75CFFF]/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#75CFFF]" />
              </div>
              <h3 className="text-base font-bold text-[#F4F7FC]">Skill Acquisition</h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Structured curriculum roadmaps, project milestones, and deliberate practice hour logs.
              </p>
            </div>

            {/* Module 6: Finance */}
            <div className="p-6 rounded-2xl bg-[#111923] border border-white/8 space-y-3 hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#61F5BB]/10 border border-[#61F5BB]/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#61F5BB]" />
              </div>
              <h3 className="text-base font-bold text-[#F4F7FC]">Personal Finance</h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Multi-currency cash flow tracking with full Nepalese Rupee (NPR - रु), USD, EUR, and savings reserve targets.
              </p>
            </div>

            {/* Module 7: Journal */}
            <div className="p-6 rounded-2xl bg-[#111923] border border-white/8 space-y-3 hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#C2A4FF]/10 border border-[#C2A4FF]/20 flex items-center justify-center">
                <PenTool className="w-5 h-5 text-[#C2A4FF]" />
              </div>
              <h3 className="text-base font-bold text-[#F4F7FC]">Private Reflection</h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Introspective guided daily inquiry prompts, mood calibration, gratitude entries, and plain text export.
              </p>
            </div>

            {/* Module 8: Insights */}
            <div className="p-6 rounded-2xl bg-[#111923] border border-white/8 space-y-3 hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-[#F4F7FC]">Empirical Insights</h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Transparent visual charts computed directly from your saved logs. No artificial metrics or hallucinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Sovereignty Callout */}
      <section id="privacy" className="px-6 lg:px-12 py-20 border-t border-white/8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#111923] border border-white/10 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#61F5BB]/10 border border-[#61F5BB]/20 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-[#61F5BB]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7FC]">
            Absolute Local-First Privacy
          </h2>

          <p className="text-sm text-[#9BAABC] max-w-xl mx-auto leading-relaxed">
            Your life goals, mental reflections, habits, and financial logs belong to you.
            EverAhead executes completely in your client environment, persists state to local storage,
            and allows 1-click JSON exports. No remote profiling. No ads.
          </p>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#61F5BB] text-[#080C12] text-sm font-extrabold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-md"
            >
              <span>Initialize Your OS Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 px-6 text-center text-xs text-[#9BAABC]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-[#F4F7FC]">EverAhead OS</span>
          <span>Your life. Your goals. Your next level.</span>
          <span className="text-[11px]">© 2026 EverAhead. Sovereign Local-First Architecture.</span>
        </div>
      </footer>
    </div>
  );
}
