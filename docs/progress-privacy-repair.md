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
