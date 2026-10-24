# Device-local elapsed play limits

Daily and session duration controls are connected to the shared game gate. A coordinator above the routes manages visible, allowed game time; navigation does not create a new session. Guest and authenticated identities use different storage keys. A continuous 15-minute break resets session time; local midnight resets daily time independently. Both allowances must be available. Disabled controls preserve usage without accumulating more time.

The timing service serializes localStorage updates with Web Locks. Each visible game tab renews a lease every 250 milliseconds, lasting at most two seconds or its remaining allowance. The accounting cursor integrates the union of all leases, splitting at local midnight. Normal route/visibility transitions settle the interval and remove the tab lease. Crashes may charge up to two additional seconds, without requiring an unload write. A stale grant stops authorizing a game; browsers must support Web Locks, AbortSignal.timeout and persistent localStorage. Failed reads/writes, invalid records, malformed limits and backward persisted clocks block play. In-page wall-clock jumps compared with performance.now require checking the clock and reloading.

Only the current daily total, session total, last counted timestamp, accounting cursor and short tab leases are stored. No scores, game names, email addresses or activity log are included. Export includes this device's record, and deletion removes the selected identity's record under the same lock. Old daily/session totals are reset on the next access; inactive browser storage remains until that access, parent deletion or browser data removal. Existing broader privacy/export deficiencies are not certified by this change.

This is device-local parental restriction support, not tamper-proof or cross-device enforcement. Browser storage removal, device clock changes across restarts and other devices can bypass it. Suspended JavaScript cannot render a cutoff until execution resumes. No backend schema, production deployment, analytics or payment changes are included.

## Verification

- 36 Node tests pass, including boundaries, setting changes, union accounting, navigation/reload continuity, 15-minute recovery, midnight/DST elapsed time, identity isolation, cancelled activation, crash expiry, malformed data and storage/coordination failure.
- Clean npm ci using the committed lockfile and Vite production build pass. Diff whitespace checks pass.
- Local in-app browser, synthetic guest fixture: initial game rendered; five-second session cutoff unmounted Matching; reload and direct Quiz entry remained blocked; simulated elapsed 15-minute break restored Matching; five-second daily cutoff displayed next local midnight; raising both limits restored play.
- Browser testing used synthetic guest configuration against the isolated test host, with no authenticated account or backend writes. The temporary fixture is not included in the branch.
- Two-client serialization and identity changes are covered by deterministic service tests. Actual simultaneous visible browser windows, signed-in journeys and hosted-preview cutoff/recovery remain to verify; no claim of production readiness.

## Guest concurrency follow-up

Two separate visible game documents (Matching and Quiz, same-origin frames) used real browser Web Locks and shared localStorage. The fixture observed two concurrent leases. Both games blocked at a six-second session allowance, with 6,000 milliseconds recorded once; observed active wall span was 6,107 milliseconds including startup/heartbeat gaps. Both remaining lease sets were empty. This verifies concurrent documents, not separate native windows. Reproducible localhost-only fixture: tests/browser/guest-coordination.html. It resets synthetic guest controls and usage; never use it for real records.

The browser connection kept documents marked visible when its panel was hidden or another connected tab was inspected. Consequently no actual visibilitychange-to-hidden was observed: hidden-page accounting and round preservation remain unverified in a native browser. Signed-in checks were deferred at the user's request. All 41 automated tests pass after the separate Matching metrics repair.
