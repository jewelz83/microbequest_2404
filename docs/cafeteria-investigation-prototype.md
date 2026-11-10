# The Cafeteria Clue prototype

A connected investigation at `/investigations/cafeteria`, based on the First Investigation Brief. This branch is stacked on PR 2 (`codex/progress-privacy-2026-10-23`), not a production release.

## Behavior

- Three initial paths change evidence order and guidance.
- Twelve fictional survey records drive salad/apple/water comparisons. Equal illness counts and no comparison group receive distinct feedback.
- Predictions are recorded, not graded. An unfair experiment setup can be repaired. The qualitative virtual model is explicitly not a test of the school's food.
- Conclusions require the interview and storage observations to have been visited, the survey pattern, exactly two valid evidence statements, a bounded claim and acknowledgement that more evidence is needed. Extra incorrect evidence prevents completion.
- Guest notes save only to a separate device-local prototype key. Malformed/version-mismatched records reset safely. Authenticated sessions have separate in-memory state and do not write account progress; account persistence is deliberately pending validation. No backend, analytics, payment or tutor calls are introduced.
- Existing Detective access and elapsed-play gate wraps the new route.
- Pause, notebook, restart confirmation, reduced motion, keyboard controls and narrow-screen layouts are provided. No real person records or clinical advice.

## Science references

Fictional case data and qualitative model, not a recreation of a real outbreak. Use association language and recommend further investigation, without naming an organism from timing or symptoms. The brief cites CDC investigation steps and FDA food handling guidance. Final child-facing content still requires editorial science and age review.

https://www.cdc.gov/foodborne-outbreaks/outbreak-basics/investigation-steps.html
https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling

## Verification

55 Node tests pass, including four new mission tests covering fixture counts, stage prerequisites, conclusion feedback criteria and saved-state validation. Final production build passes. A self-contained HTML package derived from the same mission component passes a simulated-DOM integration journey covering three food comparisons, unfair setup recovery, incorrect model interpretation, incorrect claim recovery, invalid extra evidence rejection, completion, guest saved-state reload, notebook Escape and pause/resume. This is interaction testing in JSDOM, not browser layout or physical-device verification. Both connected and cloud browsers reported connection refused for the local preview server; visual browser checks remain pending. Upload to the public GitHub repository was blocked by automatic approval review pending explicit owner authorization; no hosted prototype preview or production release is claimed. No production release or backend change.
