export function canPlayMode(controls, mode) {
  return Array.isArray(controls?.allowedGameModes) && controls.allowedGameModes.includes(mode);
}
