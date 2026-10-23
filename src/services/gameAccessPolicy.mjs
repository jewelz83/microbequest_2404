export function canPlayMode(controls, mode) {
  return Array.isArray(controls?.allowedGameModes) && controls.allowedGameModes.includes(mode);
}

const levels = ['easy', 'medium', 'hard'];
export const difficultyCeiling = value => levels.includes(value) ? value : 'easy';
export const allowedDifficulties = ceiling => levels.slice(0, levels.indexOf(difficultyCeiling(ceiling)) + 1);
export const permitsDifficulty = (level, ceiling) => allowedDifficulties(ceiling).includes(level);
