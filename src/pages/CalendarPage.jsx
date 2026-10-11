import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Modal from '../components/common/Modal.jsx';
import { formatDate } from '../utils/formatters.js';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckSquare,
  Trash2,
  Edit2
} from 'lucide-react';

export default function CalendarPage() {
  const { events, tasks, addEvent, updateEvent, deleteEvent } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    category: 'work',
    description: '',
  });

  // Navigation handlers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setDate(d.getDate() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(d.getDate() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now.toISOString().split('T')[0]);
  };

  // Month grid calculation
  const monthGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayIndex = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();

    const days = [];
    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        iso: d.toISOString().split('T')[0],
        dayNum: d.getDate(),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        iso: d.toISOString().split('T')[0],
        dayNum: i,
        isCurrentMonth: true,
      });
    }

    // Next month filler
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        iso: d.toISOString().split('T')[0],
        dayNum: i,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  const handleOpenModal = (event = null, defaultDate = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        category: event.category,
        description: event.description || '',
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        date: defaultDate || selectedDate,
        startTime: '10:00',
        endTime: '11:00',
        category: 'work',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent(formData);
    }
    setIsModalOpen(false);
  };

  // Selected date events & tasks
  const dayEvents = events.filter(e => e.date === selectedDate);
  const dayTasks = tasks.filter(t => t.dueDate === selectedDate);

  const todayIso = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            Calendar & Daily Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            Harmonize calendar commitments, task deadlines, and intentional focus windows.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal(null, selectedDate)}
          className="flex items-center gap-2 px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Event</span>
        </button>
      </div>

      {/* Navigation and View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111923] border border-white/8">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[#9BAABC] hover:text-[#F4F7FC]"
            aria-label="Previous period"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[#9BAABC] hover:text-[#F4F7FC]"
            aria-label="Next period"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1 rounded-lg border border-white/10 text-xs font-semibold text-[#61F5BB] hover:bg-white/5 ml-1"
          >
            Today
          </button>
          <span className="text-sm font-bold text-[#F4F7FC] ml-2">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#172331] rounded-xl text-xs font-medium text-[#9BAABC]">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
              viewMode === 'month' ? 'bg-[#111923] text-[#61F5BB] font-semibold shadow-sm' : 'hover:text-[#F4F7FC]'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
              viewMode === 'week' ? 'bg-[#111923] text-[#61F5BB] font-semibold shadow-sm' : 'hover:text-[#F4F7FC]'
            }`}
          >
            Agenda
          </button>
        </div>
      </div>

      {/* Main Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Month Grid (8 cols) */}
        <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#111923] border border-white/8">
          {/* Day of week header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#9BAABC] pb-2 border-b border-white/8 mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((day) => {
              const hasEvents = events.some(e => e.date === day.iso);
              const hasTasks = tasks.some(t => t.dueDate === day.iso);
              const isSelected = selectedDate === day.iso;
              const isToday = todayIso === day.iso;

              return (
                <button
                  key={day.iso}
                  onClick={() => setSelectedDate(day.iso)}
                  className={`min-h-[64px] sm:min-h-[78px] p-1.5 sm:p-2 rounded-xl text-left border flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-[#172331] border-[#61F5BB] shadow-md ring-1 ring-[#61F5BB]/30'
                      : isToday
                      ? 'bg-white/[0.04] border-[#61F5BB]/50'
                      : day.isCurrentMonth
                      ? 'bg-[#111923] border-white/5 hover:border-white/20'
                      : 'bg-transparent border-transparent opacity-30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold tabular-nums ${
                      isToday ? 'text-[#61F5BB]' : isSelected ? 'text-white' : 'text-[#9BAABC]'
                    }`}>
                      {day.dayNum}
                    </span>
                  </div>

                  <div className="space-y-1 w-full overflow-hidden">
                    {hasEvents && (
                      <div className="h-1.5 w-full bg-[#75CFFF] rounded-full" title="Calendar events" />
                    )}
                    {hasTasks && (
                      <div className="h-1.5 w-full bg-[#61F5BB]/70 rounded-full" title="Task deadline" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Drawer / Details (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <div>
              <h2 className="text-sm font-bold text-[#F4F7FC]">
                {formatDate(selectedDate, { year: true })}
              </h2>
              <span className="text-xs text-[#9BAABC]">
                {selectedDate === todayIso ? "Today's Agenda" : 'Selected Date'}
              </span>
            </div>
            <button
              onClick={() => handleOpenModal(null, selectedDate)}
              className="p-1.5 bg-[#172331] text-[#61F5BB] hover:bg-[#1F2E40] border border-white/10 rounded-lg text-xs font-semibold"
              title="Add event on this date"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Events on this date */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9BAABC] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#75CFFF]" />
              <span>Events ({dayEvents.length})</span>
            </h3>

            {dayEvents.length === 0 ? (
              <p className="text-xs text-[#9BAABC] italic">No events scheduled.</p>
            ) : (
              <div className="space-y-2">
                {dayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-[#172331]/70 border border-white/5 space-y-1 group"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold text-[#F4F7FC]">{evt.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(evt)}
                          className="text-[#9BAABC] hover:text-[#F4F7FC] p-0.5"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(evt.id)}
                          className="text-[#9BAABC] hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-[#75CFFF]">
                      {evt.startTime} - {evt.endTime}
                    </div>
                    {evt.description && (
                      <p className="text-[11px] text-[#9BAABC]">{evt.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasks due on this date */}
          <div className="space-y-3 pt-3 border-t border-white/8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9BAABC] flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-[#61F5BB]" />
              <span>Tasks Due ({dayTasks.length})</span>
            </h3>

            {dayTasks.length === 0 ? (
              <p className="text-xs text-[#9BAABC] italic">No tasks due on this date.</p>
            ) : (
              <div className="space-y-2">
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl bg-[#172331]/70 border border-white/5 text-xs flex items-center justify-between"
                  >
                    <span className={t.status === 'completed' ? 'line-through text-[#9BAABC]' : 'text-[#F4F7FC]'}>
                      {t.title}
                    </span>
                    <span className="text-[10px] text-[#9BAABC] capitalize">{t.priority}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Schedule Event'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Event Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Weekly Strategic Review"
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">End Time</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Description (Optional)</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event agenda or notes..."
              className="w-full bg-[#172331] border border-white/10 rounded-xl p-3 text-xs text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB] resize-none"
            />
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
              {editingEvent ? 'Save Event' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Event"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9BAABC]">Are you sure you want to delete this event?</p>
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
                deleteEvent(deleteConfirmId);
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
