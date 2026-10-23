# MicrobeQuest development

## Product intent
MicrobeQuest is a children's microbiology game from Chase Street Press. Prioritize scientific accuracy, reliable gameplay, accessibility, responsive layouts, smooth performance, and honest progress feedback. The planned commercial direction is a free introduction and a one-time purchase for the Microbiology Edition; the imported subscription implementation is legacy behavior, not an approved product requirement.

## Development boundaries
- Work in a feature branch. Do not push directly to main or publish a production deployment.
- Use disposable fixtures in the isolated MicrobeQuest Billing Test backend. Do not use real child records.
- Never copy production secrets into source, logs, tests, or documentation. Browser-exposed VITE_* variables must contain only public client configuration.
- Frontend deployments and backend migrations are separate changes. Do not execute imported SQL automatically.
- Do not replace missing activity with fabricated scores, achievements, or milestones.
- Do not enable an external AI tutor, analytics, or payment flows as part of baseline setup.

## Setup and verification
- Copy .env.example to .env.local and enter the test project's public Supabase URL and anon key through an authorized configuration flow.
- Run npm ci, then npm run build.
- Run npm start for development (port 4028); npm run serve serves the compiled build.
- A successful build does not certify runtime authentication, backend policies, persistence, or gameplay. Add targeted regression coverage when repairing those behaviors.
- Read docs/development-baseline.md before choosing a release baseline.
