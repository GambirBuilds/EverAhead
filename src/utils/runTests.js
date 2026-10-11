/**
 * EverAhead OS - Core Business Logic & Calculations Unit Test Suite
 */

import {
  formatCurrency,
  calculateStreak,
  formatDuration,
} from './formatters.js';

import {
  validateImportedData,
  INITIAL_DEMO_DATA
} from './storage.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- Running EverAhead Core Calculation Tests ---');

// Test 1: formatCurrency
console.log('\n[Suite 1: Currency Formatting]');
assert(formatCurrency(150000, 'NPR').includes('रु'), 'NPR formats with Nepalese Rupee symbol रु');
assert(formatCurrency(150000, 'USD').includes('$'), 'USD formats with dollar symbol $');
assert(formatCurrency(0, 'NPR').includes('0'), 'Zero amount formats correctly');

// Test 2: calculateStreak
console.log('\n[Suite 2: Calendar Streak Calculations]');
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0];

assert(calculateStreak([]) === 0, 'Empty history yields 0 streak');
assert(calculateStreak([today]) === 1, 'Single entry today yields 1 day streak');
assert(calculateStreak([today, yesterday, twoDaysAgo]) === 3, '3 contiguous consecutive days yields 3 day streak');
assert(calculateStreak([yesterday, twoDaysAgo]) === 2, 'Completed yesterday yields 2 day streak');
assert(calculateStreak([threeDaysAgo]) === 0, 'Completed 3 days ago with gap yields 0 current streak');

// Test 3: formatDuration
console.log('\n[Suite 3: Duration Formatting]');
assert(formatDuration(25) === '25m', '25 minutes formats to "25m"');
assert(formatDuration(60) === '1h', '60 minutes formats to "1h"');
assert(formatDuration(90) === '1h 30m', '90 minutes formats to "1h 30m"');

// Test 4: validateImportedData
console.log('\n[Suite 4: Storage Schema Validation]');
assert(validateImportedData(INITIAL_DEMO_DATA).valid === true, 'Initial demo data passes schema validation');
assert(validateImportedData(null).valid === false, 'Null payload fails validation');
assert(validateImportedData({ invalid: true }).valid === false, 'Invalid object without tasks/goals fails validation');

console.log(`\n========================================`);
console.log(`Test Execution Summary: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
