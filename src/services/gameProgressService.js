import { supabase } from '../lib/supabase';

const SAVE_KEY = 'microbequest_progress';

// ─── Local Storage Helpers ───────────────────────────────────────────────────

const defaultProgress = {
  unlockedEras: ['discovery'],
  unlockedEvents: ['leeuwenhoek-discovery'],
  completedEvents: [],
  totalPoints: 0,
  collectedCards: [],
  achievements: [],
};

export const loadLocalProgress = () => {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) return { ...defaultProgress, ...JSON.parse(saved) };
  } catch (e) {}
  return defaultProgress;
};

export const saveLocalProgress = (progress) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  } catch (e) {}
};

// ─── Supabase Helpers ─────────────────────────────────────────────────────────

/**
 * Get the current authenticated user id, or null if not logged in.
 */
const getCurrentUserId = async () => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
};

// ─── Game Progress ────────────────────────────────────────────────────────────

/**
 * Load progress from Supabase (if authenticated) or localStorage.
 * Always keeps localStorage in sync as a local cache.
 */
export const loadProgress = async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return loadLocalProgress();
  }

  try {
    const { data, error } = await supabase?.from('game_progress')?.select('*')?.eq('user_id', userId)?.maybeSingle();

    if (error) {
      console.error('Error loading progress from Supabase:', error?.message);
      return loadLocalProgress();
    }

    if (!data) {
      // No remote record yet — use local and sync it up
      const local = loadLocalProgress();
      await saveProgress(local);
      return local;
    }

    // Map snake_case DB columns → camelCase
    const progress = {
      unlockedEras: data?.unlocked_eras ?? defaultProgress?.unlockedEras,
      unlockedEvents: data?.unlocked_events ?? defaultProgress?.unlockedEvents,
      completedEvents: data?.completed_events ?? defaultProgress?.completedEvents,
      totalPoints: data?.total_points ?? 0,
      collectedCards: data?.collected_cards ?? [],
      achievements: data?.achievements ?? [],
    };

    // Keep localStorage in sync
    saveLocalProgress(progress);
    return progress;
  } catch (err) {
    console.error('Unexpected error loading progress:', err);
    return loadLocalProgress();
  }
};

/**
 * Save progress to both Supabase (if authenticated) and localStorage.
 */
export const saveProgress = async (progress) => {
  // Always save locally first
  saveLocalProgress(progress);

  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    const { error } = await supabase?.from('game_progress')?.upsert(
        {
          user_id: userId,
          unlocked_eras: progress?.unlockedEras,
          unlocked_events: progress?.unlockedEvents,
          completed_events: progress?.completedEvents,
          total_points: progress?.totalPoints,
          collected_cards: progress?.collectedCards,
          achievements: progress?.achievements,
          updated_at: new Date()?.toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Error saving progress to Supabase:', error?.message);
    }
  } catch (err) {
    console.error('Unexpected error saving progress:', err);
  }
};

/**
 * Reset all progress (both Supabase and localStorage).
 */
export const resetProgress = async () => {
  saveLocalProgress(defaultProgress);

  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    const { error } = await supabase?.from('game_progress')?.upsert(
        {
          user_id: userId,
          unlocked_eras: defaultProgress?.unlockedEras,
          unlocked_events: defaultProgress?.unlockedEvents,
          completed_events: defaultProgress?.completedEvents,
          total_points: defaultProgress?.totalPoints,
          collected_cards: defaultProgress?.collectedCards,
          achievements: defaultProgress?.achievements,
          updated_at: new Date()?.toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Error resetting progress in Supabase:', error?.message);
    }
  } catch (err) {
    console.error('Unexpected error resetting progress:', err);
  }
};

// ─── Game Scores ──────────────────────────────────────────────────────────────

/**
 * Save a game score session to Supabase.
 * @param {Object} scoreData - { gameMode, score, correctAnswers, totalQuestions, timeElapsed, difficulty, metadata }
 */
export const saveGameScore = async (scoreData) => {
  const userId = await getCurrentUserId();
  if (!userId) return { error: 'Not authenticated' };

  try {
    const { data, error } = await supabase?.from('game_scores')?.insert({
        user_id: userId,
        game_mode: scoreData?.gameMode,
        score: scoreData?.score ?? 0,
        correct_answers: scoreData?.correctAnswers ?? 0,
        total_questions: scoreData?.totalQuestions ?? 0,
        time_elapsed: scoreData?.timeElapsed ?? 0,
        difficulty: scoreData?.difficulty ?? 'easy',
        metadata: scoreData?.metadata ?? {},
      })?.select()?.single();

    if (error) {
      console.error('Error saving game score:', error?.message);
      return { error };
    }
    return { data };
  } catch (err) {
    console.error('Unexpected error saving score:', err);
    return { error: err };
  }
};

