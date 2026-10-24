export function quizMetrics({ totalQuestions = 0, answeredQuestions = 0, correctAnswers = 0, score = 0, maxScore = 0 } = {}) {
  const percent = (n, d) => d > 0 ? Math.max(0, Math.min(100, Math.round(n / d * 100))) : 0;
  return { progress: percent(answeredQuestions, totalQuestions), accuracy: percent(correctAnswers, answeredQuestions), scorePercentage: percent(score, maxScore) };
}
