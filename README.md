# EverAhead — Personal Life Operating System

> **Your life. Your goals. Your next level.**

EverAhead is a futuristic, premium-quality personal life operating system engineered for high-agency individuals. It unites daily task execution, multi-horizon goal planning, habit consistency matrices, deep focus blocks, deliberate skill mastery, multi-currency personal finance, and private introspective journaling into a unified, distraction-free command center.

---

## ⚡ Core Capabilities

1. **Dashboard Command Center**
   - Local-time-based contextual greeting and daily executive overview.
   - Priority task queues, active goal progress bars, and habit completion velocity.
   - Real-time weekly output rhythm chart powered by Recharts.
   - Quick capture modal accessible globally via `+ Quick Log`.

2. **My Day Cockpit**
   - High-leverage morning prioritization and time-blocked calendar schedule.
   - 1-click habit check-offs and quick evening debrief logger.
   - Instant focus timer launcher.

3. **Task Management**
   - Full CRUD: Create, edit, complete, categorize, and delete tasks with confirmation dialogs.
   - Multi-parameter filtering by status (All, Pending, Completed, Overdue), priority, category, and date.
   - Real-time search and sorting by due date, priority, title, or creation date.

4. **Horizon Goals & Milestones**
   - Multi-category objectives (Career, Learning, Financial, Health, Personal).
   - Milestone breakdowns with checkable items that automatically recalculate completion progress.
   - Separate active vs completed objective archives.

5. **Habit Tracking & Calendar Streaks**
   - Contiguous calendar day streak calculation engine (`calculateStreak`).
   - 7-day visual adherence matrix with daily toggles.
   - Protection against false positive completions or date duplicate entries.

6. **Calendar & Daily Timeline**
   - Full monthly grid and agenda time-blocking.
   - Integrated task due dates, deadlines, and personal events.
   - Instant date navigation (Prev, Next, Today).

7. **Focus Studio & Deep Work Chamber**
   - Configurable Pomodoro sprint timer (25m, 45m, 60m) with restorative break intervals.
   - Resilient countdown tracking using absolute timestamp deltas (safe from inactive tab throttling).
   - Integrated Web Audio API pink noise synthesizer for zero-dependency ambient focus sound.
   - Historical session logging and task linking.

8. **Learning & Skill Acquisition**
   - Structured curriculum roadmaps with project milestones.
   - Study session hour logger tracking hours invested vs target milestones.
   - Reference links and study notes.

9. **Personal Finance**
   - Income and expense tracking with categorical breakdown.
   - Monthly budget containment meter with alert thresholds.
   - Dedicated savings reserves targets with deposit loggers.
   - Native support for **Nepalese Rupee (NPR - रु)** as well as USD ($), EUR (€), and GBP (£).

10. **Private Journal & Introspective Inquiry**
    - Daily reflection prompts calibrated to foster mental clarity.
    - Mood calibration (Focused, Radiant, Calm, Exhausted, Anxious) and energy levels (1-10).
    - Gratitude loggers and key win archives.
    - 1-click plain text backup exporter.

11. **Empirical Insights & Reporting**
    - 100% computed from real stored user records (no fake vanity metrics).
    - Task completion ratio, habit adherence rate, 7-day focus time area chart, and financial discipline ratios.

12. **Settings & Data Sovereignty**
    - Dark-first futuristic theme and crisp daylight theme toggle.
    - Currency and focus preference configuration.
    - Full JSON data export and schema-validated JSON import.
    - Demo data reloader and clean reset options.

---

## 🛠 Technology Stack

- **Framework**: React 19 with Vite 8
- **Navigation**: React Router 7 (`react-router-dom`)
- **Visuals & Icons**: Lucide React
- **Data Visualization**: Recharts
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **Sound**: Web Audio API (real-time pink noise buffer generator & synth audio chimes)
- **Persistence**: Centralized local-first data layer with schema versioning (`localStorage`)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+ LTS
- npm 9+

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run automated logic tests
npm test

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🧪 Automated Testing

EverAhead includes an automated test runner for core calculations, date algorithms, and schema validation:

```bash
npm test
```

Tests verify:
- Currency formatting across locales (NPR with रु, USD, EUR).
- Contiguous calendar streak calculations handling today, yesterday, and day gaps.
- Duration formatting mathematics.
- Data import schema validation and safety checks.

---

## 🌐 Vercel Deployment

EverAhead is structured as a static Single Page Application (SPA) with Vite.

### Build Production Bundle
```bash
npm run build
```
Output directory: `dist/`.

### Deployment Settings on Vercel:
- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x or 20.x

---

## 🔒 Privacy & Security

EverAhead operates under a strict **Local-First Architecture**:
- All tasks, habits, reflections, and financial transactions are stored locally in the browser's persistent storage.
- No third-party analytical cookies or tracking pixels are embedded.
- Data can be exported as a JSON archive at any time.
