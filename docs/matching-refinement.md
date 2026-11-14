# Microbe Matching refinement

Draft PR #3 only. Preserve a short memory game while adding an optional picture-to-clue game. Both use existing, locally hosted real micrographs and introduce Paramecium, E. coli and Penicillium. A four-pair round adds influenza A reference imagery only when the existing parent difficulty ceiling permits medium. There is no additional hard difficulty; three/four pairs are the available round sizes.

Before starting, children choose the matching style and can open Meet the cards. A three-pair round uses six cards; a four-pair round uses eight. Cards are shuffled with exactly two partners per example. In picture mode, partners are duplicate reference images. In clue mode, each pair is one picture and one short description. The clues describe the provided known examples, not a reliable identification key for unknown samples.

Show cards for help is optional and has no penalty. Unsuccessful pairs turn back over automatically after 1.4 seconds in picture mode or 2 seconds in clue mode. Successful pairs remain face up and play advances after 650ms. No continuation buttons interrupt either result. The most recent explanation and optional comparison remain available below the board after play resumes; focus/scroll stays on the board until completion. Pause, restart confirmation and unmount cancel pending timers. Result identity guards reject stale callbacks after a new round or later pair. No reading deadline, duplicate touch handler, score, efficiency ranking or mastery badge. Pair attempts count two-card selections, not individual flips. Pair counts/percentages describe board completion, not scientific accuracy or mastery. A completed round connects to deeper lab observation and a microbiologist career explanation.

Pause hides the board and retains the selected or pending pair. New round asks for confirmation; cancelling keeps the current round. Restart clears cards, attempts, feedback and reveal help. Face-down card names/images are not mounted in the accessibility tree. Numbered card labels, keyboard buttons, selected/matched styling, focus on feedback and acknowledgement help navigation. Parent route/time controls and difficulty ceiling remain enforced.

The active route no longer uses its legacy generic image/fact collection, timed reveals, educational popup panel, score persistence, analytics or imported progress/achievement presentation. Old subcomponents remain unused by this route for review/recovery. New round data is memory-only, not account progress. Shared access enforcement is unchanged. Historical tests/browser/guest-gameplay.html has legacy matching/home assertions and is not certification of this revised experience; the matching reducer tests and hosted UI checks cover this change.

## Sources and review
Image provenance/instrument limits/reuse: public/assets/micrographs/LICENSE.md and src/pages/microscope-discovery-lab/micrographs.mjs. Original source bytes remain unchanged. Credits and limits are available below the game, including during preview study.

- https://openstax.org/books/biology-2e/pages/23-3-groups-of-protists
- https://openstax.org/books/microbiology/pages/5-3-fungi
- https://www.cdc.gov/ecoli/about/index.html
- Influenza reference image: https://wwwn.cdc.gov/phil/Details.aspx?pid=8038

Editorial science/reading-age review, physical devices, broader assistive-technology testing and remote family feedback remain before release. Matching images alone is not evidence of microbiology mastery.
