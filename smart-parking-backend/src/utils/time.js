function nowIso() {
  return new Date().toISOString();
}

function currentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

function dateOnly(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function timeOnly(date = new Date()) {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function daysInMonth(month, year) {
  return new Date(Number(year), Number(month), 0).getDate();
}

function monthRange(month, year) {
  const mm = String(month).padStart(2, '0');
  return {
    validFrom: `${year}-${mm}-01`,
    validTo: `${year}-${mm}-${String(daysInMonth(month, year)).padStart(2, '0')}`,
  };
}

function formatDuration(startIso, endIso) {
  const diffMs = Math.max(0, new Date(endIso).getTime() - new Date(startIso).getTime());
  const totalMinutes = Math.max(1, Math.round(diffMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h${String(minutes).padStart(2, '0')}m` : `${minutes}m`;
}

module.exports = { nowIso, currentMonthYear, dateOnly, timeOnly, monthRange, formatDuration };
