# Difficulty ceiling repair

October 23, 2026. Draft preview only.

GameAccessGate passes the saved difficulty ceiling to games after the strict settings read. Matching and Germ Buster expose only permitted choices and reject higher values in their selection handlers. Quiz filters the question bank by that ceiling before calculating question counts and progression. Unknown ceilings default to Easy; unknown question levels are excluded. Missing account rows still use the existing Medium default.

A ceiling change detected by the gate remounts the game, discarding the current round, including when the ceiling is raised. Settings refresh on focus and every 15 seconds. This prevents a previously selected harder round from surviving a lower ceiling but is not instantaneous server enforcement.

Validation: all 25 automated tests pass, compilation and diff checks pass. Guest preview settings were changed through Parent Controls. Easy: Matching exposed Easy only, Germ Buster exposed Easy only, Quiz showed three questions. Hard: Matching exposed all three choices, Quiz showed ten questions. Restored Medium: Matching exposed Easy and Medium only. These are browser option/question-pool checks, not full-round or signed-in certification.

Remaining: fixed-difficulty content in the other modes has not been classified or gated by this ceiling; difficulty labels do not certify age suitability. Signed-in and live mid-round ceiling-change browser checks remain open. Play schedules and session/daily limits are not implemented here. Production and backend schema are unchanged.
