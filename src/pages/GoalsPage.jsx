import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Modal from '../components/common/Modal.jsx';
import { formatDate } from '../utils/formatters.js';
import {
  Target,
  Plus,
  CheckCircle2,
  Calendar,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, addMilestone, toggleMilestone } = useApp();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedGoalId, setExpandedGoalId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newMilestoneInputs, setNewMilestoneInputs] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'career',
    description: '',
    targetDate: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
  });

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title: goal.title,
        category: goal.category,
        description: goal.description,
        targetDate: goal.targetDate,
      });
    } else {
      setEditingGoal(null);
      setFormData({
        title: '',
        category: 'career',
        description: '',
        targetDate: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, formData);
    } else {
      addGoal(formData);
    }
    setIsModalOpen(false);
  };

  const handleAddMilestone = (goalId) => {
    const text = newMilestoneInputs[goalId];
    if (!text || !text.trim()) return;
    addMilestone(goalId, text);
    setNewMilestoneInputs({ ...newMilestoneInputs, [goalId]: '' });
  };

  // Filter goals
  const filteredGoals = goals.filter((g) => {
    const isCompleted = g.progress === 100;
    if (activeTab === 'active' && isCompleted) return false;
    if (activeTab === 'completed' && !isCompleted) return false;
    if (selectedCategory !== 'all' && g.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            Objectives & Major Goals
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            Break high-horizon aspirations into sequential milestones and daily momentum.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Objective</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111923] border border-white/8">
        <div className="flex items-center gap-1 p-1 bg-[#172331] rounded-xl text-xs font-medium text-[#9BAABC]">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'active' ? 'bg-[#111923] text-[#61F5BB] font-semibold shadow-sm' : 'hover:text-[#F4F7FC]'
            }`}
          >
            Active Goals ({goals.filter(g => g.progress < 100).length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'completed' ? 'bg-[#111923] text-[#61F5BB] font-semibold shadow-sm' : 'hover:text-[#F4F7FC]'
            }`}
          >
            Completed ({goals.filter(g => g.progress === 100).length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#9BAABC]">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#172331] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#F4F7FC] focus:outline-none"
          >
            <option value="all">All Domains</option>
            <option value="career">Career</option>
            <option value="learning">Learning</option>
            <option value="financial">Financial</option>
            <option value="health">Health</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center rounded-2xl bg-[#111923] border border-white/8 space-y-3">
            <Target className="w-8 h-8 text-[#9BAABC] mx-auto opacity-40" />
            <h3 className="text-sm font-semibold text-[#F4F7FC]">No goals found</h3>
            <p className="text-xs text-[#9BAABC] max-w-sm mx-auto">
              {activeTab === 'active'
                ? 'You have accomplished all objectives or none match your category filter.'
                : 'No completed goals yet. Complete all milestones in a goal to mark it finished.'}
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-[#172331] hover:bg-[#1F2E40] text-xs font-semibold text-[#61F5BB] border border-white/10 rounded-xl"
            >
              Initiate Objective
            </button>
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const isExpanded = expandedGoalId === goal.id;
            const milestones = goal.milestones || [];
            const completedMilestones = milestones.filter(m => m.completed).length;

            return (
              <div
                key={goal.id}
                className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4 hover:border-white/15 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9BAABC] capitalize mb-1">
                        {goal.category}
                      </div>
                      <h3 className="text-base font-bold text-[#F4F7FC] leading-snug">
                        {goal.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenModal(goal)}
                        className="p-1.5 text-[#9BAABC] hover:text-[#F4F7FC] rounded-lg transition-colors"
                        title="Edit goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(goal.id)}
                        className="p-1.5 text-[#9BAABC] hover:text-red-400 rounded-lg transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-xs text-[#9BAABC] mt-2 line-clamp-2 leading-relaxed">
                      {goal.description}
                    </p>
                  )}
                </div>

                {/* Progress Bar & Indicators */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9BAABC]">
                      Milestones ({completedMilestones}/{milestones.length})
                    </span>
                    <span className="font-bold text-[#61F5BB] tabular-nums">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#61F5BB] to-[#75CFFF] h-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#9BAABC] pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#75CFFF]" />
                      <span>Target: {formatDate(goal.targetDate)}</span>
                    </span>
                    <button
                      onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                      className="text-[#75CFFF] hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide' : 'Manage'} Milestones</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Milestones Breakdown */}
                {isExpanded && (
                  <div className="pt-3 border-t border-white/8 space-y-3">
                    <div className="space-y-1.5">
                      {milestones.length === 0 ? (
                        <p className="text-xs text-[#9BAABC] italic">No milestones defined yet.</p>
                      ) : (
                        milestones.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-2.5 p-2 rounded-lg bg-[#172331]/50 border border-white/5"
                          >
                            <input
                              type="checkbox"
                              checked={m.completed}
                              onChange={() => toggleMilestone(goal.id, m.id)}
                              className="rounded border-white/20 text-[#61F5BB] focus:ring-0 cursor-pointer"
                            />
                            <span className={`text-xs flex-1 ${m.completed ? 'line-through text-[#9BAABC]' : 'text-[#F4F7FC]'}`}>
                              {m.title}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Milestone Inline */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add next actionable milestone..."
                        value={newMilestoneInputs[goal.id] || ''}
                        onChange={(e) =>
                          setNewMilestoneInputs({ ...newMilestoneInputs, [goal.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddMilestone(goal.id);
                          }
                        }}
                        className="flex-1 bg-[#172331] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#F4F7FC] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#61F5BB]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddMilestone(goal.id)}
                        className="px-3 py-1.5 bg-[#172331] hover:bg-[#1F2E40] border border-white/10 text-xs font-semibold text-[#61F5BB] rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Edit Objective' : 'New Objective'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Objective Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Deliver Next-Gen Distributed Architecture"
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Domain</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="career">Career</option>
                <option value="learning">Learning</option>
                <option value="financial">Financial</option>
                <option value="health">Health</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Target Completion Date</label>
              <input
                type="date"
                required
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Description & Vision</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Why does this matter? What does success look like?"
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
              {editingGoal ? 'Save Objective' : 'Initiate Objective'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Objective"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9BAABC]">
            Are you sure you want to delete this objective and all associated milestones?
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
                deleteGoal(deleteConfirmId);
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
