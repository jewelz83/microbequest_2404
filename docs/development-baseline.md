# MicrobeQuest development baseline

Prepared October 23, 2026. This branch is a development recovery candidate, not a release candidate. Do not merge or publish it as a completed repair.

## Evidence and provenance

| Source | Observed state |
| --- | --- |
| jewelz83/microbequest_2404 main | cc67bbc674eb8303a3b6c0b262f5901776a47216, April 11, 2026. Netlify identifies this repository as its source. |
| jewelz83/MicrobeQuest main | da0185c21e417b651dee525b855850515617a6d5, March 14, 2026. Older alternate repository; not selected for this branch. |
| Owner's microbequest (10).zip | Uploaded October 18, 2026. Imported here without its environment values. Before setup edits: 36 added files, 40 modified files, zero removed files relative to the selected repository, excluding .env and Git metadata. |
| Rocket editor | Current project is 68f2413667da670013e80bb3. Visible history includes later parent-account and onboarding work. Routes.jsx's visible opening matches the newer export's lazy-route structure. A fresh whole-export byte comparison is still outstanding. |
| Netlify microbequest | Project f40496b9-2edf-4a3d-8817-59c30751d1e2. Published deployment 69e922e2b8df6c67a9d187f9, April 22 at 3:34 PM. Deploy details show initialization/build skipped and an uploaded dist/ artifact. No commit-to-artifact equivalence was established. |
| Isolated backend | MicrobeQuest Billing Test, project zbrrtccqzecgljlloxcc. Its dashboard exposes game, consent, parent, classroom and subscription tables. No schema, permissions, rows or functions were changed in this setup pass. |

## Changes made during recovery

- Imported the October 18 source export into a separate branch based on the repository Netlify identifies.
- Repaired the out-of-sync lockfile and committed it for repeatable installs. The inherited testing-library packages require legacy peer dependency resolution; .npmrc records that existing compatibility requirement. This is not a dependency modernization pass.
- Wrapped App routes in AuthProvider; changed the context default to undefined so useAuth's existing missing-provider guard can work.
- Removed the old tracked .env from this branch. It contained empty fields. Ignored local environment files and added .env.example with only the public client settings the application currently consumes.
- Configured the local environment with the isolated test project's public client key. No environment values are committed. Analytics remains unset.
- Added repository guidance for branch-based work, testing, privacy boundaries and the planned one-time-purchase product direction.

## Verification

- Initial npm ci failed because the exported lockfile omitted Supabase dependencies declared in package.json.
- Repaired lockfile; clean install and Vite production compilation passed. Build output directory is build/, matching the imported netlify.toml.
- Vite development server started at 127.0.0.1:4028 after overriding the inherited wildcard host, which fails in this execution environment.
- The connected user browser could not reach that server (connection refused). Therefore visual rendering, login, saved progress and gameplay are not certified by this pass.
- No production release, production backend change, live payment, analytics activation or AI-provider request occurred.

## Required work before choosing a release candidate

1. Obtain a fresh complete Rocket export and compare it with this imported snapshot. Preserve any subsequent edits.
2. Recover the prior isolated authentication and billing fixes described in the original audit. They were not present in this workspace and must not be assumed included. The AuthProvider correction here is only one startup repair.
3. Compare the deployed Netlify artifact with source and preserve a rollback reference. Do not treat main or the newer export as an already verified representation of the published game.
4. Establish a preview reachable from the owner's browser, using the isolated backend and public client settings only. Keep automated production publishing out of this branch's workflow.
5. Reproduce the startup, guest play, login and account-switching journeys. Then repair parental enforcement, consent-aware persistence and account-scoped caching with regression tests.
6. Address game progression, scoring, fabricated progress, scientific content and accessibility against the detailed original audit. Imported migration and edge-function files have not been deployed or certified.

## Original audit status to preserve

The audit documented confirmed failures of saved parent restrictions and tracking opt-out; incomplete Germ Buster wave/end-state wiring; incorrect scoring and fabricated milestones; unscoped browser progress caching; incomplete exports; and keyboard/mobile/content defects. Matching persistence and early Timeline progression passed in the isolated environment. Full later-game, classroom cross-user, payment recovery, deletion and device coverage remains outstanding. Importing source and passing a build do not resolve these findings.

## Hosted preview setup follow-up, October 23

Netlify automatically created https://deploy-preview-1--microbequest.netlify.app for this draft. Initial artifact inspection showed no embedded Supabase host; the dashboard confirmed no project environment variables existed. The missing-settings startup error remained in the compiled entry.

Added VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY with values only in the Deploy Previews context, pointing to the isolated Billing Test project and using its public publishable client key. Each variable has one value in one deploy context. Production, branch deploy, agent runner and local CLI contexts were left unset. No database privilege, policy, schema or account credential was changed. Analytics remains unconfigured. This follow-up commit requests a fresh preview build; runtime checks follow deployment.

## Hosted preview verification

Verified the rebuilt preview in the connected Chrome browser on October 23:

- Home rendered and the intro could be skipped through its visible controls.
- A complete guest matching round reached 6 matches, 600 points, 12 moves and Completed. The known 500% efficiency defect reproduced and remains unresolved. Hidden card contents are still exposed in the accessibility tree.
- Initial direct entry to /microbe-matching-game returned Netlify's 404. Added an explicit non-forced SPA fallback to netlify.toml. After deployment b3aba6ac88d2b73789bb3324b7cc404b6a1980bd, both direct navigation and a full browser reload rendered the matching heading successfully.
- Static inspection of the hosted entry bundle found only the isolated test Supabase host and no GA measurement identifier. No signed-in account was used for the guest test; account and cross-account persistence are not certified.
- Copied current Rocket package.json and App.jsx through the visible editor. Package settings match the imported snapshot; App.jsx exactly matches the original exported entry before the branch's AuthProvider correction. Full archive and deployed-artifact reconciliation remains outstanding. A Rocket download monitor timed out; it did not establish a fresh archive comparison.

The preview is available at https://deploy-preview-1--microbequest.netlify.app. It retains known audit defects and is for test/review only. Production remains on its prior deployment. Next repair scope is consent-aware persistence, account-specific caching and enforced parental restrictions, with targeted regression tests and isolated account fixtures.
