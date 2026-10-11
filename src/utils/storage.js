/**
 * EverAhead - Centralized Storage & Data Access Layer
 * Local-First, Schema-Versioned, Safe Validation
 */

export const STORAGE_KEY = 'EVEREAHEAD_OS_DATA_V1';

export const DEFAULT_SETTINGS = {
  userName: 'Alex Mercer',
  userTitle: 'Systems Architect & Explorer',
  theme: 'dark', // 'dark' | 'light'
  colorTheme: 'aurora', // 'aurora' | 'nebula' | 'ocean' | 'amber' | 'light'
  currency: 'NPR', // 'NPR' | 'USD' | 'EUR' | 'GBP'
  currencySymbol: 'रु',
  defaultFocusDuration: 25, // minutes
  defaultBreakDuration: 5,
  soundEnabled: true,
  desktopNotifications: false,
};

export const INITIAL_DEMO_DATA = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  settings: DEFAULT_SETTINGS,
  tasks: [
    {
      id: 'task-1',
      title: 'Architect Next-Gen System Workflow',
      description: 'Finalize core modules, dependencies, and state orchestration for Q4 sprint.',
      priority: 'high',
      status: 'pending', // 'pending' | 'completed'
      category: 'work',
      dueDate: new Date().toISOString().split('T')[0],
      goalId: 'goal-1',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'task-2',
      title: 'Complete 45-min Deep Focus Session',
      description: 'Execute deep work block on quantum algorithms and spatial compute notes.',
      priority: 'high',
      status: 'completed',
      category: 'learning',
      dueDate: new Date().toISOString().split('T')[0],
      goalId: 'goal-2',
      completedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'task-3',
      title: 'Review Monthly Cashflow & Savings Allocation',
      description: 'Audit monthly recurring subscriptions and allocate emergency buffer.',
      priority: 'medium',
      status: 'pending',
      category: 'finance',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      goalId: 'goal-3',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-4',
      title: 'Aerobic Cardio & Mobility Session',
      description: '5km cadence interval run followed by hamstring and hip mobility.',
      priority: 'medium',
      status: 'pending',
      category: 'health',
      dueDate: new Date().toISOString().split('T')[0],
      goalId: 'goal-4',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-5',
      title: 'Reflect on Weekly Milestones in Journal',
      description: 'Document key wins, friction points, and energy levels.',
      priority: 'low',
      status: 'completed',
      category: 'personal',
      dueDate: new Date().toISOString().split('T')[0],
      goalId: null,
      completedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    }
  ],
  goals: [
    {
      id: 'goal-1',
      title: 'Deliver EverAhead Personal Life OS Architecture',
      category: 'career',
      description: 'Design and deploy a premier personal operating system with zero friction.',
      targetDate: '2026-12-31',
      progress: 68,
      milestones: [
        { id: 'm-1-1', title: 'Draft system specification & design philosophy', completed: true },
        { id: 'm-1-2', title: 'Implement reactive local-first data access layer', completed: true },
        { id: 'm-1-3', title: 'Integrate financial tracker and focus studio engine', completed: true },
        { id: 'm-1-4', title: 'Execute full testing suite & responsive verification', completed: false }
      ],
      createdAt: '2026-09-01T00:00:00.000Z',
    },
    {
      id: 'goal-2',
      title: 'Master Machine Learning & Spatial Computing',
      category: 'learning',
      description: 'Complete 100 deep learning study hours and build 3 end-to-end models.',
      targetDate: '2026-11-30',
      progress: 55,
      milestones: [
        { id: 'm-2-1', title: 'Study neural networks and transformer architecture', completed: true },
        { id: 'm-2-2', title: 'Build spatial simulation node project', completed: true },
        { id: 'm-2-3', title: 'Publish open research benchmark', completed: false }
      ],
      createdAt: '2026-08-15T00:00:00.000Z',
    },
    {
      id: 'goal-3',
      title: 'Grow Personal Emergency & Investment Reserve',
      category: 'financial',
      description: 'Consistently save 35% of monthly income towards long-term resilience.',
      targetDate: '2026-12-31',
      progress: 80,
      milestones: [
        { id: 'm-3-1', title: 'Establish 3-month living expense reserve', completed: true },
        { id: 'm-3-2', title: 'Automate weekly index fund contributions', completed: true },
        { id: 'm-3-3', title: 'Reach primary liquidity milestone', completed: false }
      ],
      createdAt: '2026-07-01T00:00:00.000Z',
    },
    {
      id: 'goal-4',
      title: 'Peak Physical Conditioning & Zone 2 Fitness',
      category: 'health',
      description: 'Achieve sub-24min 5K pace and maintain resting heart rate below 56 bpm.',
      targetDate: '2026-10-31',
      progress: 75,
      milestones: [
        { id: 'm-4-1', title: 'Log 20 weekly aerobic kilometers', completed: true },
        { id: 'm-4-2', title: 'Maintain 7.5 hours nightly sleep avg for 30 days', completed: true },
        { id: 'm-4-3', title: 'Achieve target 5K benchmark split', completed: false }
      ],
      createdAt: '2026-08-01T00:00:00.000Z',
    }
  ],
  habits: [
    {
      id: 'habit-1',
      name: 'Morning Hydration & Sunlight',
      category: 'health',
      frequency: 'daily',
      icon: 'Sun',
      history: [
        new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
      ]
    },
    {
      id: 'habit-2',
      name: 'Deep Work Block (60+ mins)',
      category: 'productivity',
      frequency: 'daily',
      icon: 'Zap',
      history: [
        new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
      ]
    },
    {
      id: 'habit-3',
      name: 'Evening Reading (20 pages)',
      category: 'learning',
      frequency: 'daily',
      icon: 'BookOpen',
      history: [
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
      ]
    },
    {
      id: 'habit-4',
      name: 'Cold Shower / Cold Recovery',
      category: 'health',
      frequency: 'weekdays',
      icon: 'Activity',
      history: [
        new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
      ]
    },
    {
      id: 'habit-5',
      name: 'Daily Gratitude & Journaling',
      category: 'mindset',
      frequency: 'daily',
      icon: 'PenTool',
      history: [
        new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
      ]
    }
  ],
  events: [
    {
      id: 'evt-1',
      title: 'Architecture Review & Sync',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      category: 'work',
      description: 'Discuss data integrity, state serialization, and performance benchmarks.'
    },
    {
      id: 'evt-2',
      title: 'Zone 2 Run & Recovery',
      date: new Date().toISOString().split('T')[0],
      startTime: '16:30',
      endTime: '17:30',
      category: 'health',
      description: 'Aerobic training in the park.'
    },
    {
      id: 'evt-3',
      title: 'Monthly Financial Audit',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      category: 'finance',
      description: 'Reconcile invoices and review investment progress.'
    }
  ],
  focusSessions: [
    {
      id: 'focus-1',
      durationMinutes: 45,
      type: 'deep_work',
      taskTitle: 'Architect Next-Gen System Workflow',
      completedAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'focus-2',
      durationMinutes: 30,
      type: 'deep_work',
      taskTitle: 'Neural network transformers review',
      completedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'focus-3',
      durationMinutes: 50,
      type: 'deep_work',
      taskTitle: 'Database index query tuning',
      completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ],
  learning: [
    {
      id: 'skill-1',
      title: 'Neural Networks & Deep Learning',
      category: 'Technical',
      level: 'Advanced',
      totalHoursInvested: 64,
      targetHours: 100,
      description: 'Core transformer math, attention mechanisms, and custom PyTorch architectures.',
      milestones: [
        { id: 'lm-1', title: 'Calculus of Backpropagation', completed: true },
        { id: 'lm-2', title: 'Self-Attention & Multi-Head Transformers', completed: true },
        { id: 'lm-3', title: 'Quantization & Inference Optimization', completed: false },
      ],
      resources: [
        { title: 'Attention Is All You Need Paper', url: 'https://arxiv.org/abs/1706.03762' },
        { title: 'Neural Networks from Scratch Lab', url: 'https://github.com' }
      ]
    },
    {
      id: 'skill-2',
      title: 'Spatial UI & High-Performance Graphics',
      category: 'Design & Code',
      level: 'Intermediate',
      totalHoursInvested: 38,
      targetHours: 60,
      description: 'WebGL, GLSL shaders, 60fps compositor pipelines, and tactile micro-interactions.',
      milestones: [
        { id: 'lm-4', title: 'Vector & Matrix Transformations', completed: true },
        { id: 'lm-5', title: 'Lighting & Raymarching Basics', completed: false },
      ],
      resources: [
        { title: 'The Book of Shaders', url: 'https://thebookofshaders.com' }
      ]
    }
  ],
  finance: {
    currency: 'NPR',
    monthlyBudget: 150000,
    savingsTarget: 50000,
    transactions: [
      {
        id: 'tx-1',
        title: 'Senior Systems Engineering Retainer',
        amount: 220000,
        type: 'income',
        category: 'Salary',
        date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        notes: 'Monthly enterprise retainer'
      },
      {
        id: 'tx-2',
        title: 'Modern Workspace Studio Rent',
        amount: 45000,
        type: 'expense',
        category: 'Housing',
        date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
        notes: 'Quiet high-speed office studio'
      },
      {
        id: 'tx-3',
        title: 'Cloud Infrastructure & High-Speed Fiber',
        amount: 14500,
        type: 'expense',
        category: 'Utilities',
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        notes: 'Dedicated gigabit fiber and server nodes'
      },
      {
        id: 'tx-4',
        title: 'Nutritious Organic Groceries',
        amount: 18200,
        type: 'expense',
        category: 'Food',
        date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
        notes: 'Whole foods, berries, high protein'
      },
      {
        id: 'tx-5',
        title: 'Technical Literature & Research Subscriptions',
        amount: 6500,
        type: 'expense',
        category: 'Education',
        date: new Date().toISOString().split('T')[0],
        notes: 'ACM Digital Library & papers'
      }
    ],
    savingsGoals: [
      {
        id: 'sg-1',
        name: 'Hardware Lab Upgrades (M-Series Ultra)',
        targetAmount: 400000,
        currentAmount: 260000,
        deadline: '2026-12-01'
      },
      {
        id: 'sg-2',
        name: 'High-Altitude Trekking Expedition',
        targetAmount: 120000,
        currentAmount: 95000,
        deadline: '2026-11-15'
      }
    ]
  },
  journal: [
    {
      id: 'j-1',
      title: 'Clarity in Systems Architecture',
      date: new Date().toISOString().split('T')[0],
      mood: 'Focused',
      energy: 9,
      tags: ['clarity', 'architecture', 'focus'],
      reflection: 'Progress feels effortless when the governing principles are cleanly defined. By stripping away extraneous noise, every hour spent yields tangible value.',
      gratitude: 'Grateful for deep uninterrupted concentration, crisp morning mountain air, and reliable tools.',
      wins: 'Architected the core state graph and established clean modular separation.'
    },
    {
      id: 'j-2',
      title: 'Zone 2 Pacing and Mental Longevity',
      date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      mood: 'Radiant',
      energy: 8,
      tags: ['health', 'endurance', 'habit'],
      reflection: 'Consistency outperforms occasional heroic intensity every single time. 45 minutes of aerobic base building created immense cognitive clarity for the afternoon work.',
      gratitude: 'Good health, sustained cardiovascular stamina, and wholesome food.',
      wins: 'Logged 6.5km without spiking heart rate beyond zone 2.'
    }
  ]
};

