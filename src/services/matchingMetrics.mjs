// Matching stores one move per card flip; a successful pair accounts for two flips.
export function matchingMetrics({ matchedPairs = 0, totalPairs = 0, moves = 0 } = {}) {
  const count = value => Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  const total = count(totalPairs);
  const matched = Math.min(count(matchedPairs), total);
  const flips = count(moves);
  return {
    matchedPairs: matched,
    totalPairs: total,
    progressPercent: total ? Math.round(matched / total * 100) : 0,
    efficiencyPercent: flips ? Math.min(100, Math.round(matched * 2 / flips * 100)) : 0,
  };
}
