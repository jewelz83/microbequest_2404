# Progress privacy repair candidate

This branch builds on the unmerged development baseline. No production deployment or database migration is included in this pass.

## Behavior

- Browser history is separated into a guest key and account-specific keys. The old unscoped progress key is not imported, and guest history is never automatically assigned to a signed-in account.
- Login reads remote history without uploading browser history. A missing remote record starts empty, so a stale cache cannot recreate deleted history. Offline cache conflict resolution is deferred; the server remains authoritative when reachable.
- Account changes cancel outstanding progress operations and remount game routes to discard the previous account's in-memory game state. Unavailable session verification never falls back to writing guest data.
- New cloud progress, scores and achievements require a readable parental-controls row with progress_tracking_consent=true, a valid recorded grant timestamp, and no later withdrawal. Missing/invalid consent or read errors block saves and clear that account's progress cache. No claim is made that the existing consent form establishes legally verified parental consent.
- Withdrawal timestamps in the existing schema are not category-specific. Conservatively, a later withdrawal blocks progress saving until a fresh grant, even when the withdrawal originally concerned another category. The separate consent design needs correction before release.
- Existing score/achievement history remains readable after opt-out. Account progress loading defaults empty without recording permission; the current game's in-memory play remains available.
- Authenticated parent settings do not read or populate the shared guest settings cache. Missing remote settings start from non-tracking defaults without an implicit upsert. Failed grants/withdrawals throw so the UI can report failure.
- Account data deletion also clears the new progress cache for that account. Full deletion/export completeness remains a separate unresolved audit finding.
- Timeline save feedback waits for the save result and distinguishes account saving, device-only saving, blocked saving and failure. It no longer announces an unconditional success after an activity.
- Authentication profile/subscription responses from the previous account are discarded; old metadata is cleared as the account changes. Initial session loading cannot overwrite a newer auth event.

## Validation

Validation completed October 23, 2026: all 21 regression tests pass, production compilation passes, and git diff --check passes. Run npm test and npm run build. Tests use injected/fake clients and synthetic account identifiers; no real child records or external authentication requests are used.

Covered: guest/account isolation, account-to-account cache separation, missing remote rows, opt-out, absent grants, invalid dates, unavailable consent, permitted saves, regrant, account changes during pending reads/saves, failed session verification, and failed parent consent updates. These tests establish client behavior, not production database security.

## Release blockers still open

- Database enforcement is required to prevent bypassing the client or racing a withdrawal against an in-flight write. No production-shaped server consent guard has been executed or certified here.
- Default PIN 1234, shared local PIN/audit/deletion-receipt storage, insecure consent verification, analytics consent, and parent role/child relationships remain unresolved.
- Signed-in browser tests with two disposable accounts are still required. Mocked account-switching tests do not replace them.
- Parent mode/difficulty/time restrictions remain unenforced; game scoring/content/accessibility findings are unchanged.
- Complete Rocket and published-artifact reconciliation remains open. Do not merge this candidate directly into production.

## Hosted guest check, October 23

The deployed repair preview at https://deploy-preview-2--microbequest.netlify.app rendered the Timeline on direct entry. Through visible controls, completed the first focus activity and then fully reloaded the page. The next event stayed unlocked, the persisted points display remained 50, and the status explicitly read 'Progress saved on this device.' The known doubled Timeline award and stale 0/4 navigator count remain unresolved.

The isolated backend currently lists billing-test@example.com as its sole user. Its password is not available to the agent. The repair preview's sign-in page is prepared for owner entry; a second disposable account is still needed for a real browser account-switching test. No credentials were created, changed or read during this pass, and no signed-in gameplay was counted as verified.

## Signed-in follow-up, October 23

The owner created audit-one@example.com and audit-two@example.com and privately signed into the first account. This supersedes the earlier sole-user observation. Only synthetic application profiles and a stored consent fixture for audit-one were added in MicrobeQuest Billing Test. No schema, policy or production changes were made. The stored grant simulates permission for testing; it is not verified parental consent.

- Account Settings confirmed audit-one. Timeline started at zero without importing the guest's 50 points.
- Without a consent record, a completed matching round left both score and progress row counts at zero.
- After adding the synthetic stored grant, a matching round saved one 600-point score at 2026-10-23 13:29:44.343782+00.
- The first Timeline activity saved 50 points and completed_events=["leeuwenhoek-discovery"]. A full reload preserved the result. The doubled award remains an open defect.
- Parent Controls → Opt Out All recorded tracking=false and withdrawal at 2026-10-23 13:32:19.621+00.
- Another completed matching round left the score count at one and its timestamp unchanged. Previously stored Timeline progress remained 50.
- Sign Out left the first account active, including after reload. Account-to-account browser isolation remains unverified.

A follow-up moves profile/subscription requests outside the authentication callback into a deferred effect, removing a possible authentication-lock stall. All 21 existing tests and compilation pass; these tests do not prove the logout fix. Preview logout and second-account checks must still be repeated.

## Second-account browser verification, October 23

The deployed deferred-effect change was confirmed present in the hosted source map, and Netlify reported preview success. Both open preview tabs were refreshed. Mouse clicks on the header Sign Out did not visibly end the session. Activating that same control with Enter did sign out; a full reload remained signed out. The cause of the mouse interaction failure remains unresolved, so the callback change is not certified as its fix.

The owner privately signed in as audit-two@example.com. Account Settings showed that email and Synthetic Audit Two, with no prior account metadata. Timeline started at zero points with First bacteria observed still locked, despite the first account and earlier guest having completed the opening event. Completing the first focus activity showed 50 in-memory points; full reload returned to zero and relocked the second event. No tracking permission was granted to audit-two. This verifies the observed account-one → account-two Timeline journey and no-permission reload behavior, not all game modes or database access policies.

## Navigation and parent-enforcement follow-up, October 23

The mouse sign-out failure was layout overflow: at a 1440px viewport Sign Out began at x=1660. Desktop navigation now shrinks and scrolls horizontally while account actions retain their width. After deployment the button ended at x=1416 and center hit-testing reached it. Clicking with the mouse signed audit-two out; full reload stayed signed out. At the 1024px desktop breakpoint Sign In ended at x=1000. The prior authentication deferral was not established as the cause or fix of the click failure.

At 390×844, the expanded mobile menu originally placed Sign In at y=998–1071. The menu now has a viewport-height cap and vertical scrolling. After scrolling, Sign In occupied y=755–828, center hit-testing reached it, and a mouse/touch-style click navigated to /login. The navigation toggle now has an accessible name and expanded state. Temporary viewport overrides were reset after testing. Both compilation and all 21 existing regression tests pass; visual checks, not those tests, establish the observed layout behavior.

Parent enforcement investigation: saved allowedGameModes, maxDifficultyLevel, daily/session limits, allowed days and hours are read by the settings page but not the games. Enforcement must gate direct game routes as well as dashboard links, constrain difficulty choices/question pools, and track elapsed play across route changes. Existing loadParentalControls returns defaults on backend failures; enforcement needs an explicit unavailable-settings result rather than treating errors as permission. Usage and time-zone semantics need defined behavior and tests. These controls remain unresolved.