/**
 * Load data from localStorage with graceful fallback and validation
 */
export function loadStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time initialization
      saveStoredData(INITIAL_DEMO_DATA);
      return INITIAL_DEMO_DATA;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return INITIAL_DEMO_DATA;
    }
    // Simple schema migration / validation if fields are missing
    return {
      version: parsed.version || 1,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : INITIAL_DEMO_DATA.tasks,
      goals: Array.isArray(parsed.goals) ? parsed.goals : INITIAL_DEMO_DATA.goals,
      habits: Array.isArray(parsed.habits) ? parsed.habits : INITIAL_DEMO_DATA.habits,
      events: Array.isArray(parsed.events) ? parsed.events : INITIAL_DEMO_DATA.events,
      focusSessions: Array.isArray(parsed.focusSessions) ? parsed.focusSessions : INITIAL_DEMO_DATA.focusSessions,
      learning: Array.isArray(parsed.learning) ? parsed.learning : INITIAL_DEMO_DATA.learning,
      finance: {
        currency: parsed.finance?.currency || 'NPR',
        monthlyBudget: parsed.finance?.monthlyBudget ?? 150000,
        savingsTarget: parsed.finance?.savingsTarget ?? 50000,
        transactions: Array.isArray(parsed.finance?.transactions) ? parsed.finance.transactions : INITIAL_DEMO_DATA.finance.transactions,
        savingsGoals: Array.isArray(parsed.finance?.savingsGoals) ? parsed.finance.savingsGoals : INITIAL_DEMO_DATA.finance.savingsGoals,
      },
      journal: Array.isArray(parsed.journal) ? parsed.journal : INITIAL_DEMO_DATA.journal,
    };
  } catch (err) {
    console.error('Failed to load stored EverAhead data:', err);
    return INITIAL_DEMO_DATA;
  }
}

