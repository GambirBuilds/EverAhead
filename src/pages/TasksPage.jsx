import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Modal from '../components/common/Modal.jsx';
import { formatDate, getRelativeDayLabel } from '../utils/formatters.js';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle,
  ArrowUpDown,
  Tag
} from 'lucide-react';

export default function TasksPage() {
  const { tasks, goals, addTask, updateTask, deleteTask, toggleTaskStatus } = useApp();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, completed, overdue
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, createdAt, title

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'work',
    dueDate: new Date().toISOString().split('T')[0],
    goalId: '',
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Open modal for new task or editing task
  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'work',
        dueDate: task.dueDate || todayStr,
        goalId: task.goalId || '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'work',
        dueDate: todayStr,
        goalId: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    setIsModalOpen(false);
  };

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = (task.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Status
      if (statusFilter === 'pending' && task.status !== 'pending') return false;
      if (statusFilter === 'completed' && task.status !== 'completed') return false;
      if (statusFilter === 'overdue') {
        const isOverdue = task.status === 'pending' && task.dueDate < todayStr;
        if (!isOverdue) return false;
      }

      // Priority
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Category
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      }
      if (sortBy === 'priority') {
        const weight = { high: 3, medium: 2, low: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      if (sortBy === 'createdAt') {
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy, todayStr]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            Tasks & Action Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            Organize daily tasks, milestones, and high-leverage execution.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111923] border border-white/8 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9BAABC] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title or keyword..."
              className="w-full bg-[#172331] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#F4F7FC] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#61F5BB]"
            />
          </div>

          {/* Status Filter Segmented */}
          <div className="flex items-center gap-1 p-1 bg-[#172331] rounded-xl text-xs font-medium text-[#9BAABC]">
            {['all', 'pending', 'completed', 'overdue'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  statusFilter === s ? 'bg-[#111923] text-[#61F5BB] font-semibold shadow-sm' : 'hover:text-[#F4F7FC]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#9BAABC]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#172331] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#F4F7FC] focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#9BAABC]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#172331] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#F4F7FC] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="learning">Learning</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[#9BAABC]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#172331] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#F4F7FC] focus:outline-none"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Date Created</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#111923] border border-white/8 space-y-3">
            <CheckSquare className="w-8 h-8 text-[#9BAABC] mx-auto opacity-40" />
            <h3 className="text-sm font-semibold text-[#F4F7FC]">No tasks found</h3>
            <p className="text-xs text-[#9BAABC] max-w-sm mx-auto">
              There are no tasks matching your selected filters. Create a new task or adjust your filters.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-[#172331] hover:bg-[#1F2E40] text-xs font-semibold text-[#61F5BB] border border-white/10 rounded-xl transition-colors"
            >
              Create New Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isOverdue = task.status === 'pending' && task.dueDate < todayStr;
            const associatedGoal = goals.find(g => g.id === task.goalId);

            return (
              <div
                key={task.id}
                className="flex items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#111923] hover:bg-[#172331]/50 border border-white/8 transition-all group"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-0.5 sm:mt-0 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      task.status === 'completed'
                        ? 'bg-[#61F5BB] border-[#61F5BB] text-[#080C12]'
                        : 'border-white/30 hover:border-[#61F5BB]'
                    }`}
                    aria-label="Toggle task status"
                  >
                    {task.status === 'completed' && <span className="text-[10px] font-bold">✓</span>}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs sm:text-sm font-medium ${
                        task.status === 'completed' ? 'line-through text-[#9BAABC]' : 'text-[#F4F7FC]'
                      }`}>
                        {task.title}
                      </span>

                      {/* Overdue alert */}
                      {isOverdue && (
                        <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Overdue
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-[#9BAABC] mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                    {/* Metadata line without pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-[#9BAABC]">
                      <span className="capitalize">{task.category}</span>
                      <span>·</span>
                      <span className={task.priority === 'high' ? 'text-amber-400 font-semibold' : ''}>
                        {task.priority} priority
                      </span>
                      <span>·</span>
                      <span className="tabular-nums">Due {getRelativeDayLabel(task.dueDate)}</span>
                      {associatedGoal && (
                        <>
                          <span>·</span>
                          <span className="text-[#C2A4FF] truncate max-w-[150px]">
                            Goal: {associatedGoal.title}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(task)}
                    className="p-1.5 text-[#9BAABC] hover:text-[#F4F7FC] hover:bg-white/5 rounded-lg transition-colors"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(task.id)}
                    className="p-1.5 text-[#9BAABC] hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Deploy production telemetry collector"
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Description (Optional)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details, links, or success criteria..."
              className="w-full bg-[#172331] border border-white/10 rounded-xl p-3 text-xs text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="work">Work</option>
                <option value="learning">Learning</option>
                <option value="health">Health</option>
                <option value="finance">Finance</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
              </input>
            </div>
          </div>

          {goals.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Associated Goal</label>
              <select
                value={formData.goalId}
                onChange={(e) => setFormData({ ...formData, goalId: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="">None (Stand-alone task)</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.category})
                  </option>
                ))}
              </select>
            </div>
          )}

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
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Task"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9BAABC]">
            Are you sure you want to delete this task? This action cannot be undone.
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
                deleteTask(deleteConfirmId);
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
