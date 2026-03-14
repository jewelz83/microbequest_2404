import { useState, useEffect } from 'react';

/**
 * Custom hook to manage learning guide visibility across screens
 * Shows guide on first visit, then every 3rd visit to reduce popup frequency
 * @param {string} screenName - Unique identifier for the current screen
 * @param {number} showEveryNthVisit - Show guide every Nth visit (default: 3)
 * @returns {object} - { shouldShowGuide, hideGuide, visitCount }
 */
const useGuideVisibility = (screenName, showEveryNthVisit = 3) => {
  const [shouldShowGuide, setShouldShowGuide] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    if (!screenName) return;

    const storageKey = `guide_visits_${screenName}`;
    
    // Get current visit count from localStorage
    const storedVisits = localStorage.getItem(storageKey);
    const currentVisits = storedVisits ? parseInt(storedVisits, 10) : 0;
    const newVisitCount = currentVisits + 1;
    
    // Update visit count
    setVisitCount(newVisitCount);
    localStorage.setItem(storageKey, newVisitCount?.toString());
    
    // Show guide on first visit or every Nth visit
    const shouldShow = newVisitCount === 1 || newVisitCount % showEveryNthVisit === 0;
    setShouldShowGuide(shouldShow);
  }, [screenName, showEveryNthVisit]);

  const hideGuide = () => {
    setShouldShowGuide(false);
  };

  const resetVisits = () => {
    if (screenName) {
      localStorage.removeItem(`guide_visits_${screenName}`);
      setVisitCount(0);
      setShouldShowGuide(true);
    }
  };

  return {
    shouldShowGuide,
    hideGuide,
    visitCount,
    resetVisits
  };
};

export default useGuideVisibility;