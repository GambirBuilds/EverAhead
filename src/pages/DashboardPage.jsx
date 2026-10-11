import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import {
  getTimeBasedGreeting,
  formatCurrency,
  formatDuration,
  formatDate,
  calculateStreak,
} from "../utils/formatters.js";
import {
  CheckSquare,
  Target,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Calendar,
  Sparkles,
  BookOpen,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function DashboardPage() {
  const {
    tasks,
    goals,
    habits,
    focusSessions,
    finance,
    journal,
    stats,
    toggleTaskStatus,
    toggleHabitDate,
    settings,
  } = useApp();

  const greetingInfo = useMemo(() => {
    return getTimeBasedGreeting(settings?.userName || "Biswas");
  }, [settings?.userName]);

  const todayStr = stats.todayStr;

  // Active goals (up to 3)
  const activeGoals = useMemo(() => {
    return goals.slice(0, 3);
  }, [goals]);

  // Today's priority tasks
  const priorityTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status === "pending")
      .sort((a, b) => {
        if (a.priority === "high" && b.priority !== "high") return -1;
        if (b.priority === "high" && a.priority !== "high") return 1;
        return (a.dueDate || "").localeCompare(b.dueDate || "");
      })
      .slice(0, 4);
  }, [tasks]);

  // 7-day productivity activity data from real records
  const weeklyActivityData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });

      // Count tasks completed on this date
      const tasksCount = tasks.filter((t) =>
        t.completedAt?.startsWith(dateStr),
      ).length;
      // Count habits completed on this date
      const habitsCount = habits.filter((h) =>
        h.history.includes(dateStr),
      ).length;
      // Focus minutes on this date
      const focusMins = focusSessions
        .filter((s) => s.completedAt?.startsWith(dateStr))
        .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

      days.push({
        day: dayLabel,
        date: dateStr,
        tasks: tasksCount,
        habits: habitsCount,
        focusHours: Math.round((focusMins / 60) * 10) / 10,
      });
    }
    return days;
  }, [tasks, habits, focusSessions]);

  // Recent journal reflection
  const latestJournal = journal[0];

  return (
    <div className="space-y-6">
      {/* Hero Greeting Zone */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9BAABC] mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#61F5BB]" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            {greetingInfo.greeting}
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1 max-w-xl">
            {greetingInfo.subtext}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/my-day"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#172331] hover:bg-[#1F2E40] text-xs font-semibold text-[#61F5BB] border border-[#61F5BB]/30 rounded-xl transition-colors shadow-sm"
          >
            <span>Enter My Day</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (Zero-pill, high density, tabular numerals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Tasks Completion */}
        <div className="p-4 rounded-2xl bg-[#111923] border border-white/8">
          <div className="flex items-center justify-between text-xs text-[#9BAABC] mb-2">
            <span className="font-medium">Daily Tasks</span>
            <CheckSquare className="w-4 h-4 text-[#61F5BB]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#F4F7FC] tabular-nums">
              {stats.todayCompletedCount} / {stats.todayTasksCount}
            </span>
            <span className="text-xs text-[#9BAABC]">
              ({stats.taskCompletionRate}% all-time)
            </span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#61F5BB] h-full transition-all duration-300"
              style={{
                width: `${stats.todayTasksCount > 0 ? (stats.todayCompletedCount / stats.todayTasksCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* KPI 2: Habits Adherence */}
        <div className="p-4 rounded-2xl bg-[#111923] border border-white/8">
          <div className="flex items-center justify-between text-xs text-[#9BAABC] mb-2">
            <span className="font-medium">Habit Velocity</span>
            <Zap className="w-4 h-4 text-[#75CFFF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#F4F7FC] tabular-nums">
              {stats.habitsCompletedToday} / {stats.totalHabits}
            </span>
            <span className="text-xs text-[#75CFFF]">
              {stats.habitAdherenceToday}% today
            </span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#75CFFF] h-full transition-all duration-300"
              style={{ width: `${stats.habitAdherenceToday}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Daily Focus Time */}
        <div className="p-4 rounded-2xl bg-[#111923] border border-white/8">
          <div className="flex items-center justify-between text-xs text-[#9BAABC] mb-2">
            <span className="font-medium">Deep Work</span>
            <Clock className="w-4 h-4 text-[#C2A4FF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#F4F7FC] tabular-nums">
              {formatDuration(stats.todayFocusMinutes)}
            </span>
            <span className="text-xs text-[#9BAABC]">logged today</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-[#9BAABC]">
            <span>Total:</span>
            <span className="text-[#F4F7FC] font-semibold tabular-nums">
              {formatDuration(stats.allFocusMinutes)}
            </span>
          </div>
        </div>

        {/* KPI 4: Monthly Cash Flow Overview */}
        <div className="p-4 rounded-2xl bg-[#111923] border border-white/8">
          <div className="flex items-center justify-between text-xs text-[#9BAABC] mb-2">
            <span className="font-medium">Net Monthly Buffer</span>
            <DollarSign className="w-4 h-4 text-[#61F5BB]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F7FC] tabular-nums">
              {formatCurrency(stats.netSavings, finance.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] text-[#9BAABC]">
            <span>
              Spent:{" "}
              <span className="text-red-400 font-medium tabular-nums">
                {formatCurrency(stats.monthExpenses, finance.currency)}
              </span>
            </span>
            <span>
              Budget:{" "}
              <span className="text-[#F4F7FC] tabular-nums">
                {stats.budgetUtilization}%
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Tasks & Habits vs Goals & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Priority Tasks & Habit Checkers */}
        <div className="lg:col-span-7 space-y-6">
          {/* Priority Tasks Card */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8">
            <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#61F5BB]" />
                <h2 className="text-sm font-bold text-[#F4F7FC]">
                  Priority Focus Tasks
                </h2>
              </div>
              <Link
                to="/tasks"
                className="text-xs font-semibold text-[#61F5BB] hover:underline flex items-center gap-1"
              >
                <span>View all ({tasks.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {priorityTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#9BAABC]">
                <p>No high priority tasks pending.</p>
                <Link
                  to="/tasks"
                  className="inline-block mt-2 text-[#61F5BB] font-semibold hover:underline"
                >
                  Create a new task
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {priorityTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#172331]/60 hover:bg-[#172331] border border-white/5 transition-all group"
                  >
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-0.5 w-4 h-4 rounded border border-white/30 flex items-center justify-center hover:border-[#61F5BB] transition-colors"
                      aria-label="Toggle task status"
                    >
                      {task.status === "completed" && (
                        <div className="w-2.5 h-2.5 bg-[#61F5BB] rounded-sm" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-medium truncate ${
                            task.status === "completed"
                              ? "line-through text-[#9BAABC]"
                              : "text-[#F4F7FC]"
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-[11px] text-[#9BAABC] shrink-0 tabular-nums">
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-[#9BAABC] line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#9BAABC]">
                        <span className="capitalize">{task.category}</span>
                        <span>·</span>
                        <span
                          className={
                            task.priority === "high"
                              ? "text-amber-400 font-semibold"
                              : ""
                          }
                        >
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Habit Adherence Matrix */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8">
            <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#75CFFF]" />
                <h2 className="text-sm font-bold text-[#F4F7FC]">
                  Today's Habit Matrix
                </h2>
              </div>
              <Link
                to="/habits"
                className="text-xs font-semibold text-[#75CFFF] hover:underline flex items-center gap-1"
              >
                <span>Track Habits</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => {
                const isCompletedToday = habit.history.includes(todayStr);
                const streak = calculateStreak(habit.history);
                return (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/60 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleHabitDate(habit.id, todayStr)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                          isCompletedToday
                            ? "bg-[#61F5BB] border-[#61F5BB] text-[#080C12]"
                            : "border-white/20 hover:border-white/40"
                        }`}
                        aria-label={`Toggle habit ${habit.name}`}
                      >
                        {isCompletedToday && (
                          <span className="font-bold text-xs">✓</span>
                        )}
                      </button>
                      <div>
                        <div className="text-xs font-semibold text-[#F4F7FC]">
                          {habit.name}
                        </div>
                        <div className="text-[10px] text-[#9BAABC] capitalize">
                          {habit.category} · {habit.frequency}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#75CFFF] tabular-nums">
                        {streak} day streak
                      </div>
                      <div className="text-[10px] text-[#9BAABC] tabular-nums">
                        {habit.history.length} total logs
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Productivity Visual Chart */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8">
            <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#61F5BB]" />
                <h2 className="text-sm font-bold text-[#F4F7FC]">
                  7-Day Output Rhythm
                </h2>
              </div>
              <span className="text-[11px] text-[#9BAABC]">
                Derived from logged tasks & habits
              </span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyActivityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="day"
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111923",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "11px",
                    }}
                    itemStyle={{ color: "#F4F7FC" }}
                  />
                  <Bar
                    dataKey="tasks"
                    fill="#61F5BB"
                    radius={[4, 4, 0, 0]}
                    name="Tasks"
                  />
                  <Bar
                    dataKey="habits"
                    fill="#75CFFF"
                    radius={[4, 4, 0, 0]}
                    name="Habits"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Active Goals & Journal Reflection */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Goals Card */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8">
            <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#C2A4FF]" />
                <h2 className="text-sm font-bold text-[#F4F7FC]">
                  Active Objectives
                </h2>
              </div>
              <Link
                to="/goals"
                className="text-xs font-semibold text-[#C2A4FF] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-3.5 rounded-xl bg-[#172331]/60 border border-white/5 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-[#F4F7FC] leading-snug">
                      {goal.title}
                    </h3>
                    <span className="text-xs font-bold text-[#61F5BB] tabular-nums shrink-0">
                      {goal.progress}%
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9BAABC] line-clamp-1">
                    {goal.description}
                  </p>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#61F5BB] to-[#75CFFF] h-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#9BAABC] pt-1">
                    <span className="capitalize">{goal.category}</span>
                    <span>Target: {formatDate(goal.targetDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Review & Recent Journal */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8">
            <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#61F5BB]" />
                <h2 className="text-sm font-bold text-[#F4F7FC]">
                  Daily Reflection
                </h2>
              </div>
              <Link
                to="/journal"
                className="text-xs font-semibold text-[#61F5BB] hover:underline flex items-center gap-1"
              >
                <span>Open Journal</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {latestJournal ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#172331]/60 border border-white/5">
                  <div className="flex items-center justify-between text-[11px] text-[#9BAABC] mb-1.5">
                    <span className="font-semibold text-[#F4F7FC]">
                      {latestJournal.title}
                    </span>
                    <span>{formatDate(latestJournal.date)}</span>
                  </div>
                  <p className="text-xs text-[#9BAABC] italic leading-relaxed">
                    "{latestJournal.reflection}"
                  </p>
                  {latestJournal.gratitude && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 text-[11px] text-[#9BAABC]">
                      <span className="text-[#61F5BB] font-medium">
                        Gratitude:
                      </span>{" "}
                      {latestJournal.gratitude}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#9BAABC]">
                <p>No journal reflections written yet.</p>
                <Link
                  to="/journal"
                  className="text-[#61F5BB] mt-1 inline-block font-semibold"
                >
                  Record today's insight
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
