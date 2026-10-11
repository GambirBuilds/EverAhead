/**
 * EverAhead - Formatting and Calculation Utilities
 * Enforces tabular-nums alignment, actual calendar streaks, and robust currency formatting
 */

/**
 * Format currency with user-selected currency (Default: NPR)
 */
export function formatCurrency(amount, currency = 'NPR') {
  const numericAmount = Number(amount) || 0;
  
  switch (currency) {
    case 'NPR':
      // Nepalese Rupee standard formatting with रु
      return `रु ${numericAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'USD':
      return `$${numericAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    case 'EUR':
      return `€${numericAmount.toLocaleString('de-DE', { maximumFractionDigits: 2 })}`;
    case 'GBP':
      return `£${numericAmount.toLocaleString('en-GB', { maximumFractionDigits: 2 })}`;
    default:
      return `${currency} ${numericAmount.toLocaleString()}`;
  }
}

/**
 * Calculate streak for a habit using actual calendar dates.
 * Considers today and yesterday to maintain current streak.
 */
export function calculateStreak(historyDates = []) {
  if (!Array.isArray(historyDates) || historyDates.length === 0) return 0;

  // Deduplicate and sort descending (newest first)
  const uniqueDates = Array.from(new Set(historyDates)).sort().reverse();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const mostRecent = uniqueDates[0];
  // If the habit was not done today AND not done yesterday, the current streak is 0
  if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(mostRecent);
  checkDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDates.length; i++) {
    const dateStr = uniqueDates[i];
    const expectedStr = checkDate.toISOString().split('T')[0];

    if (dateStr === expectedStr) {
      streak++;
      // Move to preceding day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Format minutes into readable hour/min format
 */
export function formatDuration(minutes) {
  const mins = Number(minutes) || 0;
  if (mins < 60) {
    return `${mins}m`;
  }
  const hours = Math.floor(mins / 60);
  const remainder = mins % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}

/**
 * Format ISO date string to human-readable date
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: options.year ? 'numeric' : undefined,
      ...options
    });
  } catch {
    return dateString;
  }
}

/**
 * Get friendly relative day label (Today, Tomorrow, Yesterday, or formatted date)
 */
export function getRelativeDayLabel(dateString) {
  if (!dateString) return '';
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  
  return formatDate(dateString);
}

/**
 * Get greeting based on current local time
 */
export function getTimeBasedGreeting(userName = 'Traveler') {
  const hour = new Date().getHours();
  let timeOfDay = 'Good evening';
  let subtext = 'Prepare for restorative rest and tomorrow’s objectives.';

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'Good morning';
    subtext = 'System initialized. Let us conquer your morning priorities.';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'Good afternoon';
    subtext = 'Peak energy window. Maintain sustained momentum.';
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = 'Good evening';
    subtext = 'Review daily progress and reflect on what moved the needle.';
  } else {
    timeOfDay = 'Late night session';
    subtext = 'Quiet hours. Wind down or focus in calm solitude.';
  }

  return { greeting: `${timeOfDay}, ${userName}`, subtext };
}

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}
