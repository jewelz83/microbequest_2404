import { supabase } from '../lib/supabase';
import { createGameProgressService } from './gameProgressStore.mjs';

const service = createGameProgressService(supabase, () => localStorage);
export const { setProgressIdentity, loadProgress, saveProgress, resetProgress, saveGameScore,
  loadGameScores, getBestScore, unlockAchievement, loadUserAchievements, syncProgressOnLogin } = service;