/**
 * Save data to localStorage
 */
export function saveStoredData(data) {
  try {
    const payload = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('Failed to save EverAhead data to localStorage:', err);
    return false;
  }
}

/**
 * Validate imported JSON schema
 */
export function validateImportedData(jsonData) {
  if (!jsonData || typeof jsonData !== 'object') {
    return { valid: false, error: 'File is not a valid JSON object.' };
  }
  if (!Array.isArray(jsonData.tasks) && !Array.isArray(jsonData.goals)) {
    return { valid: false, error: 'JSON payload is missing essential EverAhead modules (tasks/goals).' };
  }
  return { valid: true };
}

/**
 * Export data as downloadable JSON file
 */
export function exportDataAsJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `everahead-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reset data to pristine initial demo state or completely clean
 */
export function resetDataStore(cleanEmpty = false) {
  const emptyState = {
    version: 1,
    lastUpdated: new Date().toISOString(),
    settings: DEFAULT_SETTINGS,
    tasks: [],
    goals: [],
    habits: [],
    events: [],
    focusSessions: [],
    learning: [],
    finance: {
      currency: 'NPR',
      monthlyBudget: 0,
      savingsTarget: 0,
      transactions: [],
      savingsGoals: []
    },
    journal: []
  };
  const target = cleanEmpty ? emptyState : INITIAL_DEMO_DATA;
  saveStoredData(target);
  return target;
}
