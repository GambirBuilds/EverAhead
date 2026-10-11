import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Modal from '../components/common/Modal.jsx';
import {
  BookOpen,
  Plus,
  Clock,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Edit2,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function LearningPage() {
  const {
    learning,
    addSkill,
    updateSkill,
    deleteSkill,
    toggleSkillMilestone,
    logStudySession
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Study log modal
  const [studyModalSkill, setStudyModalSkill] = useState(null);
  const [logHoursInput, setLogHoursInput] = useState('1.5');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    level: 'Intermediate',
    targetHours: 50,
    description: '',
  });

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        title: skill.title,
        category: skill.category,
        level: skill.level,
        targetHours: skill.targetHours,
        description: skill.description,
      });
    } else {
      setEditingSkill(null);
      setFormData({
        title: '',
        category: 'Technical',
        level: 'Intermediate',
        targetHours: 50,
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingSkill) {
      updateSkill(editingSkill.id, formData);
    } else {
      addSkill({
        ...formData,
        milestones: [
          { id: 'm-1', title: 'Foundational Theory & Fundamentals', completed: false },
          { id: 'm-2', title: 'Hands-on Applied Project', completed: false },
          { id: 'm-3', title: 'Comprehensive Practical Evaluation', completed: false }
        ],
        resources: []
      });
    }
    setIsModalOpen(false);
  };

  const handleLogHours = (e) => {
    e.preventDefault();
    if (!studyModalSkill) return;
    logStudySession(studyModalSkill.id, Number(logHoursInput));
    setStudyModalSkill(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            Learning & Skill Mastery Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            Deliberate practice roadmaps, study logs, and self-directed curriculum mastery.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Skill Track</span>
        </button>
      </div>

      {/* Visual Roadmap Hero Card */}
      <div className="relative rounded-3xl bg-[#111923] border border-white/8 overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#61F5BB]">
            <GraduationCap className="w-4 h-4" />
            <span>Deliberate Practice Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#F4F7FC]">
            Accelerated Skill Acquisition
          </h2>
          <p className="text-xs sm:text-sm text-[#9BAABC] leading-relaxed">
            Organize complex subjects into manageable, project-based milestones. Log real study sessions to build verified mastery without passive illusion.
          </p>
          <div className="flex items-center gap-4 pt-2 text-xs text-[#9BAABC]">
            <span className="tabular-nums font-semibold text-[#F4F7FC]">
              {learning.length} Active Tracks
            </span>
            <span>·</span>
            <span className="tabular-nums font-semibold text-[#75CFFF]">
              {learning.reduce((sum, s) => sum + s.totalHoursInvested, 0)} Total Study Hours Logged
            </span>
          </div>
        </div>

        <div className="w-full md:w-80 h-44 rounded-2xl overflow-hidden border border-white/10 shrink-0">
          <img
            src="/src/assets/images/learning_skill_matrix_1791719934680.jpg"
            alt="Skills node roadmap"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Skill Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learning.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center rounded-2xl bg-[#111923] border border-white/8 space-y-3">
            <BookOpen className="w-8 h-8 text-[#9BAABC] mx-auto opacity-40" />
            <h3 className="text-sm font-semibold text-[#F4F7FC]">No learning tracks defined</h3>
            <p className="text-xs text-[#9BAABC] max-w-sm mx-auto">
              Create your first skill roadmap to log study hours and check off milestones.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-[#172331] hover:bg-[#1F2E40] text-xs font-semibold text-[#61F5BB] border border-white/10 rounded-xl"
            >
              Add Skill Track
            </button>
          </div>
        ) : (
          learning.map((skill) => {
            const percent = Math.min(100, Math.round((skill.totalHoursInvested / skill.targetHours) * 100));
            const milestones = skill.milestones || [];
            const completedMilestones = milestones.filter(m => m.completed).length;

            return (
              <div
                key={skill.id}
                className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9BAABC] mb-1">
                        {skill.category} · {skill.level}
                      </div>
                      <h3 className="text-base font-bold text-[#F4F7FC]">
                        {skill.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenModal(skill)}
                        className="p-1.5 text-[#9BAABC] hover:text-[#F4F7FC] rounded-lg transition-colors"
                        title="Edit skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(skill.id)}
                        className="p-1.5 text-[#9BAABC] hover:text-red-400 rounded-lg transition-colors"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#9BAABC] mt-2 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Progress & Log Button */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9BAABC] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#75CFFF]" />
                      <span className="font-semibold text-[#F4F7FC] tabular-nums">
                        {skill.totalHoursInvested}h
                      </span> / {skill.targetHours}h target
                    </span>
                    <span className="font-bold text-[#61F5BB] tabular-nums">
                      {percent}%
                    </span>
                  </div>

                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#61F5BB] to-[#75CFFF] h-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Milestones Checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-white/8">
                    <div className="text-[11px] font-semibold text-[#9BAABC] flex items-center justify-between">
                      <span>Curriculum Milestones ({completedMilestones}/{milestones.length})</span>
                    </div>
                    {milestones.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-[#172331]/50 border border-white/5"
                      >
                        <input
                          type="checkbox"
                          checked={m.completed}
                          onChange={() => toggleSkillMilestone(skill.id, m.id)}
                          className="rounded border-white/20 text-[#61F5BB] focus:ring-0 cursor-pointer"
                        />
                        <span className={`text-xs ${m.completed ? 'line-through text-[#9BAABC]' : 'text-[#F4F7FC]'}`}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Resources Links */}
                  {skill.resources && skill.resources.length > 0 && (
                    <div className="pt-2 text-xs space-y-1">
                      <span className="text-[11px] font-semibold text-[#9BAABC]">Reference Resources:</span>
                      {skill.resources.map((r, idx) => (
                        <a
                          key={idx}
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-[#75CFFF] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{r.title}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Log Study Session CTA */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setStudyModalSkill(skill);
                        setLogHoursInput('1.0');
                      }}
                      className="w-full py-2 bg-[#172331] hover:bg-[#1F2E40] border border-white/10 text-xs font-semibold text-[#61F5BB] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Study Hours</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill Track' : 'New Skill Roadmap'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Skill Name</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Transformer Models & Generative AI"
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="Technical">Technical</option>
                <option value="Design & Code">Design & Code</option>
                <option value="Language">Language</option>
                <option value="Science">Science</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Proficiency Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Mastery">Mastery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Target Hours</label>
              <input
                type="number"
                min="5"
                required
                value={formData.targetHours}
                onChange={(e) => setFormData({ ...formData, targetHours: Number(e.target.value) })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Syllabus / Learning Objectives</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Key concepts to cover, projects to build..."
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
              Save Track
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Hours Modal */}
      <Modal
        isOpen={Boolean(studyModalSkill)}
        onClose={() => setStudyModalSkill(null)}
        title={`Log Study Session: ${studyModalSkill?.title}`}
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleLogHours} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">
              Hours Studied (e.g. 1.5, 2.0)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              required
              value={logHoursInput}
              onChange={(e) => setLogHoursInput(e.target.value)}
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
              autoFocus
            />
          </div>

          <div className="pt-3 border-t border-white/8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setStudyModalSkill(null)}
              className="px-3 py-1.5 text-xs text-[#9BAABC] hover:text-[#F4F7FC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-lg"
            >
              Log Time
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Skill Track"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9BAABC]">Are you sure you want to delete this skill roadmap?</p>
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
                deleteSkill(deleteConfirmId);
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
