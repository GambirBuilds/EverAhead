import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  loadStoredData,
  saveStoredData,
  validateImportedData,
  exportDataAsJSON,
  resetDataStore,
  INITIAL_DEMO_DATA,
} from '../utils/storage.js';
import { generateId } from '../utils/formatters.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(() => loadStoredData());
  const [toast, setToast] = useState(null);

  // Sync to localStorage whenever data changes
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Apply dynamic color palette and theme to document element
  useEffect(() => {
    const isLight = data.settings?.theme === 'light';
    const colorTheme = isLight ? 'light' : (data.settings?.colorTheme || 'aurora');

    document.documentElement.setAttribute('data-theme', colorTheme);
    if (isLight) {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [data.settings?.theme, data.settings?.colorTheme]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  /* ----------------- Settings ----------------- */
  const updateSettings = useCallback((newSettings) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
    showToast('Settings saved successfully');
  }, [showToast]);

  const toggleTheme = useCallback(() => {
    setData(prev => {
      const nextTheme = prev.settings.theme === 'dark' ? 'light' : 'dark';
      return {
        ...prev,
        settings: {
          ...prev.settings,
          theme: nextTheme,
          colorTheme: nextTheme === 'light' ? 'light' : (prev.settings.colorTheme === 'light' ? 'aurora' : (prev.settings.colorTheme || 'aurora'))
        }
      };
    });
  }, []);

  const setColorTheme = useCallback((palette) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        colorTheme: palette,
        theme: palette === 'light' ? 'light' : 'dark'
      }
    }));
    const names = {
      aurora: 'Emerald Aurora',
      nebula: 'Cyber Nebula',
      ocean: 'Deep Ocean',
      amber: 'Solar Eclipse',
      light: 'Alabaster Daylight'
    };
    showToast(`Color palette switched to ${names[palette] || palette}`);
  }, [showToast]);

  /* ----------------- Tasks ----------------- */
  const addTask = useCallback((taskInput) => {
    const newTask = {
      id: generateId('task'),
      title: taskInput.title.trim(),
      description: taskInput.description?.trim() || '',
      priority: taskInput.priority || 'medium',
      category: taskInput.category || 'work',
      status: 'pending',
      dueDate: taskInput.dueDate || new Date().toISOString().split('T')[0],
      goalId: taskInput.goalId || null,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
    showToast(`Task "${newTask.title}" created`);
    return newTask;
  }, [showToast]);

  const updateTask = useCallback((taskId, updates) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    }));
    showToast('Task updated');
  }, [showToast]);

  const deleteTask = useCallback((taskId) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
    showToast('Task deleted', 'info');
  }, [showToast]);

  const toggleTaskStatus = useCallback((taskId) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : null
          };
        }
        return t;
      })
    }));
  }, []);

  /* ----------------- Goals ----------------- */
  const addGoal = useCallback((goalInput) => {
    const newGoal = {
      id: generateId('goal'),
      title: goalInput.title.trim(),
      category: goalInput.category || 'career',
      description: goalInput.description?.trim() || '',
      targetDate: goalInput.targetDate || new Date().toISOString().split('T')[0],
      progress: 0,
      milestones: goalInput.milestones || [],
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      goals: [newGoal, ...prev.goals]
    }));
    showToast(`Goal "${newGoal.title}" initiated`);
    return newGoal;
  }, [showToast]);

  const updateGoal = useCallback((goalId, updates) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => (g.id === goalId ? { ...g, ...updates } : g))
    }));
    showToast('Goal updated');
  }, [showToast]);

  const deleteGoal = useCallback((goalId) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId)
    }));
    showToast('Goal removed', 'info');
  }, [showToast]);

  const toggleMilestone = useCallback((goalId, milestoneId) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id === goalId) {
          const updatedMilestones = g.milestones.map(m =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = updatedMilestones.filter(m => m.completed).length;
          const calculatedProgress = updatedMilestones.length > 0
            ? Math.round((completedCount / updatedMilestones.length) * 100)
            : g.progress;
          return {
            ...g,
            milestones: updatedMilestones,
            progress: calculatedProgress
          };
        }
        return g;
      })
    }));
  }, []);

  const addMilestone = useCallback((goalId, title) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id === goalId) {
          const newMilestone = {
            id: generateId('m'),
            title: title.trim(),
            completed: false
          };
          const updatedMilestones = [...(g.milestones || []), newMilestone];
          const completedCount = updatedMilestones.filter(m => m.completed).length;
          const calculatedProgress = Math.round((completedCount / updatedMilestones.length) * 100);
          return {
            ...g,
            milestones: updatedMilestones,
            progress: calculatedProgress
          };
        }
        return g;
      })
    }));
    showToast('Milestone added');
  }, [showToast]);

  /* ----------------- Habits ----------------- */
  const addHabit = useCallback((habitInput) => {
    const newHabit = {
      id: generateId('habit'),
      name: habitInput.name.trim(),
      category: habitInput.category || 'productivity',
      frequency: habitInput.frequency || 'daily',
      icon: habitInput.icon || 'Zap',
      history: habitInput.history || [],
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit]
    }));
    showToast(`Habit "${newHabit.name}" created`);
    return newHabit;
  }, [showToast]);

  const updateHabit = useCallback((habitId, updates) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => (h.id === habitId ? { ...h, ...updates } : h))
    }));
    showToast('Habit updated');
  }, [showToast]);

  const deleteHabit = useCallback((habitId) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== habitId)
    }));
    showToast('Habit deleted', 'info');
  }, [showToast]);

  const toggleHabitDate = useCallback((habitId, dateStr) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id === habitId) {
          const exists = h.history.includes(dateStr);
          const newHistory = exists
            ? h.history.filter(d => d !== dateStr)
            : [...h.history, dateStr];
          return { ...h, history: newHistory };
        }
        return h;
      })
    }));
  }, []);

  /* ----------------- Calendar Events ----------------- */
  const addEvent = useCallback((eventInput) => {
    const newEvent = {
      id: generateId('evt'),
      title: eventInput.title.trim(),
      date: eventInput.date || new Date().toISOString().split('T')[0],
      startTime: eventInput.startTime || '09:00',
      endTime: eventInput.endTime || '10:00',
      category: eventInput.category || 'work',
      description: eventInput.description?.trim() || '',
    };
    setData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
    showToast(`Event "${newEvent.title}" scheduled`);
    return newEvent;
  }, [showToast]);

  const updateEvent = useCallback((eventId, updates) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => (e.id === eventId ? { ...e, ...updates } : e))
    }));
    showToast('Event updated');
  }, [showToast]);

  const deleteEvent = useCallback((eventId) => {
    setData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId)
    }));
    showToast('Event deleted', 'info');
  }, [showToast]);

  /* ----------------- Focus Studio ----------------- */
  const logFocusSession = useCallback((sessionInput) => {
    const newSession = {
      id: generateId('focus'),
      durationMinutes: Number(sessionInput.durationMinutes) || 25,
      type: sessionInput.type || 'deep_work',
      taskTitle: sessionInput.taskTitle || 'Autonomous Focus Block',
      completedAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      focusSessions: [newSession, ...prev.focusSessions]
    }));
    showToast(`Focus block completed: ${newSession.durationMinutes} min`);
    return newSession;
  }, [showToast]);

  /* ----------------- Learning & Skills ----------------- */
  const addSkill = useCallback((skillInput) => {
    const newSkill = {
      id: generateId('skill'),
      title: skillInput.title.trim(),
      category: skillInput.category || 'Technical',
      level: skillInput.level || 'Intermediate',
      totalHoursInvested: Number(skillInput.totalHoursInvested) || 0,
      targetHours: Number(skillInput.targetHours) || 50,
      description: skillInput.description?.trim() || '',
      milestones: skillInput.milestones || [],
      resources: skillInput.resources || [],
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      learning: [...prev.learning, newSkill]
    }));
    showToast(`Skill track "${newSkill.title}" opened`);
    return newSkill;
  }, [showToast]);

  const updateSkill = useCallback((skillId, updates) => {
    setData(prev => ({
      ...prev,
      learning: prev.learning.map(s => (s.id === skillId ? { ...s, ...updates } : s))
    }));
    showToast('Skill roadmap updated');
  }, [showToast]);

  const deleteSkill = useCallback((skillId) => {
    setData(prev => ({
      ...prev,
      learning: prev.learning.filter(s => s.id !== skillId)
    }));
    showToast('Skill roadmap removed', 'info');
  }, [showToast]);

  const toggleSkillMilestone = useCallback((skillId, milestoneId) => {
    setData(prev => ({
      ...prev,
      learning: prev.learning.map(s => {
        if (s.id === skillId) {
          return {
            ...s,
            milestones: s.milestones.map(m =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            )
          };
        }
        return s;
      })
    }));
  }, []);

  const logStudySession = useCallback((skillId, hours) => {
    const added = Number(hours) || 0;
    setData(prev => ({
      ...prev,
      learning: prev.learning.map(s => {
        if (s.id === skillId) {
          return {
            ...s,
            totalHoursInvested: Math.round((s.totalHoursInvested + added) * 10) / 10
          };
        }
        return s;
      })
    }));
    showToast(`Logged ${added} hrs of learning`);
  }, [showToast]);

  /* ----------------- Personal Finance ----------------- */
  const addTransaction = useCallback((txInput) => {
    const newTx = {
      id: generateId('tx'),
      title: txInput.title.trim(),
      amount: Number(txInput.amount) || 0,
      type: txInput.type === 'income' ? 'income' : 'expense',
      category: txInput.category || 'General',
      date: txInput.date || new Date().toISOString().split('T')[0],
      notes: txInput.notes?.trim() || '',
    };
    setData(prev => ({
      ...prev,
      finance: {
        ...prev.finance,
        transactions: [newTx, ...prev.finance.transactions]
      }
    }));
    showToast(`Transaction recorded: ${newTx.type === 'income' ? '+' : '-'}${newTx.amount}`);
    return newTx;
  }, [showToast]);

  const deleteTransaction = useCallback((txId) => {
    setData(prev => ({
      ...prev,
      finance: {
        ...prev.finance,
        transactions: prev.finance.transactions.filter(t => t.id !== txId)
      }
    }));
    showToast('Transaction removed', 'info');
  }, [showToast]);

  const updateBudget = useCallback((monthlyBudget) => {
    const val = Number(monthlyBudget) || 0;
    setData(prev => ({
      ...prev,
      finance: { ...prev.finance, monthlyBudget: val }
    }));
    showToast('Monthly budget updated');
  }, [showToast]);

  const addSavingsGoal = useCallback((goalInput) => {
    const newGoal = {
      id: generateId('sg'),
      name: goalInput.name.trim(),
      targetAmount: Number(goalInput.targetAmount) || 10000,
      currentAmount: Number(goalInput.currentAmount) || 0,
      deadline: goalInput.deadline || '2026-12-31'
    };
    setData(prev => ({
      ...prev,
      finance: {
        ...prev.finance,
        savingsGoals: [...(prev.finance.savingsGoals || []), newGoal]
      }
    }));
    showToast('Savings goal created');
    return newGoal;
  }, [showToast]);

  const updateSavingsGoalAmount = useCallback((goalId, amountToAdd) => {
    const amt = Number(amountToAdd) || 0;
    setData(prev => ({
      ...prev,
      finance: {
        ...prev.finance,
        savingsGoals: (prev.finance.savingsGoals || []).map(g =>
          g.id === goalId ? { ...g, currentAmount: Math.max(0, g.currentAmount + amt) } : g
        )
      }
    }));
    showToast('Savings goal updated');
  }, [showToast]);

  /* ----------------- Journal ----------------- */
  const addJournalEntry = useCallback((entryInput) => {
    const newEntry = {
      id: generateId('j'),
      title: entryInput.title.trim() || 'Daily Reflection',
      date: entryInput.date || new Date().toISOString().split('T')[0],
      mood: entryInput.mood || 'Focused',
      energy: Number(entryInput.energy) || 8,
      tags: entryInput.tags || ['reflection'],
      reflection: entryInput.reflection?.trim() || '',
      gratitude: entryInput.gratitude?.trim() || '',
      wins: entryInput.wins?.trim() || '',
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      journal: [newEntry, ...prev.journal]
    }));
    showToast('Reflection logged in Journal');
    return newEntry;
  }, [showToast]);

  const updateJournalEntry = useCallback((entryId, updates) => {
    setData(prev => ({
      ...prev,
      journal: prev.journal.map(j => (j.id === entryId ? { ...j, ...updates } : j))
    }));
    showToast('Journal entry updated');
  }, [showToast]);

  const deleteJournalEntry = useCallback((entryId) => {
    setData(prev => ({
      ...prev,
      journal: prev.journal.filter(j => j.id !== entryId)
    }));
    showToast('Journal entry deleted', 'info');
  }, [showToast]);

  /* ----------------- Data Portability & Resets ----------------- */
  const handleExportJSON = useCallback(() => {
    exportDataAsJSON(data);
    showToast('Data exported successfully');
  }, [data, showToast]);

  const handleImportJSON = useCallback((jsonData) => {
    const validation = validateImportedData(jsonData);
    if (!validation.valid) {
      showToast(validation.error, 'error');
      return false;
    }
    const cleanData = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      settings: { ...DEFAULT_SETTINGS, ...(jsonData.settings || {}) },
      tasks: Array.isArray(jsonData.tasks) ? jsonData.tasks : [],
      goals: Array.isArray(jsonData.goals) ? jsonData.goals : [],
      habits: Array.isArray(jsonData.habits) ? jsonData.habits : [],
      events: Array.isArray(jsonData.events) ? jsonData.events : [],
      focusSessions: Array.isArray(jsonData.focusSessions) ? jsonData.focusSessions : [],
      learning: Array.isArray(jsonData.learning) ? jsonData.learning : [],
      finance: {
        currency: jsonData.finance?.currency || 'NPR',
        monthlyBudget: jsonData.finance?.monthlyBudget ?? 150000,
        savingsTarget: jsonData.finance?.savingsTarget ?? 50000,
        transactions: Array.isArray(jsonData.finance?.transactions) ? jsonData.finance.transactions : [],
        savingsGoals: Array.isArray(jsonData.finance?.savingsGoals) ? jsonData.finance.savingsGoals : [],
      },
      journal: Array.isArray(jsonData.journal) ? jsonData.journal : [],
    };
    setData(cleanData);
    showToast('Data imported and verified');
    return true;
  }, [showToast]);

  const handleResetData = useCallback((cleanEmpty = false) => {
    const fresh = resetDataStore(cleanEmpty);
    setData(fresh);
    showToast(cleanEmpty ? 'All records cleared' : 'Sample demo data reloaded', 'info');
  }, [showToast]);

  /* ----------------- Derived Real Statistics ----------------- */
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Tasks stats
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = data.tasks.filter(t => t.status === 'pending');
    const todayTasks = data.tasks.filter(t => t.dueDate === todayStr);
    const todayCompleted = todayTasks.filter(t => t.status === 'completed').length;
    const overdueTasks = data.tasks.filter(t => t.status === 'pending' && t.dueDate < todayStr);
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Habits stats
    const totalHabits = data.habits.length;
    const habitsCompletedToday = data.habits.filter(h => h.history.includes(todayStr)).length;
    const habitAdherenceToday = totalHabits > 0 ? Math.round((habitsCompletedToday / totalHabits) * 100) : 0;

    // Focus stats
    const todayFocusSessions = data.focusSessions.filter(s => s.completedAt?.startsWith(todayStr));
    const todayFocusMinutes = todayFocusSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const allFocusMinutes = data.focusSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    // Finance stats
    const currentMonth = todayStr.substring(0, 7);
    const monthTransactions = data.finance.transactions.filter(t => t.date.startsWith(currentMonth));
    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const monthExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const netSavings = monthIncome - monthExpenses;
    const budgetUtilization = data.finance.monthlyBudget > 0
      ? Math.round((monthExpenses / data.finance.monthlyBudget) * 100)
      : 0;

    return {
      todayStr,
      totalTasks,
      completedTasks,
      pendingTasksCount: pendingTasks.length,
      todayTasksCount: todayTasks.length,
      todayCompletedCount: todayCompleted,
      overdueTasksCount: overdueTasks.length,
      taskCompletionRate,
      totalHabits,
      habitsCompletedToday,
      habitAdherenceToday,
      todayFocusMinutes,
      allFocusMinutes,
      monthIncome,
      monthExpenses,
      netSavings,
      budgetUtilization,
    };
  }, [data]);

  const value = useMemo(() => ({
    data,
    settings: data.settings,
    tasks: data.tasks,
    goals: data.goals,
    habits: data.habits,
    events: data.events,
    focusSessions: data.focusSessions,
    learning: data.learning,
    finance: data.finance,
    journal: data.journal,
    stats,
    toast,
    showToast,
    updateSettings,
    toggleTheme,
    setColorTheme,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    toggleMilestone,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitDate,
    addEvent,
    updateEvent,
    deleteEvent,
    logFocusSession,
    addSkill,
    updateSkill,
    deleteSkill,
    toggleSkillMilestone,
    logStudySession,
    addTransaction,
    deleteTransaction,
    updateBudget,
    addSavingsGoal,
    updateSavingsGoalAmount,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    handleExportJSON,
    handleImportJSON,
    handleResetData,
  }), [
    data,
    stats,
    toast,
    showToast,
    updateSettings,
    toggleTheme,
    setColorTheme,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    toggleMilestone,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitDate,
    addEvent,
    updateEvent,
    deleteEvent,
    logFocusSession,
    addSkill,
    updateSkill,
    deleteSkill,
    toggleSkillMilestone,
    logStudySession,
    addTransaction,
    deleteTransaction,
    updateBudget,
    addSavingsGoal,
    updateSavingsGoalAmount,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    handleExportJSON,
    handleImportJSON,
    handleResetData,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
