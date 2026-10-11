import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency, formatDuration } from '../utils/formatters.js';
import {
  BarChart3,
  TrendingUp,
  CheckSquare,
  Zap,
  Target,
  Clock,
  DollarSign,
  BookOpen,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export default function InsightsPage() {
  const { tasks, goals, habits, focusSessions, learning, finance, stats } = useApp();

  // Daily focus trend over past 7 days
  const focusTrendData = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayMins = focusSessions
        .filter(s => s.completedAt?.startsWith(iso))
        .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

      list.push({
        day: dayLabel,
        date: iso,
        minutes: dayMins,
        hours: Math.round((dayMins / 60) * 10) / 10,
      });
    }
    return list;
  }, [focusSessions]);

  // Overall Goal Completion Progress
  const averageGoalProgress = useMemo(() => {
    if (goals.length === 0) return 0;
    const total = goals.reduce((acc, g) => acc + (g.progress || 0), 0);
    return Math.round(total / goals.length);
  }, [goals]);

  // Total Learning Hours Invested
  const totalLearningHours = useMemo(() => {
    return learning.reduce((sum, s) => sum + (s.totalHoursInvested || 0), 0);
  }, [learning]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            Insights & Empirical Performance
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            Ground-truth analytics synthesized exclusively from your verified local records.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#172331] border border-white/10 text-xs text-[#9BAABC]">
          <Info className="w-3.5 h-3.5 text-[#75CFFF]" />
          <span>Real calculation engine (No simulated data)</span>
        </div>
      </div>

      {/* Primary Diagnostic Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Task Velocity */}
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BAABC]">
            <span>Task Completion Ratio</span>
            <CheckSquare className="w-4 h-4 text-[#61F5BB]" />
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {stats.taskCompletionRate}%
          </div>
          <p className="text-[11px] text-[#9BAABC]">
            {stats.completedTasks} completed out of {stats.totalTasks} recorded tasks
          </p>
        </div>

        {/* Habit Consistency */}
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BAABC]">
            <span>Habit Adherence (Today)</span>
            <Zap className="w-4 h-4 text-[#75CFFF]" />
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {stats.habitAdherenceToday}%
          </div>
          <p className="text-[11px] text-[#9BAABC]">
            {stats.habitsCompletedToday} of {stats.totalHabits} routines executed
          </p>
        </div>

        {/* Goal Execution Index */}
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BAABC]">
            <span>Average Goal Progress</span>
            <Target className="w-4 h-4 text-[#C2A4FF]" />
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {averageGoalProgress}%
          </div>
          <p className="text-[11px] text-[#9BAABC]">
            Calculated across {goals.length} active objectives
          </p>
        </div>

        {/* Total Focus Time */}
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BAABC]">
            <span>Total Focus Logged</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {formatDuration(stats.allFocusMinutes)}
          </div>
          <p className="text-[11px] text-[#9BAABC]">
            Cumulative deep work across all sessions
          </p>
        </div>
      </div>

      {/* Focus Hours Visual Trajectory */}
      <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#F4F7FC] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#61F5BB]" />
              <span>7-Day Deep Work Trajectory</span>
            </h2>
            <p className="text-xs text-[#9BAABC]">Hours spent in unbroken concentration by day</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#61F5BB] tabular-nums">
            {formatDuration(focusTrendData.reduce((acc, d) => acc + d.minutes, 0))} this week
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={focusTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#61F5BB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#61F5BB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111923', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                itemStyle={{ color: '#F4F7FC' }}
                formatter={(val) => [`${val} hours`, 'Focus Time']}
              />
              <Area type="monotone" dataKey="hours" stroke="#61F5BB" strokeWidth={2} fillOpacity={1} fill="url(#focusGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Domain Performance Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Health Matrix */}
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
          <h2 className="text-sm font-bold text-[#F4F7FC] flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#61F5BB]" />
            <span>Financial Discipline Ratio</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/50 border border-white/5">
              <span className="text-[#9BAABC]">Monthly Budget Containment</span>
              <span className="font-bold text-[#F4F7FC] tabular-nums">{stats.budgetUtilization}% utilized</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/50 border border-white/5">
              <span className="text-[#9BAABC]">Net Monthly Savings Buffer</span>
              <span className={`font-bold tabular-nums ${stats.netSavings >= 0 ? 'text-[#61F5BB]' : 'text-red-400'}`}>
                {formatCurrency(stats.netSavings, finance.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/50 border border-white/5">
              <span className="text-[#9BAABC]">Savings Reserves Allocated</span>
              <span className="font-bold text-[#75CFFF] tabular-nums">
                {(finance.savingsGoals || []).length} active target funds
              </span>
            </div>
          </div>
        </div>

        {/* Deliberate Practice & Learning Activity */}
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
          <h2 className="text-sm font-bold text-[#F4F7FC] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#75CFFF]" />
            <span>Cognitive & Skill Investment</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/50 border border-white/5">
              <span className="text-[#9BAABC]">Cumulative Study Hours Logged</span>
              <span className="font-bold text-[#61F5BB] tabular-nums">{totalLearningHours} hours</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/50 border border-white/5">
              <span className="text-[#9BAABC]">Active Roadmaps Tracked</span>
              <span className="font-bold text-[#F4F7FC] tabular-nums">{learning.length} domains</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/50 border border-white/5">
              <span className="text-[#9BAABC]">Curriculum Milestones Completed</span>
              <span className="font-bold text-[#75CFFF] tabular-nums">
                {learning.reduce((sum, s) => sum + (s.milestones?.filter(m => m.completed).length || 0), 0)} verified steps
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
