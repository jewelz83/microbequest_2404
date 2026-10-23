# Guest gameplay follow-up — October 23, 2026

## Reproduced defects and repairs

On the hosted PR #2 preview, selecting a matching pair and immediately restarting produced 100 points, one matched pair and an educational panel in the new round with zero moves. Matching now owns its delayed resolution in an effect that cancels on restart, difficulty change, pause and unmount. Resume resolves the pending pair once. Restart also clears hints and the educational panel. A completed game cannot be resumed through the pause button.

Face-down cards exposed their images, names and categories in the accessibility tree. Cards now use native keyboard-operable buttons with numbered labels. Their visual contents are excluded from the accessibility tree, while the button's label reveals the microbe only after flipping. Hint, pause and restart controls have accessible names at narrow widths. Obsolete celebration/flip animations are cleared when a round resets.

Home displayed hard-coded points, a five-day streak, eight discoveries and three awards. The invented progress panel and its fabricated collection count were removed. Home links to the existing saved-progress hub and explains the guest persistence boundary: timeline progress is browser-local; guest game scores are not saved. The Matching shortcut no longer claims to resume a previous activity. The static daily-challenge countdown and unimplemented bonus/badge promises are replaced with an honest World Explorer invitation.

## Verification

Use `npm start`, then open `/tests/browser/guest-gameplay.html` on localhost and choose **Run guest regression checks**. This synthetic fixture resets localhost guest controls and elapsed usage, disables limits during gameplay tests, and preserves saved timeline progress. Do not run it against an authenticated session. It is not included in the production build. Restart Vite after editing inline fixture code if the dev server retains the old HTML proxy module.

The fixture covers pending-match restart, paused resolution and resume, mismatch callbacks crossing a restart, difficulty-change cleanup, hint reset, full-round completion, completed-game resume prevention, Home's progress message, and route-loading smoke checks. Route loading is not certification of complete playthroughs in those games.

Independent keyboard check: Enter flipped a card and incremented moves to one; Space on Restart restored zero moves and face-down cards. The browser accessibility tree showed only numbered hidden-card labels before a flip, with no hidden child names or images.

The 41 existing automated tests and production build pass. Browser outcomes are recorded in the task and its screenshots.

## Remaining boundaries

True hidden-tab and separate native-window timing transitions remain unverified: the connected in-app browser previously kept documents marked visible when hidden or switched. The two-document overlap test is recorded separately in elapsed-play-limits-implementation.md. Signed-in checks remain deferred at the user's request. Broader game audits, scientific-content review, mobile device coverage and backend/privacy work in development-baseline.md are still required before release. This follow-up does not certify those areas.

No production deployment, backend migration, real child data, payment or analytics changes.
