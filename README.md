# Funding Data Room Copilot

Repository for the Funding Data Room Copilot static site, GPT Knowledge package, and consolidated Vercel Action dispatchers.

## Architecture

- `api/` — Vercel Serverless Function entry points only
- `actions/` — action modules, schemas, OpenAPI files, examples, tests, and documentation
- `knowledge/` — GPT Knowledge files
- `assets/` — shared images, icons, and downloads
- `site/` — public static website and browser-based tools
- `tests/` — repository-level integration, security, and OpenAPI tests
- `scripts/` — repository validation and manifest-generation scripts

---

## File Structure

funding-data-room-copilot/
├── api/
│   ├── actions/
│   │   ├── public.js
│   │   ├── secure.js
│   │   └── oauth.js
│   ├── oauth/
│   │   ├── start.js
│   │   └── callback.js
│   ├── webhooks/
│   │   └── events.js
│   └── health.js
│
├── actions/
│   ├── README.md
│   │
│   ├── shared/
│   │   ├── constants/
│   │   │   └── readiness-priorities.js
│   │   ├── responses/
│   │   │   ├── success-response.js
│   │   │   └── error-response.js
│   │   ├── validation/
│   │   │   └── validate-action-request.js
│   │   ├── security/
│   │   │   ├── detect-sensitive-fields.js
│   │   │   ├── sanitize-output.js
│   │   │   └── request-size-limit.js
│   │   ├── utils/
│   │   │   ├── normalize-business-name.js
│   │   │   ├── normalize-array.js
│   │   │   ├── create-provisional-assumption.js
│   │   │   └── create-readiness-gap.js
│   │   └── schemas/
│   │       ├── error.schema.json
│   │       ├── readiness-gap.schema.json
│   │       └── provisional-assumption.schema.json
│   │
│   ├── no-auth/
│   │   ├── README.md
│   │   ├── openapi/
│   │   │   └── no-auth-actions.openapi.yaml
│   │   ├── modules/
│   │   │   ├── build-data-room-package.js
│   │   │   ├── generate-folder-structure.js
│   │   │   ├── generate-document-checklist.js
│   │   │   ├── generate-file-naming-rules.js
│   │   │   ├── create-missing-document-tracker.js
│   │   │   ├── generate-deal-snapshot.js
│   │   │   ├── generate-privacy-checklist.js
│   │   │   ├── rewrite-context-notes.js
│   │   │   └── run-readiness-qa-gate.js
│   │   ├── constants/
│   │   │   └── public-action-names.js
│   │   ├── validation/
│   │   │   └── validate-public-payload.js
│   │   ├── schemas/
│   │   │   ├── public-action-request.schema.json
│   │   │   ├── public-action-response.schema.json
│   │   │   ├── data-room-package.schema.json
│   │   │   ├── missing-document-tracker.schema.json
│   │   │   └── deal-snapshot.schema.json
│   │   ├── config/
│   │   │   └── public-actions.registry.json
│   │   ├── examples/
│   │   │   ├── public-action-requests.json
│   │   │   └── public-action-responses.json
│   │   ├── docs/
│   │   │   ├── no-auth-actions.md
│   │   │   ├── no-auth-testing.md
│   │   │   └── no-auth-examples.md
│   │   └── tests/
│   │       ├── fixtures/
│   │       ├── unit/
│   │       └── integration/
│   │
│   ├── api-key/
│   │   ├── README.md
│   │   ├── openapi/
│   │   │   └── api-key-actions.openapi.yaml
│   │   ├── modules/
│   │   │   ├── save-data-room-package.js
│   │   │   ├── create-lead-record.js
│   │   │   ├── create-broker-handoff.js
│   │   │   ├── export-markdown.js
│   │   │   ├── export-pdf.js
│   │   │   ├── log-readiness-event.js
│   │   │   ├── create-tracker-record.js
│   │   │   ├── send-package-to-crm.js
│   │   │   └── draft-document-request-email.js
│   │   ├── auth/
│   │   │   ├── verify-api-key.js
│   │   │   ├── request-signature.js
│   │   │   └── rate-limit.js
│   │   ├── connectors/
│   │   │   ├── notion.js
│   │   │   ├── google-sheets.js
│   │   │   ├── crm.js
│   │   │   └── email.js
│   │   ├── schemas/
│   │   ├── config/
│   │   ├── examples/
│   │   ├── docs/
│   │   └── tests/
│   │
│   └── oauth/
│       ├── README.md
│       ├── openapi/
│       │   └── oauth-actions.openapi.yaml
│       ├── modules/
│       │   ├── create-drive-data-room.js
│       │   ├── create-sheets-tracker.js
│       │   ├── draft-gmail-request.js
│       │   ├── create-calendar-followups.js
│       │   ├── create-notion-tracker.js
│       │   ├── create-dropbox-data-room.js
│       │   └── disconnect-provider.js
│       ├── providers/
│       │   ├── google.js
│       │   ├── notion.js
│       │   └── dropbox.js
│       ├── tokens/
│       │   ├── token-store.js
│       │   ├── refresh-token.js
│       │   ├── revoke-token.js
│       │   └── encrypt-token.js
│       ├── schemas/
│       ├── config/
│       ├── examples/
│       ├── docs/
│       └── tests/
│
├── knowledge/
│   ├── README.md
│   ├── knowledge-manifest.json
│   ├── core/
│   │   ├── funding-data-room-builder-overview.md
│   │   ├── funding-data-room-checklist.md
│   │   ├── business-loan-document-reference.md
│   │   └── compliance-safe-language-guide.md
│   ├── workflows/
│   │   ├── funding-data-room-folder-template.md
│   │   ├── broker-processor-handoff-workflow.md
│   │   └── funding-readiness-qa-gate.md
│   ├── templates/
│   │   ├── file-naming-conventions.md
│   │   ├── missing-document-tracker-template.md
│   │   ├── deal-snapshot-template.md
│   │   ├── revenue-context-note-prompts.md
│   │   └── notion-airtable-sheets-tracker-template.md
│   ├── prompts/
│   │   └── ai-prompts-for-data-room-builder.md
│   ├── safety/
│   │   └── privacy-and-redaction-rules.md
│   └── examples/
│       └── example-data-room-scenarios.md
│
├── assets/
│   ├── README.md
│   ├── asset-manifest.json
│   ├── images/
│   │   ├── branding/
│   │   ├── screenshots/
│   │   ├── diagrams/
│   │   ├── social/
│   │   └── placeholders/
│   ├── icons/
│   │   ├── app/
│   │   ├── navigation/
│   │   ├── actions/
│   │   └── favicon/
│   └── downloads/
│       ├── knowledge/
│       ├── schemas/
│       ├── templates/
│       └── releases/
│
├── site/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── pages/
│   │   ├── getting-started.html
│   │   ├── actions.html
│   │   ├── knowledge.html
│   │   ├── templates.html
│   │   ├── privacy.html
│   │   ├── testing.html
│   │   ├── downloads.html
│   │   └── about.html
│   ├── tools/
│   │   ├── no-auth-test.html
│   │   ├── package-builder.html
│   │   ├── folder-structure-builder.html
│   │   ├── missing-document-tracker.html
│   │   └── readiness-qa.html
│   ├── data/
│   │   ├── site-map.json
│   │   ├── actions-catalog.json
│   │   ├── knowledge-catalog.json
│   │   └── downloads-catalog.json
│   └── components/
│       ├── header.html
│       ├── footer.html
│       └── privacy-warning.html
│
├── tests/
│   ├── integration/
│   ├── security/
│   ├── openapi/
│   └── fixtures/
│
├── scripts/
│   ├── validate-json.js
│   ├── validate-imports.js
│   ├── validate-openapi.js
│   ├── build-action-catalog.js
│   └── build-knowledge-manifest.js
│
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
├── README.md
└── CHANGELOG.md
