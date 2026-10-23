import { trackEvent } from '../hooks/useGoogleAnalytics';

/**
 * Game Mode Analytics
 * Tracks when a user starts a game mode session.
 */
export const trackGameModeStart = (gameMode, params = {}) => {
  trackEvent('game_mode_start', {
    game_mode: gameMode,
    difficulty: params?.difficulty || 'easy',
    ...params,
  });
};

/**
 * Tracks when a user completes a game mode session.
 */
export const trackGameModeComplete = (gameMode, params = {}) => {
  trackEvent('game_mode_complete', {
    game_mode: gameMode,
    score: params?.score ?? 0,
    difficulty: params?.difficulty || 'easy',
    time_elapsed: params?.timeElapsed ?? 0,
    ...params,
  });
};

/**
 * Tracks when a game session ends without completion (game over).
 */
export const trackGameOver = (gameMode, params = {}) => {
  trackEvent('game_over', {
    game_mode: gameMode,
    score: params?.score ?? 0,
    difficulty: params?.difficulty || 'easy',
    ...params,
  });
};

/**
 * Achievement Analytics
 * Tracks when an achievement is unlocked.
 */
export const trackAchievementUnlock = (achievementId, achievementName, params = {}) => {
  trackEvent('achievement_unlock', {
    achievement_id: achievementId,
    achievement_name: achievementName,
    rarity: params?.rarity || 'bronze',
    points: params?.points ?? 0,
    ...params,
  });
};

/**
 * Tracks when a user views their achievements.
 */
export const trackAchievementView = (achievementId, achievementName) => {
  trackEvent('achievement_view', {
    achievement_id: achievementId,
    achievement_name: achievementName,
  });
};

/**
 * Progression Milestone Analytics
 * Tracks timeline event completions.
 */
export const trackTimelineEventComplete = (eventId, era, points) => {
  trackEvent('timeline_event_complete', {
    event_id: eventId,
    era,
    points_earned: points ?? 0,
  });
};

/**
 * Tracks when a full era is completed.
 */
export const trackEraComplete = (eraId, eraName) => {
  trackEvent('era_complete', {
    era_id: eraId,
    era_name: eraName,
  });
};

/**
 * Tracks when a new era is unlocked.
 */
export const trackEraUnlock = (eraId) => {
  trackEvent('era_unlock', {
    era_id: eraId,
  });
};

/**
 * Tracks quiz answer submissions.
 */
export const trackQuizAnswer = (questionIndex, isCorrect, points) => {
  trackEvent('quiz_answer', {
    question_index: questionIndex,
    is_correct: isCorrect,
    points_earned: isCorrect ? (points ?? 0) : 0,
  });
};

/**
 * Tracks microbe discovery in World Explorer.
 */
export const trackMicrobeDiscovery = (microbeName, environment) => {
  trackEvent('microbe_discovery', {
    microbe_name: microbeName,
    environment,
  });
};

/**
 * Tracks when a user views the Progress & Achievement Hub.
 */
export const trackProgressHubView = (tab) => {
  trackEvent('progress_hub_view', {
    tab,
  });
};
