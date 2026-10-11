import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { CheckSquare, Zap, DollarSign, Clock, BookOpen } from 'lucide-react';

export default function QuickAddModal({ isOpen, onClose }) {
  const { addTask, addHabit, addTransaction, logFocusSession, addJournalEntry } = useApp();
  const [tab, setTab] = useState('task'); // 'task' | 'habit' | 'transaction' | 'focus' | 'journal'

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('work');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDue, setTaskDue] = useState(new Date().toISOString().split('T')[0]);

  // Habit form state
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('health');

  // Transaction form state
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('expense');
  const [txCategory, setTxCategory] = useState('Food');

  // Focus form state
  const [focusTask, setFocusTask] = useState('');
  const [focusDuration, setFocusDuration] = useState('25');

  // Journal form state
  const [journalTitle, setJournalTitle] = useState('');
  const [journalReflection, setJournalReflection] = useState('');
  const [journalMood, setJournalMood] = useState('Focused');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'task') {
      if (!taskTitle.trim()) return;
      addTask({
        title: taskTitle,
        category: taskCategory,
        priority: taskPriority,
        dueDate: taskDue,
      });
      setTaskTitle('');
    } else if (tab === 'habit') {
      if (!habitName.trim()) return;
      addHabit({
        name: habitName,
        category: habitCategory,
        frequency: 'daily',
      });
      setHabitName('');
    } else if (tab === 'transaction') {
      if (!txTitle.trim() || !txAmount) return;
      addTransaction({
        title: txTitle,
        amount: Number(txAmount),
        type: txType,
        category: txCategory,
        date: new Date().toISOString().split('T')[0],
      });
      setTxTitle('');
      setTxAmount('');
    } else if (tab === 'focus') {
      logFocusSession({
        durationMinutes: Number(focusDuration),
        taskTitle: focusTask || 'Autonomous Focus Block',
      });
      setFocusTask('');
    } else if (tab === 'journal') {
      if (!journalReflection.trim()) return;
      addJournalEntry({
        title: journalTitle || 'Daily Note',
        reflection: journalReflection,
        mood: journalMood,
      });
      setJournalTitle('');
      setJournalReflection('');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Capture">
      {/* Tab Switcher - Segmented control */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-[#172331] rounded-xl mb-5 text-xs font-medium text-[#9BAABC]">
        <button
          type="button"
          onClick={() => setTab('task')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg transition-colors ${
            tab === 'task' ? 'bg-[#111923] text-[#61F5BB] shadow-sm font-semibold' : 'hover:text-[#F4F7FC]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Task</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('habit')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg transition-colors ${
            tab === 'habit' ? 'bg-[#111923] text-[#61F5BB] shadow-sm font-semibold' : 'hover:text-[#F4F7FC]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Habit</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('transaction')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg transition-colors ${
            tab === 'transaction' ? 'bg-[#111923] text-[#61F5BB] shadow-sm font-semibold' : 'hover:text-[#F4F7FC]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Finance</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('focus')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg transition-colors ${
            tab === 'focus' ? 'bg-[#111923] text-[#61F5BB] shadow-sm font-semibold' : 'hover:text-[#F4F7FC]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Focus</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('journal')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg transition-colors ${
            tab === 'journal' ? 'bg-[#111923] text-[#61F5BB] shadow-sm font-semibold' : 'hover:text-[#F4F7FC]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Journal</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === 'task' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Task Title</label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g., Review distributed database architecture"
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#61F5BB]/50"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Category</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]/50"
                >
                  <option value="work">Work</option>
                  <option value="learning">Learning</option>
                  <option value="health">Health</option>
                  <option value="finance">Finance</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]/50"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                  className="w-full bg-[#172331] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]/50"
                />
              </div>
            </div>
          </>
        )}

        {tab === 'habit' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Habit Name</label>
              <input
                type="text"
                required
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="e.g., Morning 20m Zone 2 aerobic run"
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#61F5BB]/50"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Category</label>
              <select
                value={habitCategory}
                onChange={(e) => setHabitCategory(e.target.value)}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]/50"
              >
                <option value="health">Health & Body</option>
                <option value="productivity">Deep Productivity</option>
                <option value="learning">Skill Acquisition</option>
                <option value="mindset">Mindset & Recovery</option>
              </select>
            </div>
          </>
        )}

        {tab === 'transaction' && (
          <>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#172331] rounded-xl mb-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTxType('expense')}
                className={`py-2 rounded-lg transition-colors ${txType === 'expense' ? 'bg-[#111923] text-red-400 font-bold' : 'text-[#9BAABC]'}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setTxType('income')}
                className={`py-2 rounded-lg transition-colors ${txType === 'income' ? 'bg-[#111923] text-[#61F5BB] font-bold' : 'text-[#9BAABC]'}`}
              >
                Income
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Description</label>
              <input
                type="text"
                required
                value={txTitle}
                onChange={(e) => setTxTitle(e.target.value)}
                placeholder="e.g., Cloud Server Subscription"
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]/50"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Amount</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]/50 tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Category</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]/50"
                >
                  <option value="Food">Food & Dining</option>
                  <option value="Housing">Housing</option>
                  <option value="Utilities">Utilities & Tech</option>
                  <option value="Education">Education</option>
                  <option value="Salary">Salary / Retainer</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
            </div>
          </>
        )}

        {tab === 'focus' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Focus Objective</label>
              <input
                type="text"
                value={focusTask}
                onChange={(e) => setFocusTask(e.target.value)}
                placeholder="e.g., Code Refactor or Systems Writing"
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]/50"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Session Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {['25', '45', '60'].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setFocusDuration(mins)}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      focusDuration === mins
                        ? 'bg-[#61F5BB]/10 border-[#61F5BB] text-[#61F5BB]'
                        : 'border-white/10 bg-[#172331] text-[#9BAABC] hover:text-[#F4F7FC]'
                    }`}
                  >
                    {mins} minutes
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'journal' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Title (Optional)</label>
              <input
                type="text"
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                placeholder="e.g., Evening Breakthrough"
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Daily Reflection</label>
              <textarea
                required
                rows={3}
                value={journalReflection}
                onChange={(e) => setJournalReflection(e.target.value)}
                placeholder="What moved forward today? Where did you encounter friction?"
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">State of Mind</label>
              <div className="grid grid-cols-4 gap-2">
                {['Focused', 'Radiant', 'Calm', 'Exhausted'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setJournalMood(m)}
                    className={`py-1.5 rounded-lg text-xs font-medium border ${
                      journalMood === m
                        ? 'border-[#75CFFF] bg-[#75CFFF]/10 text-[#75CFFF]'
                        : 'border-white/10 bg-[#172331] text-[#9BAABC] hover:text-[#F4F7FC]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="pt-3 border-t border-white/8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#9BAABC] hover:text-[#F4F7FC] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium bg-[#61F5BB] text-[#080C12] font-semibold rounded-lg hover:bg-[#61F5BB]/90 transition-colors shadow-sm"
          >
            Save Record
          </button>
        </div>
      </form>
    </Modal>
  );
}
