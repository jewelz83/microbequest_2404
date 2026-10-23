# Play schedule enforcement

October 23, 2026. Draft preview only; no production or database migration.

All seven game routes evaluate allowed days/hours when screenTimeEnabled is true. Windows use device-local time, include opening and exclude closing. Overnight windows belong to the starting day, including Saturday-to-Sunday rollover. Equal start/end, malformed times and empty day lists deny play. Explicitly disabled screen-time controls skip schedule enforcement. Parent Controls explains these semantics.

The gate reevaluates time each second and on visibility/focus events. An expired window unmounts the current game; reopening starts a fresh round. Settings changes refresh at the existing 15-second interval. Background browser throttling can delay timer delivery. The device clock and local guest settings can be manipulated; this is not tamper-proof or cross-device enforcement.

Validation: all 28 tests and production compilation pass. Tests cover opening/closing boundaries, disallowed days, overnight dates, week rollover, invalid values and disabled scheduling. In the signed-out preview, Friday was disabled through Parent Controls. Direct Matching entry showed the schedule block, including after reload.

Browser access became unavailable before Friday could be restored and recovery tested. The guest preview fixture therefore still has Friday disabled. Restore Friday through Parent Controls and Save Settings before further normal guest play. This has no effect on production or signed-in backend settings. Recovery, actual live cutoff and signed-in browser checks remain unverified.

Daily/session elapsed-use limits remain separate unfinished work. They require account-scoped usage state that survives routes and reloads, a defined session-break rule, midnight handling and multiple-tab coordination. A per-game timer would reset too easily and is not an adequate repair.
