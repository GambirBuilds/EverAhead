import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Modal from '../components/common/Modal.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import {
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Trash2,
  PieChart as PieIcon,
  PiggyBank,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

export default function FinancePage() {
  const {
    finance,
    addTransaction,
    deleteTransaction,
    updateBudget,
    addSavingsGoal,
    updateSavingsGoalAmount,
    settings,
    updateSettings
  } = useApp();

  const currentCurrency = finance.currency || settings?.currency || 'NPR';

  // Transaction Modal State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [deleteTxId, setDeleteTxId] = useState(null);

  // Budget Edit Modal State
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(finance.monthlyBudget));

  // Savings Goal Modal State
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [savingsFormData, setSavingsFormData] = useState({
    name: '',
    targetAmount: 50000,
    currentAmount: 0,
    deadline: '2026-12-31'
  });

  // Transaction Form State
  const [txFormData, setTxFormData] = useState({
    title: '',
    amount: '',
    type: 'expense', // 'expense' | 'income'
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Calculate Monthly Totals
  const currentMonthStr = new Date().toISOString().substring(0, 7); // 'YYYY-MM'

  const currentMonthTransactions = useMemo(() => {
    return finance.transactions.filter(t => t.date.startsWith(currentMonthStr));
  }, [finance.transactions, currentMonthStr]);

  const totalIncome = useMemo(() => {
    return currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [currentMonthTransactions]);

  const totalExpenses = useMemo(() => {
    return currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [currentMonthTransactions]);

  const netSavings = totalIncome - totalExpenses;
  const budgetUtilization = finance.monthlyBudget > 0
    ? Math.round((totalExpenses / finance.monthlyBudget) * 100)
    : 0;

  // Breakdown by Category for Expenses
  const categoryBreakdown = useMemo(() => {
    const map = {};
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount || 0);
      });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [currentMonthTransactions]);

  // Chart data: Income vs Expense comparison
  const comparisonData = useMemo(() => [
    { name: 'Income', amount: totalIncome, fill: '#61F5BB' },
    { name: 'Expenses', amount: totalExpenses, fill: '#FF6B6B' },
  ], [totalIncome, totalExpenses]);

  const handleTxSubmit = (e) => {
    e.preventDefault();
    if (!txFormData.title.trim() || !txFormData.amount) return;
    addTransaction(txFormData);
    setTxFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsTxModalOpen(false);
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    updateBudget(Number(budgetInput));
    setIsBudgetModalOpen(false);
  };

  const handleSavingsSubmit = (e) => {
    e.preventDefault();
    if (!savingsFormData.name.trim()) return;
    addSavingsGoal(savingsFormData);
    setSavingsFormData({
      name: '',
      targetAmount: 50000,
      currentAmount: 0,
      deadline: '2026-12-31'
    });
    setIsSavingsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7FC]">
            Personal Finance & Capital Flow
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1">
            Track monthly cash flow, budget containment, and dedicated savings reserves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency Selector */}
          <div className="flex items-center gap-1.5 bg-[#172331] px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
            <span className="text-[#9BAABC]">Currency:</span>
            <select
              value={currentCurrency}
              onChange={(e) => {
                updateSettings({ currency: e.target.value });
              }}
              className="bg-transparent font-bold text-[#61F5BB] focus:outline-none cursor-pointer"
            >
              <option value="NPR" className="bg-[#111923] text-white">NPR (रु)</option>
              <option value="USD" className="bg-[#111923] text-white">USD ($)</option>
              <option value="EUR" className="bg-[#111923] text-white">EUR (€)</option>
              <option value="GBP" className="bg-[#111923] text-white">GBP (£)</option>
            </select>
          </div>

          <button
            onClick={() => setIsTxModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-xl hover:bg-[#61F5BB]/90 transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Record Entry</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BAABC]">
            <span>Monthly Inflow</span>
            <TrendingUp className="w-4 h-4 text-[#61F5BB]" />
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {formatCurrency(totalIncome, currentCurrency)}
          </div>
          <p className="text-[11px] text-[#9BAABC]">Verified receipts for this month</p>
        </div>

        {/* Expenses Card */}
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BAABC]">
            <span>Monthly Outflow</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 tabular-nums">
            {formatCurrency(totalExpenses, currentCurrency)}
          </div>
          <p className="text-[11px] text-[#9BAABC]">Total expenditures logged</p>
        </div>

        {/* Net Savings Buffer */}
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BAABC]">
            <span>Net Monthly Buffer</span>
            <DollarSign className="w-4 h-4 text-[#75CFFF]" />
          </div>
          <div className={`text-2xl font-bold tabular-nums ${netSavings >= 0 ? 'text-[#61F5BB]' : 'text-red-400'}`}>
            {formatCurrency(netSavings, currentCurrency)}
          </div>
          <p className="text-[11px] text-[#9BAABC]">Inflow minus outflow</p>
        </div>

        {/* Budget Utilization Card */}
        <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BAABC]">
            <span>Budget Utilization</span>
            <button
              onClick={() => {
                setBudgetInput(String(finance.monthlyBudget));
                setIsBudgetModalOpen(true);
              }}
              className="text-[#61F5BB] hover:underline"
            >
              Edit Budget
            </button>
          </div>
          <div className="text-2xl font-bold text-[#F4F7FC] tabular-nums">
            {budgetUtilization}%
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${budgetUtilization > 90 ? 'bg-red-400' : 'bg-[#61F5BB]'}`}
              style={{ width: `${Math.min(100, budgetUtilization)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cashflow Chart & Categories (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F4F7FC]">Inflow vs Outflow Comparison</h2>
              <span className="text-xs text-[#9BAABC]">Current Month</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111923', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                    itemStyle={{ color: '#F4F7FC' }}
                    formatter={(val) => formatCurrency(val, currentCurrency)}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Categories List */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-3">
            <h2 className="text-sm font-bold text-[#F4F7FC]">Spending by Category</h2>
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-[#9BAABC] italic py-3">No expenses logged for this period.</p>
            ) : (
              <div className="space-y-2">
                {categoryBreakdown.map((item) => {
                  const share = totalExpenses > 0 ? Math.round((item.value / totalExpenses) * 100) : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-[#172331]/50 border border-white/5 text-xs">
                      <div>
                        <span className="font-semibold text-[#F4F7FC]">{item.name}</span>
                        <span className="text-[10px] text-[#9BAABC] ml-2">({share}%)</span>
                      </div>
                      <span className="font-mono text-[#F4F7FC] tabular-nums">
                        {formatCurrency(item.value, currentCurrency)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Savings Goals & Transactions Table (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Savings Goals */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F4F7FC] flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-[#61F5BB]" />
                <span>Dedicated Savings Reserves</span>
              </h2>
              <button
                onClick={() => setIsSavingsModalOpen(true)}
                className="text-xs text-[#61F5BB] hover:underline"
              >
                + Add Goal
              </button>
            </div>

            <div className="space-y-3">
              {(finance.savingsGoals || []).map((goal) => {
                const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} className="p-3.5 rounded-xl bg-[#172331]/60 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F4F7FC]">{goal.name}</span>
                      <span className="text-xs font-bold text-[#61F5BB] tabular-nums">{percent}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#61F5BB] to-[#75CFFF] h-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#9BAABC]">
                      <span>{formatCurrency(goal.currentAmount, currentCurrency)} / {formatCurrency(goal.targetAmount, currentCurrency)}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateSavingsGoalAmount(goal.id, 5000)}
                          className="px-2 py-0.5 bg-[#111923] hover:bg-[#1F2E40] border border-white/10 rounded text-[10px] text-[#61F5BB]"
                        >
                          +5,000
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transactions Log */}
          <div className="p-5 rounded-2xl bg-[#111923] border border-white/8 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F4F7FC]">Recent Transactions</h2>
              <span className="text-xs text-[#9BAABC] tabular-nums">
                {finance.transactions.length} records
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {finance.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#172331]/50 border border-white/5 text-xs group"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="font-semibold text-[#F4F7FC] truncate">{tx.title}</div>
                    <div className="text-[10px] text-[#9BAABC]">
                      {tx.category} · {formatDate(tx.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-mono font-bold tabular-nums ${
                      tx.type === 'income' ? 'text-[#61F5BB]' : 'text-red-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currentCurrency)}
                    </span>
                    <button
                      onClick={() => setDeleteTxId(tx.id)}
                      className="p-1 text-[#9BAABC] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Record Transaction Modal */}
      <Modal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        title="Record Financial Transaction"
      >
        <form onSubmit={handleTxSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#172331] rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTxFormData({ ...txFormData, type: 'expense' })}
              className={`py-2 rounded-lg transition-colors ${
                txFormData.type === 'expense' ? 'bg-[#111923] text-red-400 font-bold' : 'text-[#9BAABC]'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setTxFormData({ ...txFormData, type: 'income' })}
              className={`py-2 rounded-lg transition-colors ${
                txFormData.type === 'income' ? 'bg-[#111923] text-[#61F5BB] font-bold' : 'text-[#9BAABC]'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Description</label>
            <input
              type="text"
              required
              value={txFormData.title}
              onChange={(e) => setTxFormData({ ...txFormData, title: e.target.value })}
              placeholder="e.g., Optical fiber ISP invoice"
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">
                Amount ({currentCurrency})
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={txFormData.amount}
                onChange={(e) => setTxFormData({ ...txFormData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB] tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Category</label>
              <select
                value={txFormData.category}
                onChange={(e) => setTxFormData({ ...txFormData, category: e.target.value })}
                className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F7FC] focus:outline-none"
              >
                <option value="Food">Food & Dining</option>
                <option value="Housing">Housing</option>
                <option value="Utilities">Utilities & Tech</option>
                <option value="Education">Education</option>
                <option value="Health">Health & Wellness</option>
                <option value="Salary">Salary / Retainer</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Date</label>
            <input
              type="date"
              required
              value={txFormData.date}
              onChange={(e) => setTxFormData({ ...txFormData, date: e.target.value })}
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-white/8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsTxModalOpen(false)}
              className="px-4 py-2 text-xs text-[#9BAABC] hover:text-[#F4F7FC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-lg hover:bg-[#61F5BB]/90 shadow-sm"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Monthly Budget Modal */}
      <Modal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        title="Set Monthly Budget Target"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleBudgetSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">
              Target Monthly Limit ({currentCurrency})
            </label>
            <input
              type="number"
              min="0"
              required
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB] tabular-nums"
            />
          </div>
          <div className="pt-3 border-t border-white/8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBudgetModalOpen(false)}
              className="px-3 py-1.5 text-xs text-[#9BAABC] hover:text-[#F4F7FC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-lg"
            >
              Save Budget
            </button>
          </div>
        </form>
      </Modal>

      {/* Savings Goal Modal */}
      <Modal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
        title="Create Savings Reserve Target"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleSavingsSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Reserve Goal Name</label>
            <input
              type="text"
              required
              value={savingsFormData.name}
              onChange={(e) => setSavingsFormData({ ...savingsFormData, name: e.target.value })}
              placeholder="e.g., Emergency Buffer or Hardware Lab"
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-[#F4F7FC] focus:outline-none focus:border-[#61F5BB]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#9BAABC] mb-1.5">Target Amount ({currentCurrency})</label>
            <input
              type="number"
              min="100"
              required
              value={savingsFormData.targetAmount}
              onChange={(e) => setSavingsFormData({ ...savingsFormData, targetAmount: Number(e.target.value) })}
              className="w-full bg-[#172331] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F7FC] focus:outline-none"
            />
          </div>
          <div className="pt-3 border-t border-white/8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSavingsModalOpen(false)}
              className="px-3 py-1.5 text-xs text-[#9BAABC] hover:text-[#F4F7FC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#61F5BB] text-[#080C12] text-xs font-bold rounded-lg"
            >
              Save Goal
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Tx Confirmation */}
      <Modal
        isOpen={Boolean(deleteTxId)}
        onClose={() => setDeleteTxId(null)}
        title="Delete Transaction"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9BAABC]">Are you sure you want to remove this financial transaction record?</p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteTxId(null)}
              className="px-3 py-1.5 text-xs text-[#9BAABC] hover:text-[#F4F7FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                deleteTransaction(deleteTxId);
                setDeleteTxId(null);
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
