export function canPlayMode(controls, mode) {
  return Array.isArray(controls?.allowedGameModes) && controls.allowedGameModes.includes(mode);
}

const levels = ['easy', 'medium', 'hard'];
export const difficultyCeiling = value => levels.includes(value) ? value : 'easy';
export const allowedDifficulties = ceiling => levels.slice(0, levels.indexOf(difficultyCeiling(ceiling)) + 1);
export const permitsDifficulty = (level, ceiling) => allowedDifficulties(ceiling).includes(level);

const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
function clockMinutes(value) {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}
export function scheduleAllowsPlay(controls, now = new Date()) {
  if (controls?.screenTimeEnabled === false) return true;
  if (controls?.screenTimeEnabled !== true || !Number.isFinite(now.getTime())) return false;
  const start = clockMinutes(controls.allowedStartTime);
  const end = clockMinutes(controls.allowedEndTime);
  if (start === null || end === null || start === end || !Array.isArray(controls.allowedDays)) return false;
  const minute = now.getHours() * 60 + now.getMinutes();
  let day = now.getDay();
  if (start < end) {
    if (minute < start || minute >= end) return false;
  } else {
    if (minute >= end && minute < start) return false;
    if (minute < end) day = (day + 6) % 7;
  }
  return controls.allowedDays.includes(weekdays[day]);
}
