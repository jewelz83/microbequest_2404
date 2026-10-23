# Matching progress and efficiency

The old controls calculated efficiency from score divided by moves times ten. A single pair awarded 100 points for two card flips, displaying 500% efficiency. The progress bar also assumed every board ended at 1,000 points, leaving an easy six-pair game at 60% after completion.

Controls now receive matched-pair and total-pair counts from the actual board. Completion uses matched pairs divided by total pairs; efficiency uses matched cards divided by moves (the existing game counts one move per card flip). Scores and stored move semantics are unchanged. Progress includes a visible pair count and accessible progressbar values. Empty and inconsistent counters produce bounded percentages.

Validation: all 41 automated tests pass; Vite build passes. Targeted tests cover the reported 500% case, misses, all three board sizes, reset state, and invalid counters. A real local guest round showed 1 of 6 pairs and 100% efficiency after the first successful pair, then 6 of 6 pairs, 600 points, 12 moves, 100% efficiency and the completion message after the final pair. A screenshot is saved with the task outputs.

This does not repair hidden-card accessibility leakage, delayed-match/restart behavior, fabricated dashboard achievements or other game audit findings. No production or backend changes.