/**
 * Load all scores for the current user.
 */
export const loadGameScores = async (gameMode = null) => {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  try {
    let query = supabase?.from('game_scores')?.select('*')?.eq('user_id', userId)?.order('played_at', { ascending: false });

    if (gameMode) {
      query = query?.eq('game_mode', gameMode);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading game scores:', error?.message);
      return [];
    }

    // Map snake_case → camelCase
    return (data ?? [])?.map((row) => ({
      id: row?.id,
      gameMode: row?.game_mode,
      score: row?.score,
      correctAnswers: row?.correct_answers,
      totalQuestions: row?.total_questions,
      timeElapsed: row?.time_elapsed,
      difficulty: row?.difficulty,
      metadata: row?.metadata,
      playedAt: row?.played_at,
    }));
  } catch (err) {
    console.error('Unexpected error loading scores:', err);
    return [];
  }
};

/**
 * Get best score for a specific game mode.
 */
export const getBestScore = async (gameMode) => {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  try {
    const { data, error } = await supabase?.from('game_scores')?.select('score')?.eq('user_id', userId)?.eq('game_mode', gameMode)?.order('score', { ascending: false })?.limit(1)?.maybeSingle();

    if (error) {
      console.error('Error getting best score:', error?.message);
      return null;
    }

    return data?.score ?? null;
  } catch (err) {
    console.error('Unexpected error getting best score:', err);
    return null;
  }
};

// ─── Achievements ─────────────────────────────────────────────────────────────

/**
 * Unlock an achievement for the current user.
 * @param {string} achievementId - Unique achievement identifier
 * @param {string} achievementName - Human-readable name
 */
export const unlockAchievement = async (achievementId, achievementName) => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    const { error } = await supabase?.from('user_achievements')?.insert({
        user_id: userId,
        achievement_id: achievementId,
        achievement_name: achievementName,
      })?.select();

    if (error && error?.code !== '23505') {
      // 23505 = unique_violation (already unlocked), ignore it
      console.error('Error unlocking achievement:', error?.message);
    }
  } catch (err) {
    console.error('Unexpected error unlocking achievement:', err);
  }
};

/**
 * Load all achievements for the current user.
 */
export const loadUserAchievements = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  try {
    const { data, error } = await supabase?.from('user_achievements')?.select('*')?.eq('user_id', userId)?.order('unlocked_at', { ascending: false });

    if (error) {
      console.error('Error loading achievements:', error?.message);
      return [];
    }

    return (data ?? [])?.map((row) => ({
      id: row?.id,
      achievementId: row?.achievement_id,
      achievementName: row?.achievement_name,
      unlockedAt: row?.unlocked_at,
    }));
  } catch (err) {
    console.error('Unexpected error loading achievements:', err);
    return [];
  }
};

/**
 * Sync localStorage progress to Supabase when user logs in.
 * Merges local data with remote, preferring the higher values.
 */
export const syncProgressOnLogin = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const local = loadLocalProgress();

  try {
    const { data: remote } = await supabase?.from('game_progress')?.select('*')?.eq('user_id', userId)?.maybeSingle();

    if (!remote) {
      // No remote record — push local data
      await saveProgress(local);
      return;
    }

    // Merge: combine arrays and take max points
    const merged = {
      unlockedEras: Array.from(new Set([
        ...(local.unlockedEras ?? []),
        ...(remote.unlocked_eras ?? []),
      ])),
      unlockedEvents: Array.from(new Set([
        ...(local.unlockedEvents ?? []),
        ...(remote.unlocked_events ?? []),
      ])),
      completedEvents: Array.from(new Set([
        ...(local.completedEvents ?? []),
        ...(remote.completed_events ?? []),
      ])),
      totalPoints: Math.max(local?.totalPoints ?? 0, remote?.total_points ?? 0),
      collectedCards: Array.from(new Set([
        ...(local.collectedCards ?? []),
        ...(remote.collected_cards ?? []),
      ])),
      achievements: Array.from(new Set([
        ...(local.achievements ?? []),
        ...(remote.achievements ?? []),
      ])),
    };

    await saveProgress(merged);
  } catch (err) {
    console.error('Error syncing progress on login:', err);
  }
};
