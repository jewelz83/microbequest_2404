# Other guest gameplay repairs — October 23, 2026

This is a development preview repair, not release certification. Tests use a synthetic signed-out browser on localhost and the PR preview; no production backend, payment, AI tutor, or analytics changes are included.

## Reproduced and repaired

- Quiz: first correct answer displayed 0% accuracy; weighted questions distorted percentages. Accuracy now counts answers, score maximum sums question weights, feedback reports actual earned points, and completed quizzes stop their timers and delayed feedback. Removed invented achievement bonus points/discovery counts.
- Microscope Lab: revisiting a previously examined specimen inflated the count. Specimens, features and learned fact sets now deduplicate; selection delay is cancelled on replacement/unmount. Score saves occur outside React state updaters. Initial achievement badges derive from completed activities.
- Explorer: repeated clicks could queue duplicate discoveries. A pending discovery is now locked and cancelled when leaving; completion is recorded once per habitat. Highlighted zones accept keyboard activation and direct selection. The soil organic-matter zone now contains its microbe.
- Germ Buster: resume restarted the mission; hit rendering called hooks inside a loop; bacteria filtering could continuously rerender; escaped enemies, wave advance and terminal states were incomplete. One pure combat transition owns movement, projectiles, damage, ammunition, energy, cooldowns, waves and mission outcomes. Pause freezes progress. Dead organisms score once. Spread shots consume ammunition and energy. The final wave offers Finish Mission. Removed fabricated results breakdown and completion credit. The fixed-coordinate board scrolls horizontally on narrow screens; native touch/device coverage remains outstanding.
- Detective: any recommendation could finish a case; a wrong identification locked the choices; solution choices reshuffled on every render. Analysis now requires evidence and identification, rejects incomplete/incorrect solution sets, permits retry, and keeps choices stable. Delayed tests/clues/completion are cancelled on unmount. A solved case returns to the case board, records each case once and deduplicates badges; persistence is outside state updater callbacks.
- Timeline: completion added event points twice and replay added them repeatedly. Rewards now use the listed event points once, replays are labelled practice, delayed callbacks cannot complete a closed minigame, and the navigator reflects actual completed events. Existing saved scores are preserved, not retroactively rewritten.

## Verification

- 51 automated tests pass, including seven combat transition tests and three weighted-quiz metric tests, plus the existing access/privacy/timing suite.
- Production compilation passes.
- Eight-question guest quiz: 105/105, 8/8, 100%; results remain stable after feedback delay.
- Lab: E. coli → Influenza → E. coli remains two specimens examined.
- Explorer: soil, water and body reach nine unique discoveries; repeated zone clicks do not inflate counts.
- Germ Buster: pause/resume retains spent ammunition and energy; a full three-wave gut mission reaches victory. Letting enemies escape reaches Mission Incomplete. Automated transitions also cover spread cost, shield, wave gating, terminal objectives and duplicate-hit scoring.
- Detective cafeteria journey: collect five clues, run two tests, retry incorrect microbe identification, reject an incorrect solution set, submit all correct solutions, and return to the case board.
- Timeline: first microscope event and second bacterial-shapes event, next-event unlock, reload persistence, accurate navigator count, and replay without additional rewards. Pre-fix local total was 50; the repaired second event adds exactly 30 to reach 80 and replay stays 80.

Repeatable browser fixtures in `tests/browser/`: `other-guest-games.html` (quiz), `exploration-combat.html` (lab/Explorer), `detective-journey.html`, and `defense-mission.html`. Run with the local development server; quiz/exploration/detective fixtures reset only localhost synthetic guest controls/timing. Timeline progress is preserved. The defense test uses randomized game waves, so it verifies a played mission rather than a seeded scenario.

Not certified: signed-in persistence and consent journeys, later/premium Detective cases and Timeline eras, all defense locations/difficulty combinations, native mobile touch, hidden-tab/native-window timing, scientific-content audit, or commercial access policy. Legacy premium messaging remains a separate product decision. Keep PR #2 draft.
