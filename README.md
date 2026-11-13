# Vexorion / Azure audit command center

A futuristic, readable, English-language frontend for auditing Azure, assigning findings to engineers and rewarding verified resolutions with XP. Built with plain HTML, CSS and JavaScript; no application dependencies or build step.

## Run locally

```sh
python3 serve.py
```

Open **http://localhost:4173**. The server listens on loopback only. For another port, use `python3 serve.py --port 8080`.

## Experience

- A dark command center with mint, turquoise and violet accents, larger typography, posture scoring, charts and priority findings.
- Searchable findings with severity, domain, status and engineer filters, ownership tabs and pagination.
- Finding drawers with impact, affected resource, control reference, remediation guidance, assignment and verified resolution.
- A scoped, simulated audit with progress, background execution, saved report snapshots and standalone HTML report downloads. Open a downloaded report and print to save a PDF.
- CSV exports for filtered findings and resource inventory.
- An inventory of 1,248 sample resources and a searchable catalog of 18 audit areas with 518 illustrative checks.
- Illustrative Microsoft cloud security benchmark, CIS Azure and ISO 27001 readiness views.
- Engineer profiles, XP, levels, achievements, a team leaderboard and personal weekly goals.
- Activity history, notifications, global search (Cmd/Ctrl+K), preferences and demo reset.
- Responsive layouts, keyboard-accessible dialogs, focus trapping, reduced-motion support and local persistence.

## Audit areas

Identity & access; privileged access; network security; threat protection; data protection; storage accounts; compute & virtual machines; containers & AKS; applications & APIs; databases; keys & secrets; logging & monitoring; backup & recovery; governance & policy; cost optimization; performance & reliability; DevOps & supply chain; compliance & posture.

The catalog is inspired by the [Microsoft cloud security benchmark](https://learn.microsoft.com/en-us/security/benchmark/azure/) and [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/). The listed check totals describe an illustrative frontend catalog, not implemented Azure scanning rules or complete control coverage.

## XP rules

Critical findings earn 200 XP, high 100 XP, medium 50 XP and low 25 XP. To resolve a finding, assign an engineer and confirm that remediation has been reviewed and verified. XP goes to that assigned engineer.

Each finding receives one immutable first-resolution record. Repeated saves do not award more XP. Reopening suspends its credit; resolving it again restores the original points, credit owner and date. Reassignment does not transfer historical credit. Weekly goals count first-time verified resolutions in the current Europe/Prague week, beginning Monday. The sample workspace starts with 18 resolved findings and their associated XP.

Posture scores are separate from XP. The custom demo score is `round(100 × (518 − 4.5 × active findings) / 518)`. It is not Microsoft Secure Score. Historical charts and compliance readiness are illustrative sample data.

## Data and live integration

This is a frontend demonstration. It makes no Azure API calls, asks for no credentials, executes no remediation commands and changes no cloud resources. It does not send invitations, notifications or email. Data is stored in this browser under `vexorion-command-v2`; old frontend demo storage is preserved separately. Generated reports preserve findings and assignees at the moment of completion.

Live auditing requires a backend, Microsoft Entra authentication, authorized Azure API access, audit workers, persisted evidence and a shared team database. Compliance readiness is illustrative and does not establish certification.

## Checks

With Node.js installed:

```sh
node audit-model.test.cjs
```

Ten checks cover ownership, verified remediation, duplicate XP prevention, reopening, immutable credit, report snapshots, score changes and invalid storage. Browser checks cover assignment, resolution, persistence, simulated audit completion, report download, filtering and responsive layouts.

## Active files

- `index.html`: entry point, metadata and font loading.
- `audit-model.js`: sample data and independent assignment, XP, scoring and report rules.
- `command.js`: application views, routing and interactions.
- `command.css`: visual system and responsive components.
- `readability.css`: larger typography and comfortable layout spacing.
- `audit-model.test.cjs`: business-rule checks.
- `favicon.svg`: Vexorion brand mark.
- `serve.py`: dependency-free local server.

Older frontend files are retained in the workspace but are no longer loaded. Google Fonts are optional; system font fallbacks work offline.
