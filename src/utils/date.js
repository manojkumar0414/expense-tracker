// Get today's date as YYYY-MM-DD string (in local timezone)
export function today() {
  const date = new Date();
  return dateToString(date);
}

// Convert Date object to YYYY-MM-DD string
export function dateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse YYYY-MM-DD string to Date object (local midnight)
export function stringToDate(dateString) {
  // Handle ISO format dates (extract just YYYY-MM-DD part)
  const dateOnly = dateString.split('T')[0];
  const [year, month, day] = dateOnly.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Get month key from date: YYYY-MM
export function monthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// Get month key from date string YYYY-MM-DD
export function monthKeyFromString(dateString) {
  return dateString.substring(0, 7);
}

// Add days to a date string (YYYY-MM-DD)
export function addDays(dateString, days) {
  const date = stringToDate(dateString);
  date.setDate(date.getDate() + days);
  return dateToString(date);
}

// Get first day of month
export function firstDayOfMonth(monthKey) {
  return `${monthKey}-01`;
}

// Get last day of month
export function lastDayOfMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return `${monthKey}-${String(lastDay).padStart(2, '0')}`;
}

// Get previous month key
export function previousMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() - 1);
  return monthKey(date);
}

// Get next month key
export function nextMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + 1);
  return monthKey(date);
}

// Format date string for display (e.g., "22 Oct")
export function formatDateShort(dateString) {
  const date = stringToDate(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

// Format date string for display (e.g., "Wed, 22 Oct 2026")
export function formatDateLong(dateString) {
  const date = stringToDate(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// Format month key for display (e.g., "October 2026")
export function formatMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Check if date is today
export function isToday(dateString) {
  return dateString === today();
}

// Check if date is yesterday
export function isYesterday(dateString) {
  return dateString === addDays(today(), -1);
}
