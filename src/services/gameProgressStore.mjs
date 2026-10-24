export function createGameProgressService(client, getStorage) {
  let owner;
  let epoch = 0;
  const fresh = () => ({ unlockedEras: ['discovery'], unlockedEvents: ['leeuwenhoek-discovery'], completedEvents: [], totalPoints: 0, collectedCards: [], achievements: [] });
  const key = id => `microbequest_progress:v2:${id ? `user:${id}` : 'guest'}`;
  const current = identity => identity && identity.epoch === epoch && (owner === undefined || owner === identity.id);
  const skipped = () => ({ skipped: true, reason: 'Progress saving is unavailable or not permitted.' });
  function setProgressIdentity(id) { if (owner !== id) { owner = id; epoch += 1; } }
  async function identify() {
    const ticket = epoch;
    try {
      const { data, error } = await client.auth.getSession();
      if (error || ticket !== epoch) return null;
      const identity = { id: data?.session?.user?.id ?? null, epoch: ticket };
      return current(identity) ? identity : null;
    } catch { return null; }
  }
  function readLocal(id) {
    try {
      const saved = JSON.parse(getStorage().getItem(key(id)) ?? 'null');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? { ...fresh(), ...saved } : fresh();
    } catch { return fresh(); }
  }
  function writeLocal(id, progress) {
    try { getStorage().setItem(key(id), JSON.stringify(progress)); return true; } catch { return false; }
  }
  function clearLocal(id) { try { getStorage().removeItem(key(id)); } catch { /* Storage can be disabled. */ } }
  async function canTrack(identity) {
    if (!identity?.id || !current(identity)) return false;
    try {
      const { data, error } = await client.from('parental_controls')
        .select('progress_tracking_consent,consent_granted_at,consent_withdrawn_at')
        .eq('user_id', identity.id).maybeSingle();
      const granted = Date.parse(data?.consent_granted_at);
      const withdrawn = data?.consent_withdrawn_at == null ? null : Date.parse(data.consent_withdrawn_at);
      const allowed = !error && current(identity) && data?.progress_tracking_consent === true
        && Number.isFinite(granted) && (withdrawn === null || (Number.isFinite(withdrawn) && withdrawn < granted));
      if (!allowed && current(identity)) clearLocal(identity.id);
      return allowed;
    } catch {
      if (current(identity)) clearLocal(identity.id);
      return false;
    }
  }
  const fromRow = row => ({ unlockedEras: row.unlocked_eras ?? fresh().unlockedEras,
    unlockedEvents: row.unlocked_events ?? fresh().unlockedEvents, completedEvents: row.completed_events ?? [],
    totalPoints: row.total_points ?? 0, collectedCards: row.collected_cards ?? [], achievements: row.achievements ?? [] });
  async function loadProgress() {
    const identity = await identify();
    if (!identity) return fresh();
    if (!identity.id) return readLocal(null);
    if (!(await canTrack(identity))) return fresh();
    try {
      const { data, error } = await client.from('game_progress').select('*').eq('user_id', identity.id).maybeSingle();
      if (!current(identity)) return fresh();
      if (error) return readLocal(identity.id);
      // Remote absence is authoritative; never import guest, legacy or deleted history.
      const progress = data ? fromRow(data) : fresh();
      writeLocal(identity.id, progress);
      return progress;
    } catch { return current(identity) ? readLocal(identity.id) : fresh(); }
  }
  async function saveProgress(progress) {
    const identity = await identify();
    if (!identity) return skipped();
    if (!identity.id) return writeLocal(null, progress)
      ? { local: true } : { error: new Error('Device storage is unavailable.'), local: false };
    if (!(await canTrack(identity)) || !current(identity)) return skipped();
    const cached = writeLocal(identity.id, progress);
    try {
      const { error } = await client.from('game_progress').upsert({ user_id: identity.id,
        unlocked_eras: progress.unlockedEras, unlocked_events: progress.unlockedEvents,
        completed_events: progress.completedEvents, total_points: progress.totalPoints,
        collected_cards: progress.collectedCards, achievements: progress.achievements,
        updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      return { error, local: cached, cloud: !error };
    } catch (error) { return { error, local: cached, cloud: false }; }
  }
  async function resetProgress() { return saveProgress(fresh()); }
  async function saveGameScore(scoreData) {
    const identity = await identify();
    if (!(await canTrack(identity)) || !current(identity)) return skipped();
    try {
      return await client.from('game_scores').insert({ user_id: identity.id,
        game_mode: scoreData.gameMode, score: scoreData.score ?? 0,
        correct_answers: scoreData.correctAnswers ?? 0, total_questions: scoreData.totalQuestions ?? 0,
        time_elapsed: scoreData.timeElapsed ?? 0, difficulty: scoreData.difficulty ?? 'easy',
        metadata: scoreData.metadata ?? {} }).select().single();
    } catch (error) { return { error }; }
  }
  async function loadGameScores(gameMode = null) {
    const identity = await identify();
    if (!identity?.id) return [];
    try {
      let query = client.from('game_scores').select('*').eq('user_id', identity.id).order('played_at', { ascending: false });
      if (gameMode) query = query.eq('game_mode', gameMode);
      const { data, error } = await query;
      if (error || !current(identity)) return [];
      return (data ?? []).map(row => ({ id: row.id, gameMode: row.game_mode, score: row.score,
        correctAnswers: row.correct_answers, totalQuestions: row.total_questions, timeElapsed: row.time_elapsed,
        difficulty: row.difficulty, metadata: row.metadata, playedAt: row.played_at }));
    } catch { return []; }
  }
  async function getBestScore(gameMode) {
    const scores = await loadGameScores(gameMode);
    return scores.length ? Math.max(...scores.map(score => score.score ?? 0)) : null;
  }
  async function unlockAchievement(achievementId, achievementName) {
    const identity = await identify();
    if (!(await canTrack(identity)) || !current(identity)) return skipped();
    try {
      const { error } = await client.from('user_achievements').insert({ user_id: identity.id,
        achievement_id: achievementId, achievement_name: achievementName }).select();
      return { error: error?.code === '23505' ? null : error };
    } catch (error) { return { error }; }
  }
  async function loadUserAchievements() {
    const identity = await identify();
    if (!identity?.id) return [];
    try {
      const { data, error } = await client.from('user_achievements').select('*').eq('user_id', identity.id).order('unlocked_at', { ascending: false });
      if (error || !current(identity)) return [];
      return (data ?? []).map(row => ({ id: row.id, achievementId: row.achievement_id,
        achievementName: row.achievement_name, unlockedAt: row.unlocked_at }));
    } catch { return []; }
  }
  // Refresh the account's history on login; never upload browser/guest data implicitly.
  async function syncProgressOnLogin() { return loadProgress(); }
  return { setProgressIdentity, loadProgress, saveProgress, resetProgress, saveGameScore,
    loadGameScores, getBestScore, unlockAchievement, loadUserAchievements, syncProgressOnLogin };
}
