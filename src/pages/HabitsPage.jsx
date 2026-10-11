import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Modal from '../components/common/Modal.jsx';
import { calculateStreak } from '../utils/formatters.js';
import {
  Zap,
  Plus,
  Trash2,
  Edit2,
  Flame,
  CheckCircle2,
  Calendar,
  Activity,
  Heart,
  BookOpen,
  Sun
} from 'lucide-react';

export default function HabitsPage() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabitDate } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'health',
    frequency: 'daily',
  });

  // Generate last 7 days for the visual matrix
  const past7Days = useMemo(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      dates.push({ iso, dayName, dayNum, isToday: i === 0 });
    }
    return dates;
  }, []);

  const todayStr = past7Days[past7Days.length - 1].iso;

  const handleOpenModal = (habit = null) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({
        name: habit.name,
        category: habit.category,
        frequency: habit.frequency,
      });
    } else {
      setEditingHabit(null);
      setFormData({
        name: '',
        category: 'health',
        frequency: 'daily',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingHabit) {
      updateHabit(editingHabit.id, formData);
    } else {
      addHabit(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            Habits & Daily Consistency
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            Build compounding biological and cognitive routines with verified calendar streaks.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Habit</span>
        </button>
      </div>

      {/* 7-Day Completion Matrix Grid */}
      <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header row: Habit Name | Days */}
          <div className="grid grid-cols-12 gap-2 pb-3 border-b border-white/8 text-xs font-semibold text-[#9BAABC]">
            <div className="col-span-5">Habit Protocol</div>
            <div className="col-span-2 text-center">Current Streak</div>
            <div className="col-span-5 grid grid-cols-7 gap-1 text-center">
              {past7Days.map((d) => (
                <div key={d.iso} className={d.isToday ? 'text-[#61F5BB] font-bold' : ''}>
                  <div>{d.dayName}</div>
                  <div className="text-[10px] tabular-nums text-[#9BAABC]/70">{d.dayNum}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Habit rows */}
          <div className="divide-y divide-white/5">
            {habits.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#9BAABC]">
                No habits created yet. Click "New Habit" to track your daily routines.
              </div>
            ) : (
              habits.map((habit) => {
                const streak = calculateStreak(habit.history);
                return (
                  <div
                    key={habit.id}
                    className="grid grid-cols-12 gap-2 py-3.5 items-center hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Habit Info */}
                    <div className="col-span-5 flex items-center justify-between pr-4">
                      <div>
                        <div className="text-xs font-bold text-[#F4F7FC]">{habit.name}</div>
                        <div className="text-[10px] text-[#9BAABC] capitalize">
                          {habit.category} · {habit.frequency}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(habit)}
                          className="p-1 text-[#9BAABC] hover:text-[#F4F7FC]"
                          title="Edit habit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(habit.id)}
                          className="p-1 text-[#9BAABC] hover:text-red-400"
                          title="Delete habit"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Streak badge */}
                    <div className="col-span-2 flex items-center justify-center gap-1 text-xs font-bold text-[#75CFFF] tabular-nums">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{streak} days</span>
                    </div>

                    {/* 7 Days checkboxes */}
                    <div className="col-span-5 grid grid-cols-7 gap-1">
                      {past7Days.map((d) => {
                        const isDone = habit.history.includes(d.iso);
                        return (
                          <div key={d.iso} className="flex justify-center">
                            <button
                              onClick={() => toggleHabitDate(habit.id, d.iso)}
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-all ${
                                isDone
                                  ? 'bg-[#61F5BB] border-[#61F5BB] text-[#080C12] font-bold shadow-sm'
                                  : d.isToday
                                  ? 'border-[#61F5BB]/40 hover:border-[#61F5BB]'
                                  : 'border-white/10 hover:border-white/30 text-transparent'
                              }`}
                              title={`${habit.name} on ${d.iso}`}
                            >
                              {isDone ? '✓' : ''}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Habit Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9BAABC]">
            <CheckCircle2 className="w-4 h-4 text-[#61F5BB]" />
            <span>Today's Total Completions</span>
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {habits.filter(h => h.history.includes(todayStr)).length} / {habits.length}
          </div>
          <p className="text-[11px] text-[#9BAABC]">
            {habits.length > 0
              ? `${Math.round((habits.filter(h => h.history.includes(todayStr)).length / habits.length) * 100)}% adherence today`
              : 'Add habits to begin'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9BAABC]">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Longest Current Streak</span>
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {habits.reduce((max, h) => Math.max(max, calculateStreak(h.history)), 0)} days
          </div>
          <p className="text-[11px] text-[#9BAABC]">
            Calculated across contiguous days.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9BAABC]">
            <Activity className="w-4 h-4 text-[#75CFFF]" />
            <span>Total Cumulative Logs</span>
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {habits.reduce((sum, h) => sum + h.history.length, 0)}
          </div>
          <p className="text-[11px] text-[#9BAABC]">
            Verified entries across all tracked habits.
          </p>
        </div>
      </div>

      {/* Modal for create / edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHabit ? 'Edit Habit' : 'New Habit Protocol'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Habit Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., 20m Morning Sun & Breathwork"
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="health">Health & Fitness</option>
                <option value="productivity">Deep Productivity</option>
                <option value="learning">Skill & Reading</option>
                <option value="mindset">Mindset & Recovery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="daily">Every Day</option>
                <option value="weekdays">Weekdays Only</option>
                <option value="weekly">3x Per Week</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-white/8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs text-[#9BAABC] hover:text-[#F4F7FC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-lg hover:bg-[#61F5BB]/90 shadow-sm"
            >
              {editingHabit ? 'Save Changes' : 'Initialize Habit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Habit"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9BAABC]">
            Are you sure you want to delete this habit and its history? This action is permanent.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-3 py-1.5 text-xs text-[#9BAABC] hover:text-[#F4F7FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                deleteHabit(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
