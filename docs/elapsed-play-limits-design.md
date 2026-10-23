# Elapsed play limits: proposed implementation

October 23, 2026. Design and source review only. Daily/session duration enforcement is not implemented or verified. Production remains unchanged.

## Confirmed source gap

parentalControlsService.js loads and saves dailyTimeLimitMinutes and sessionTimeLimitMinutes. GameAccessGate.jsx checks allowed mode, difficulty ceiling and schedule, but never consumes either duration. Routes.jsx wraps all seven games with that gate. A timer inside each game would restart on navigation and cannot satisfy these controls.

## Proposed behavior

These are implementation defaults for review, not previously approved product commitments.

- Count elapsed time while an allowed game is mounted in a visible tab, including game menus and pauses. Hidden tabs and non-game pages do not count. Browser focus alone must not count play.
- Daily allowance spans all seven games and resets at device-local midnight. Split intervals crossing midnight; do not assign the entire interval to one date.
- A session spans games, reloads and short interruptions. Require 15 continuous minutes without counted play to start a new session. Opening another game or reloading does not clear a reached limit.
- Reaching either limit unmounts the game and displays which limit was reached, when access can resume, and links to Home and Parent Controls. Parent Controls remains accessible. Raising a limit can restore access after settings refresh.
- Daily reset does not itself clear session usage. A session crossing midnight continues until the break rule is met.
- Guest and each signed-in account have separate usage records. Account changes cancel pending updates and stop the previous owner's accounting. Guest time never transfers to an account.
- Count concurrent visible game tabs as the union of active intervals rather than summing or overwriting them. Do not use a single last-writer-wins accumulated counter.
- Disabling screen-time controls bypasses schedule and duration restrictions. It does not erase existing usage. Reenabling uses retained usage for the current day/session.
- Invalid limits, unavailable required storage or failed coordination block play with an explanation and retry, rather than silently allowing unlimited play. A missing valid record is a new usage record, not a storage failure.

## Implementation shape

Build an injectable usage service outside individual games. Give it clock, storage, identity and coordination dependencies so time can advance deterministically in tests. A single app-level coordinator owns the active route and visibility lifecycle; GameAccessGate consumes its decision. Do not start independent counters on each gate mount. Commit accumulated intervals before route, visibility or identity transitions; final page-close delivery cannot be assumed reliable.

For browser-only enforcement, use an explicitly supported cross-tab synchronization mechanism and serialized updates. Define heartbeat expiry and conservative recovery after crashes before choosing a lease algorithm. Detect unsupported coordination rather than silently running unsafe concurrent counters. Use a monotonic clock for in-page durations, reconcile persisted timestamps on reload, and handle backward clock changes without granting negative usage. Device clock manipulation, storage clearing and other devices remain bypasses; do not advertise this as tamper-proof or cross-device enforcement.

Keep only the minimum timing data necessary for restrictions. Do not put scores, activity history, email addresses or analytics in the usage record. Define its retention and deletion/export behavior with the privacy repair; an account-scoped identifier alone does not settle the consent design. No backend migration is authorized by this document.

## Acceptance checks before claiming repair

1. Daily and session boundaries: just below, exactly at, and beyond each limit; lower or raise settings mid-play; disabled and malformed controls.
2. Route changes and full reload preserve elapsed usage; Home and Parent Controls stop accounting without resetting session.
3. Short interruption preserves session; a 15-minute break resets session only; daily total remains.
4. Midnight splits daily usage correctly while session continues; local-date and daylight-saving transitions do not create negative durations.
5. Guest/account and account/account changes isolate records, including pending writes and multiple open tabs.
6. Two visible tabs neither double charge nor lose usage; hidden tabs stop counting; closing/crashing the coordinator recovers within a defined bound.
7. Storage denial, corrupt records, clock rollback and unsupported coordination produce explicit safe behavior.
8. Run targeted automated tests, the existing suite, npm run build and diff checks. In the hosted test preview verify actual cutoff, reload/navigation persistence, recovery, and a two-tab journey. Preserve production and synthetic-only backend boundaries.

## Current execution blocker

The coding execution environment failed to initialize and remained unavailable when work resumed. Source was reviewed through GitHub. No application code was changed, and no new build or automated test result is claimed by this design pass. Implement and execute the checks once the workspace is available.
