import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatDate, formatDuration } from '../utils/formatters.js';
import { Link } from 'react-router-dom';
import {
  SunMedium,
  CheckSquare,
  Zap,
  Clock,
  Calendar,
  Plus,
  Play,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function MyDayPage() {
  const {
    tasks,
    habits,
    events,
    stats,
    toggleTaskStatus,
    toggleHabitDate,
    addTask,
    addJournalEntry
  } = useApp();

  const todayStr = stats.todayStr;

  // Today's tasks
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);

  // Form states
  const [newTaskInput, setNewTaskInput] = useState('');
  const [reflectionInput, setReflectionInput] = useState('');

  const handleQuickTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    addTask({
      title: newTaskInput,
      dueDate: todayStr,
      priority: 'high',
      category: 'work',
    });
    setNewTaskInput('');
  };

  const handleEveningReflection = (e) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;
    addJournalEntry({
      title: `Daily Debrief (${todayStr})`,
      reflection: reflectionInput,
      mood: 'Focused',
    });
    setReflectionInput('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#61F5BB] mb-1">
            <SunMedium className="w-4 h-4" />
            <span>Daily Command Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            My Day
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Intentional execution mode
          </p>
        </div>

        <Link
          to="/focus"
          className="flex items-center gap-2 px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-sm shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Focus Timer</span>
        </Link>
      </div>

      {/* Focus Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#111923] border border-white/8 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9BAABC]">Tasks Remaining</span>
            <div className="text-xl font-bold text-[#F4F7FC] tabular-nums mt-0.5">
              {todayTasks.filter(t => t.status === 'pending').length} of {todayTasks.length}
            </div>
          </div>
          <CheckSquare className="w-5 h-5 text-[#61F5BB]" />
        </div>

        <div className="p-4 rounded-xl bg-[#111923] border border-white/8 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9BAABC]">Habits Completed</span>
            <div className="text-xl font-bold text-[#F4F7FC] tabular-nums mt-0.5">
              {stats.habitsCompletedToday} / {stats.totalHabits}
            </div>
          </div>
          <Zap className="w-5 h-5 text-[#75CFFF]" />
        </div>

        <div className="p-4 rounded-xl bg-[#111923] border border-white/8 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9BAABC]">Focus Logged Today</span>
            <div className="text-xl font-bold text-[#F4F7FC] tabular-nums mt-0.5">
              {formatDuration(stats.todayFocusMinutes)}
            </div>
          </div>
          <Clock className="w-5 h-5 text-[#C2A4FF]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tasks & Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Tasks */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F4F7FC] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#61F5BB]" />
                <span>Today's Execution List</span>
              </h2>
              <span className="text-xs text-[#9BAABC] tabular-nums">
                {todayTasks.filter(t => t.status === 'completed').length} completed
              </span>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleQuickTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Add priority task for today..."
                className="flex-1 bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#F4F7FC] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#61F5BB]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#172331] hover:bg-[#1F2E40] border border-white/10 text-xs font-semibold text-[#61F5BB] rounded-xl transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="space-y-2 pt-1">
              {todayTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#9BAABC]">
                  No tasks due today. Add one above or schedule from the Tasks page.
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/60 hover:bg-[#172331] border border-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          task.status === 'completed'
                            ? 'bg-[#61F5BB] border-[#61F5BB] text-[#080C12]'
                            : 'border-white/30 hover:border-[#61F5BB]'
                        }`}
                      >
                        {task.status === 'completed' && <span className="text-[10px] font-bold">✓</span>}
                      </button>
                      <div className="min-w-0">
                        <span className={`text-xs font-medium block truncate ${
                          task.status === 'completed' ? 'line-through text-[#9BAABC]' : 'text-[#F4F7FC]'
                        }`}>
                          {task.title}
                        </span>
                        <span className="text-[10px] text-[#9BAABC] capitalize">
                          {task.category} · {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Schedule & Events */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F4F7FC] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#75CFFF]" />
                <span>Today's Time Blocks</span>
              </h2>
              <Link to="/calendar" className="text-xs text-[#75CFFF] hover:underline">
                Full Calendar
              </Link>
            </div>

            <div className="space-y-2">
              {events.filter(e => e.date === todayStr).length === 0 ? (
                <div className="text-center py-5 text-xs text-[#9BAABC]">
                  No calendar events scheduled for today.
                </div>
              ) : (
                events.filter(e => e.date === todayStr).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/60 border border-white/5"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#F4F7FC]">{event.title}</div>
                      <div className="text-[10px] text-[#9BAABC]">{event.description || 'Calendar Event'}</div>
                    </div>
                    <div className="text-xs font-mono font-medium text-[#75CFFF] bg-[#111923] px-2 py-1 rounded-md border border-white/5">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Habits & Evening Reflection (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Habits Check */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F4F7FC] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#61F5BB]" />
                <span>Today's Habits</span>
              </h2>
              <span className="text-xs text-[#61F5BB] font-semibold tabular-nums">
                {stats.habitAdherenceToday}%
              </span>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => {
                const isCompleted = habit.history.includes(todayStr);
                return (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => toggleHabitDate(habit.id, todayStr)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isCompleted
                        ? 'bg-[#61F5BB]/10 border-[#61F5BB]/30 text-[#F4F7FC]'
                        : 'bg-[#172331]/60 border-white/5 text-[#9BAABC] hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-medium">{habit.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      isCompleted ? 'bg-[#61F5BB] text-[#080C12]' : 'bg-[#111923] text-[#9BAABC]'
                    }`}>
                      {isCompleted ? 'Done' : 'Tap to Complete'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Evening Reflection / Notes */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
            <h2 className="text-sm font-bold text-[#F4F7FC] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C2A4FF]" />
              <span>Evening Debrief</span>
            </h2>

            <form onSubmit={handleEveningReflection} className="space-y-3">
              <textarea
                rows={3}
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                placeholder="Log a quick breakthrough, friction point, or lesson from today..."
                className="w-full bg-[#172331] border border-white/10 rounded-xl p-3 text-xs text-[#F4F7FC] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#C2A4FF] resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#172331] hover:bg-[#1F2E40] border border-white/10 text-xs font-semibold text-[#C2A4FF] rounded-xl transition-colors"
              >
                Save to Journal
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
