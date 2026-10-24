# Later guest levels and narrow-screen checks

Checked October 24, 2026 using the local development preview and a synthetic guest. No account login, premium bypass, payment, AI tutor, production backend or analytics activation.

## Repairs

- Germ Buster previously kept an 800px field inside a horizontal scroller. On a phone, enemies and the defender could be outside the visible area. The whole field now scales to its container while preserving simulation coordinates. Mouse and touch positions are converted back to board coordinates, including the initial touch before firing.
- The microscope's fixed 320px circle plus controls placed 64px outside either side overflowed narrow screens. The circle now fits its panel, zoom/focus controls sit below it, and panel headings wrap.

- Detective case-board headings and navigation now stack on narrow screens rather than squeezing into three columns.

## Browser coverage

- `tests/browser/mobile-later-levels.html`: full defense field, page width, mouse aim and synthetic touch-start aiming at 320, 390 and 768px; Matching, Explorer, Quiz and Lab page widths at 390px; all four microscope controls on-screen and clickable; both later Discovery Era ordering puzzles completed using their mobile reorder buttons, reaching 4/4. This fixture continues existing guest Timeline progress after the first two discoveries, without editing saved unlocks or totals.
- `tests/browser/detective-journey.html`: 390px cafeteria and water-well cases, including wrong-identification retry and incorrect-solution recovery, then hospital and mold mysteries through their normal unlock progression.
- `tests/browser/defense-mission.html`: 390px respiratory mission through five waves to its final result. Uses ordinary UI selection and firing.
- 51 automated tests pass; production build passes.

These are browser iframe viewport tests and synthetic touch events, not certification on physical iOS or Android devices. The tests exercise gameplay mechanics, not scientific/medical content accuracy. Signed-in persistence, premium Timeline eras, remaining defense locations/difficulties and other pending release work remain outside this pass. See `development-baseline.md` and `other-guest-gameplay-checks.md` for broader limits.
