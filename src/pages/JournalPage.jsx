import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Modal from '../components/common/Modal.jsx';
import { formatDate } from '../utils/formatters.js';
import {
  BookOpen,
  Plus,
  Search,
  Download,
  Trash2,
  Edit2,
  Smile,
  Heart,
  Sparkles,
  Lock,
  Calendar
} from 'lucide-react';

const GUIDED_PROMPTS = [
  "What was the single most leverage-producing action you took today?",
  "What gave you sustained energy, and what drained your focus?",
  "What is one truth or lesson you want to remember from today?",
  "How did you handle resistance or unexpected obstacles today?"
];

export default function JournalPage() {
  const { journal, addJournalEntry, updateJournalEntry, deleteJournalEntry, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    mood: 'Focused',
    energy: 8,
    reflection: '',
    gratitude: '',
    wins: '',
  });

  const handleOpenModal = (entry = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        title: entry.title,
        date: entry.date,
        mood: entry.mood,
        energy: entry.energy || 8,
        reflection: entry.reflection,
        gratitude: entry.gratitude || '',
        wins: entry.wins || '',
      });
    } else {
      setEditingEntry(null);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        mood: 'Focused',
        energy: 8,
        reflection: '',
        gratitude: '',
        wins: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reflection.trim()) return;

    if (editingEntry) {
      updateJournalEntry(editingEntry.id, formData);
    } else {
      addJournalEntry(formData);
    }
    setIsModalOpen(false);
  };

  // Export Journal Entries to text file
  const handleExportJournal = () => {
    const textContent = journal.map(entry => {
      return `==========================================
DATE: ${entry.date} | MOOD: ${entry.mood} | ENERGY: ${entry.energy}/10
TITLE: ${entry.title}
------------------------------------------
REFLECTION:
${entry.reflection}

GRATITUDE:
${entry.gratitude || 'None recorded'}

KEY WINS:
${entry.wins || 'None recorded'}
==========================================\n\n`;
    }).join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `everahead-journal-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Journal notes exported to text file');
  };

  const filteredJournal = useMemo(() => {
    return journal.filter(entry => {
      if (selectedMoodFilter !== 'all' && entry.mood !== selectedMoodFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = entry.title.toLowerCase().includes(q);
        const matchesRef = (entry.reflection || '').toLowerCase().includes(q);
        const matchesGrat = (entry.gratitude || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesRef && !matchesGrat) return false;
      }
      return true;
    });
  }, [journal, selectedMoodFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            Private Journal & Reflection
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            Deliberate introspective inquiry, gratitude logs, and emotional resonance calibration.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJournal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#172331] hover:bg-[#1F2E40] border border-white/10 text-xs font-semibold text-[#F4F7FC] rounded-xl transition-colors"
            title="Download plain text export"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Notes</span>
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Reflection</span>
          </button>
        </div>
      </div>

      {/* Guided Prompt Spark */}
      <div className="p-4 rounded-2xl bg-[#111923] border border-white/8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#61F5BB]/10 border border-[#61F5BB]/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#61F5BB]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9BAABC]">
              Daily Inquiry Prompt
            </span>
            <p className="text-xs text-[#F4F7FC] font-medium">
              "{GUIDED_PROMPTS[new Date().getDate() % GUIDED_PROMPTS.length]}"
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const promptText = GUIDED_PROMPTS[new Date().getDate() % GUIDED_PROMPTS.length];
            setFormData({
              title: 'Daily Inquiry',
              date: new Date().toISOString().split('T')[0],
              mood: 'Focused',
              energy: 8,
              reflection: `Prompt: ${promptText}\n\nReflection: `,
              gratitude: '',
              wins: '',
            });
            setIsModalOpen(true);
          }}
          className="px-3 py-1.5 bg-[#172331] hover:bg-[#1F2E40] text-xs font-semibold text-[#61F5BB] rounded-lg shrink-0 border border-white/10"
        >
          Answer Prompt
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#111923] border border-white/8 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#9BAABC] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal entries..."
            className="w-full bg-[#172331] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#F4F7FC] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#61F5BB]"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <span className="text-[#9BAABC]">Mood:</span>
          <div className="flex items-center gap-1 p-1 bg-[#172331] rounded-xl text-xs font-medium text-[#9BAABC]">
            {['all', 'Focused', 'Radiant', 'Calm', 'Exhausted'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMoodFilter(m)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  selectedMoodFilter === m ? 'bg-[#111923] text-[#61F5BB] font-semibold' : 'hover:text-[#F4F7FC]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Journal Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJournal.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center rounded-2xl bg-[#111923] border border-white/8 space-y-3">
            <BookOpen className="w-8 h-8 text-[#9BAABC] mx-auto opacity-40" />
            <h3 className="text-sm font-semibold text-[#F4F7FC]">No journal entries found</h3>
            <p className="text-xs text-[#9BAABC] max-w-sm mx-auto">
              Write down your first introspection or search with a different keyword.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-[#172331] hover:bg-[#1F2E40] text-xs font-semibold text-[#61F5BB] border border-white/10 rounded-xl"
            >
              Write First Reflection
            </button>
          </div>
        ) : (
          filteredJournal.map((entry) => (
            <div
              key={entry.id}
              className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4 hover:border-white/15 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
                  <div>
                    <div className="text-[11px] text-[#9BAABC] flex items-center gap-2 mb-1">
                      <span>{formatDate(entry.date, { year: true })}</span>
                      <span>·</span>
                      <span className="text-[#75CFFF] font-semibold">{entry.mood}</span>
                      <span>·</span>
                      <span className="tabular-nums">Energy {entry.energy}/10</span>
                    </div>
                    <h3 className="text-base font-bold text-[#F4F7FC]">
                      {entry.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenModal(entry)}
                      className="p-1.5 text-[#9BAABC] hover:text-[#F4F7FC] rounded-lg transition-colors"
                      title="Edit entry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(entry.id)}
                      className="p-1.5 text-[#9BAABC] hover:text-red-400 rounded-lg transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-3 text-xs">
                  <p className="text-[#F4F7FC] whitespace-pre-wrap leading-relaxed">
                    {entry.reflection}
                  </p>

                  {entry.gratitude && (
                    <div className="p-3 rounded-xl bg-[#172331]/50 border border-white/5 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#61F5BB]">
                        Gratitude Note
                      </div>
                      <p className="text-[#9BAABC]">{entry.gratitude}</p>
                    </div>
                  )}

                  {entry.wins && (
                    <div className="p-3 rounded-xl bg-[#172331]/50 border border-white/5 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#75CFFF]">
                        Breakthrough Win
                      </div>
                      <p className="text-[#9BAABC]">{entry.wins}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#9BAABC]">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#61F5BB]" />
                  <span>Private Local Record</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntry ? 'Edit Reflection' : 'New Journal Reflection'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Title / Subject</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Deep Clarity on Systems Flow"
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
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Mood State</label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              >
                <option value="Focused">Focused</option>
                <option value="Radiant">Radiant</option>
                <option value="Calm">Calm</option>
                <option value="Exhausted">Exhausted</option>
                <option value="Anxious">Anxious</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Energy Level (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.energy}
                onChange={(e) => setFormData({ ...formData, energy: Number(e.target.value) })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Reflection & Notes</label>
            <textarea
              rows={4}
              required
              value={formData.reflection}
              onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
              placeholder="What moved the needle today? Where was your attention tested?"
              className="w-full bg-[#172331] border border-white/10 rounded-xl p-3 text-xs text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Gratitude (Optional)</label>
              <input
                type="text"
                value={formData.gratitude}
                onChange={(e) => setFormData({ ...formData, gratitude: e.target.value })}
                placeholder="What are you thankful for?"
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Key Win (Optional)</label>
              <input
                type="text"
                value={formData.wins}
                onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
                placeholder="One accomplishment..."
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
              />
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
              {editingEntry ? 'Save Changes' : 'Store Reflection'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Reflection"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9BAABC]">Are you sure you want to delete this journal entry?</p>
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
                deleteJournalEntry(deleteConfirmId);
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
