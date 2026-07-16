# MASTER PROMPT — Build the Funding Data Room Copilot No-Auth Actions Stack

You are building the complete **No-Auth Actions stack** for a Custom GPT named **Funding Data Room Copilot**.

The stack must be designed for deployment on **Vercel Hobby** while preserving the user's limited serverless-function budget.

## Core Architecture Constraint

Create exactly **one Vercel Serverless Function** for all public actions:

```text
api/actions/public.js
```

Every individual action must be implemented as an imported module under:

```text
lib/actions/public/
```

Do **not** create one serverless function per action.

The OpenAPI document must expose a single POST operation:

```text
POST /api/actions/public
```

The request body must include an `action` enum and a `payload` object.

This architecture should consume only **one Vercel function slot**.

---

# Primary Product Role

Funding Data Room Copilot helps small business owners, funding brokers, processors, referral partners, and operators:

- organize business funding documents
- create clean folder structures
- identify missing, outdated, incomplete, or conflicting items
- standardize file names
- prepare deal snapshots
- draft factual revenue and cash-flow context notes
- identify operational readiness gaps
- recommend next-best actions
- create privacy and redaction checklists
- run a final readiness QA gate

It does not:

- guarantee funding
- predict approval
- determine eligibility
- replace underwriting
- provide legal, tax, accounting, compliance, or lending advice
- fabricate, alter, conceal, or manipulate documents

Core positioning:

> **Organization first. Readiness guidance second. Underwriting never.**

---

# Source Materials

Use relevant project materials when available, including:

- `funding-data-room-copilot-gpt-builder-prompt.md`
- `funding-data-room-builder-overview.md`
- `funding-data-room-checklist.md`
- `funding-data-room-folder-template.md`
- `business-loan-document-reference.md`
- `file-naming-conventions.md`
- `missing-document-tracker-template.md`
- `deal-snapshot-template.md`
- `revenue-context-note-prompts.md`
- `privacy-and-redaction-rules.md`
- `funding-readiness-qa-gate.md`
- `compliance-safe-language-guide.md`
- `example-data-room-scenarios.md`

If these files are attached, use them as the source of truth for business rules, wording, readiness priorities, and privacy constraints.

Do not invent lender-specific criteria or underwriting rules.

---

# Required Technology and Runtime Rules

Use:

- plain JavaScript
- Node.js-compatible ES modules
- native Web or Node APIs where practical
- no framework
- no database
- no authentication
- no persistent storage
- no build step
- no React
- no Next.js
- no TypeScript unless explicitly requested later

Avoid external dependencies unless absolutely necessary.

Because no `package.json` is included in this task, prefer dependency-free implementations.

All action logic must be deterministic and based only on the submitted payload and embedded rules.

Do not call an external AI provider from these public actions.

---

# Public Action Names

Use these exact action identifiers:

```text
build_data_room_package
generate_folder_structure
generate_document_checklist
generate_file_naming_rules
create_missing_document_tracker
generate_deal_snapshot
generate_privacy_checklist
rewrite_context_notes
run_readiness_qa_gate
```

Define them once in:

```text
lib/constants/public-action-names.js
```

Reuse the constants everywhere else.

---

# Shared Request Contract

Use this request shape:

```json
{
  "action": "generate_folder_structure",
  "payload": {
    "business_name": "Acme Roofing LLC",
    "business_type": "contractor",
    "user_role": "business_owner",
    "funding_purpose": "equipment",
    "requested_amount": 75000,
    "minimum_useful_amount": 50000,
    "documents_available": [],
    "documents_missing": [],
    "current_file_names": [],
    "revenue_context": [],
    "privacy_constraints": []
  },
  "request_id": "optional-client-generated-id"
}
```

Rules:

- `action` is required.
- `payload` is required and must be an object.
- `request_id` is optional.
- Unknown action names must return a structured `400` error.
- Unknown payload fields may be preserved but must not silently override protected system behavior.
- Do not require every payload field for every action.
- Each action module must validate only the fields it needs.

---

# Shared Success Response

Use this structure:

```json
{
  "ok": true,
  "action": "generate_folder_structure",
  "data": {},
  "warnings": [],
  "human_review_required": true,
  "request_id": "optional-client-generated-id",
  "meta": {
    "version": "1.0.0"
  }
}
```

---

# Shared Error Response

Use this structure:

```json
{
  "ok": false,
  "action": "generate_folder_structure",
  "error": {
    "code": "INVALID_PAYLOAD",
    "message": "A clear human-readable error message.",
    "details": []
  },
  "human_review_required": false,
  "request_id": "optional-client-generated-id",
  "meta": {
    "version": "1.0.0"
  }
}
```

Recommended error codes:

```text
METHOD_NOT_ALLOWED
INVALID_JSON
INVALID_REQUEST
UNKNOWN_ACTION
INVALID_PAYLOAD
PAYLOAD_TOO_LARGE
PRIVACY_RISK
INTERNAL_ERROR
```

---

# Readiness Priority System

Use only:

```text
Blocker
Fix Before Submission
Improve If Time Allows
```

For each readiness gap, return:

- `gap`
- `priority`
- `why_it_matters`
- `next_action`
- `suggested_owner`
- `human_review_required`

Never claim the priority predicts approval.

## Blocker Tone

Use a firm but supportive structure:

```text
BLOCKER — [Issue]

Why it matters:
[Operational reason]

Required next action:
[Specific action]

Owner:
[Responsible party]

Status:
Human confirmation required before submission readiness can be reassessed.
```

Do not use humor around:

- privacy
- identity
- ownership
- suspected manipulation
- fraud
- legal issues
- tax issues
- compliance-sensitive facts

---

# Missing or Conflicting Facts

Use a hybrid rule:

1. If the missing or conflicting fact materially changes identity, ownership, requested amount, use of funds, document requirements, or readiness priority:
   - return one focused question
   - mark the affected output as provisional or held
2. Otherwise:
   - produce a provisional output
   - list assumptions clearly

Use:

```text
Provisional — Assumptions Used
```

For each assumption include:

- assumption
- why it was necessary
- what must be confirmed
- which output may change

Never silently resolve conflicting facts.

---

# Privacy and Security Rules

These public endpoints must be stateless.

Do not:

- store requests
- log raw sensitive payloads
- accept credentials
- accept passwords
- accept API keys
- accept full Social Security numbers
- accept full bank account numbers
- accept unredacted identity documents
- accept binary file uploads
- accept base64 PDFs or images
- return private data not supplied by the caller

Use metadata and summaries only.

Set a conservative JSON request-size limit in `api/actions/public.js`.

Recommended maximum:

```text
128 KB
```

Return `413` with `PAYLOAD_TOO_LARGE` when exceeded.

Support:

- `POST`
- `OPTIONS`

Reject all other methods with `405`.

Include CORS headers suitable for GPT Action calls and local testing. Keep the implementation configurable and avoid a dangerous wildcard policy if a restricted origin can be used later.

---

# Required Files

Generate the following exact files and paths:

```text
openapi/
└── no-auth-actions.openapi.yaml

api/
└── actions/
    └── public.js

lib/
├── actions/
│   └── public/
│       ├── build-data-room-package.js
│       ├── generate-folder-structure.js
│       ├── generate-document-checklist.js
│       ├── generate-file-naming-rules.js
│       ├── create-missing-document-tracker.js
│       ├── generate-deal-snapshot.js
│       ├── generate-privacy-checklist.js
│       ├── rewrite-context-notes.js
│       └── run-readiness-qa-gate.js
├── validation/
│   ├── validate-action-request.js
│   └── validate-public-payload.js
├── responses/
│   ├── success-response.js
│   └── error-response.js
└── constants/
    ├── public-action-names.js
    └── readiness-priorities.js

schemas/
├── public-action-request.schema.json
├── public-action-response.schema.json
├── data-room-package.schema.json
├── missing-document-tracker.schema.json
└── deal-snapshot.schema.json

config/
└── public-actions.registry.json

docs/
├── no-auth-actions.md
├── no-auth-testing.md
└── no-auth-examples.md

examples/
├── public-action-requests.json
└── public-action-responses.json

site/
└── actions/
    └── no-auth-test.html
```

Do not rename files.

Do not create additional serverless-function files.

---

# Required Behavior by File

## `openapi/no-auth-actions.openapi.yaml`

Create an OpenAPI 3.1 document suitable for GPT Builder Actions.

Requirements:

- title: `Funding Data Room Copilot — No-Auth Actions`
- version: `1.0.0`
- one server placeholder using:
  - `https://funding-data-room-copilot.vercel.app`
- path:
  - `/api/actions/public`
- method:
  - `POST`
- operationId:
  - `runPublicAction`
- clear description under 300 characters
- request body referencing `public-action-request.schema.json` where practical
- response definitions for:
  - `200`
  - `400`
  - `405`
  - `413`
  - `500`
- no authentication security scheme
- action enum listing all nine public actions
- examples for at least:
  - folder structure
  - complete package
  - QA gate
- schema descriptions optimized for GPT Action selection
- no unsupported callbacks or webhooks

The document must be copy/paste-ready for GPT Builder after replacing the server domain.

## `api/actions/public.js`

Create the single Vercel function dispatcher.

Responsibilities:

- support `POST` and `OPTIONS`
- reject unsupported methods
- enforce request-size limit
- safely parse JSON
- validate the shared request
- route action names to imported modules
- catch unexpected errors
- return standardized responses
- avoid logging raw payloads
- add CORS and JSON headers
- preserve `request_id`
- expose no secrets
- contain no business logic that belongs in modules

Use a map-based dispatcher rather than a long fragile conditional chain.

## `lib/actions/public/build-data-room-package.js`

This is the primary composite action.

It should orchestrate:

- folder structure
- document checklist
- file naming rules
- missing-document tracker
- deal snapshot
- privacy checklist
- context notes when supplied
- readiness QA gate

Return one structured package with:

```text
package_summary
folder_structure
document_checklist
file_naming_rules
missing_document_tracker
deal_snapshot
privacy_checklist
context_notes
readiness_qa
warnings
next_best_actions
```

Do not duplicate business logic. Import and call the individual action modules.

## `lib/actions/public/generate-folder-structure.js`

Return:

- package name
- copy/paste-ready folder tree
- folder descriptions
- sensitive-folder warnings
- business-type-specific additions
- next actions

Support business types such as:

- contractor
- ecommerce
- restaurant
- agency
- clinic
- local service business
- funding broker
- generic small business

## `lib/actions/public/generate-document-checklist.js`

Return checklist sections for:

- business identity
- ownership and legal
- bank statements
- financial statements
- tax documents
- revenue and cash-flow context
- debt and obligations
- funding request
- privacy review
- broker or processor addendum when relevant

Each checklist item should contain:

- label
- category
- status
- why_it_matters
- commonly_requested
- human_review_required

Clarify that requirements vary.

## `lib/actions/public/generate-file-naming-rules.js`

Use:

```text
YYYY-MM_Provider_DocumentType_BusinessName.ext
```

Return:

- naming formula
- category examples
- original-to-suggested mappings when file names are provided
- warnings for signed, legal, tax, or provider-generated files
- privacy rules
- version-control rules

Never include sensitive identifiers.

## `lib/actions/public/create-missing-document-tracker.js`

Return rows containing:

- document
- category
- status
- priority
- owner
- due_date
- why_it_matters
- next_action
- human_review_required
- notes

Supported statuses:

```text
Not Requested
Requested
Partially Received
Received
Outdated
Incomplete
Needs Explanation
Conflicting
Ready for Human Review
Not Applicable
```

## `lib/actions/public/generate-deal-snapshot.js`

Return the standard deal snapshot with:

- business identity
- requested amount
- minimum useful amount
- use of funds
- revenue context
- documents received
- documents missing
- existing debt
- bank-statement notes
- positive factors
- potential concerns
- readiness gaps
- provisional assumptions
- recommended next step
- QA classification
- human review requirement

Allowed QA classifications:

```text
Ready for Human Review
Hold — Blocker Present
Provisional — Confirmation Needed
```

Never use “approved.”

## `lib/actions/public/generate-privacy-checklist.js`

Return:

- privacy warnings
- redaction checklist
- prohibited input list
- storage and sharing reminders
- privacy Blockers
- human-review requirements

If the payload indicates credentials, full identity numbers, or mixed-client data, return a privacy Blocker.

## `lib/actions/public/rewrite-context-notes.js`

Transform rough context into structured factual notes.

Return:

- event
- period
- amount
- plain-English explanation
- source_of_information
- supporting_document_suggestions
- likely_reviewer_questions
- open_facts_to_confirm
- priority
- human_review_warning

Do not:

- exaggerate
- conceal negative information
- invent facts
- predict approval
- classify tax or accounting treatment

## `lib/actions/public/run-readiness-qa-gate.js`

Review:

- identity consistency
- ownership consistency
- statement completeness
- financial freshness
- debt disclosure
- use-of-funds clarity
- revenue context
- missing documents
- privacy
- file naming
- folder structure
- deal snapshot
- broker or processor handoff

Return:

- classification
- Blockers
- Fix Before Submission items
- Improve If Time Allows items
- provisional assumptions
- next action
- owner
- human review requirement

## Validation Files

### `lib/validation/validate-action-request.js`

Validate:

- top-level request shape
- supported action
- payload object
- request ID type
- prohibited obvious secret fields

Return a structured result rather than throwing for expected validation failures.

### `lib/validation/validate-public-payload.js`

Perform action-aware validation.

Examples:

- folder structure needs a business name or safe placeholder
- file renaming needs `current_file_names`
- context notes need at least one context event
- QA gate needs some package or document status data

Validation should remain flexible enough for provisional outputs.

## Response Helpers

### `lib/responses/success-response.js`

Create standardized success responses.

### `lib/responses/error-response.js`

Create standardized error responses and map known errors to HTTP status codes.

Do not leak stack traces.

## Constants

### `lib/constants/public-action-names.js`

Export:

- individual constants
- an immutable action list
- an action membership helper

### `lib/constants/readiness-priorities.js`

Export:

- `BLOCKER`
- `FIX_BEFORE_SUBMISSION`
- `IMPROVE_IF_TIME_ALLOWS`
- immutable priority list
- optional descriptions

## JSON Schemas

All JSON schemas must:

- use JSON Schema 2020-12
- include `$schema`
- include `$id`
- include title and description
- disallow dangerous unexpected top-level fields where appropriate
- remain compatible with the actual JS implementation
- include examples

### `schemas/public-action-request.schema.json`

Define the shared dispatcher request.

### `schemas/public-action-response.schema.json`

Support both success and error responses using `oneOf`.

### `schemas/data-room-package.schema.json`

Define the composite package returned by `build_data_room_package`.

### `schemas/missing-document-tracker.schema.json`

Define tracker rows and priority/status enums.

### `schemas/deal-snapshot.schema.json`

Define the deal snapshot and allowed QA classifications.

## `config/public-actions.registry.json`

Create a machine-readable action registry.

Each action record must include:

- `action`
- `label`
- `description`
- `module`
- `public`
- `requires_auth`
- `stores_data`
- `human_review_required`
- `input_summary`
- `output_summary`
- `version`

Set:

```json
{
  "public": true,
  "requires_auth": false,
  "stores_data": false
}
```

for all actions.

## Documentation Files

### `docs/no-auth-actions.md`

Cover:

- architecture
- why one dispatcher is used
- action catalog
- request and response contracts
- privacy model
- deployment notes
- GPT Builder setup
- limitations

### `docs/no-auth-testing.md`

Cover:

- local testing
- Vercel testing
- curl commands
- browser test page
- expected status codes
- negative test cases
- privacy test cases
- regression checklist

Do not assume a framework-specific local server.

### `docs/no-auth-examples.md`

Include copy/paste examples for every action.

## Example JSON Files

### `examples/public-action-requests.json`

Include valid request examples for all nine actions and at least three invalid requests.

### `examples/public-action-responses.json`

Include:

- successful examples
- Blocker example
- provisional example
- unknown-action error
- invalid-payload error
- privacy-risk error
- payload-too-large error

The file itself must remain valid JSON.

## `site/actions/no-auth-test.html`

Create a polished static test console using plain HTML, CSS, and JavaScript in one file.

Requirements:

- no framework
- no external CDN dependencies
- editable endpoint URL
- action dropdown
- JSON payload editor
- request ID input
- send button
- clear button
- load-example button
- response status
- formatted JSON output
- copy-response button
- visible privacy warning
- mobile responsive
- dark fintech operator aesthetic
- do not expose secrets
- use `fetch()` to call `/api/actions/public`

The test page is static and must not create another serverless function.

---

# Batch Production Plan

Generate the files in the following batches.

After each batch:

1. Save every file to `/mnt/data/` using the exact repository-relative folder structure.
2. Create a ZIP for that batch.
3. Provide a direct download link for each generated file.
4. Provide a download link for the batch ZIP.
5. Provide the batch file tree.
6. Validate syntax and consistency.
7. Stop and wait for explicit approval before continuing to the next batch.

Do not ask for approval before completing Batch 1.

## Batch 1 — Contracts and Shared Infrastructure

Create:

```text
openapi/no-auth-actions.openapi.yaml
lib/constants/public-action-names.js
lib/constants/readiness-priorities.js
lib/responses/success-response.js
lib/responses/error-response.js
lib/validation/validate-action-request.js
lib/validation/validate-public-payload.js
schemas/public-action-request.schema.json
schemas/public-action-response.schema.json
config/public-actions.registry.json
```

ZIP:

```text
funding-data-room-copilot-no-auth-batch-1.zip
```

## Batch 2 — Core Individual Actions

Create:

```text
lib/actions/public/generate-folder-structure.js
lib/actions/public/generate-document-checklist.js
lib/actions/public/generate-file-naming-rules.js
lib/actions/public/create-missing-document-tracker.js
lib/actions/public/generate-deal-snapshot.js
```

Also create:

```text
schemas/missing-document-tracker.schema.json
schemas/deal-snapshot.schema.json
```

ZIP:

```text
funding-data-room-copilot-no-auth-batch-2.zip
```

## Batch 3 — Privacy, Context, QA, and Composite Package

Create:

```text
lib/actions/public/generate-privacy-checklist.js
lib/actions/public/rewrite-context-notes.js
lib/actions/public/run-readiness-qa-gate.js
lib/actions/public/build-data-room-package.js
schemas/data-room-package.schema.json
```

ZIP:

```text
funding-data-room-copilot-no-auth-batch-3.zip
```

## Batch 4 — Vercel Dispatcher and Test Assets

Create:

```text
api/actions/public.js
examples/public-action-requests.json
examples/public-action-responses.json
site/actions/no-auth-test.html
```

ZIP:

```text
funding-data-room-copilot-no-auth-batch-4.zip
```

## Batch 5 — Documentation and Complete Package

Create:

```text
docs/no-auth-actions.md
docs/no-auth-testing.md
docs/no-auth-examples.md
```

Then validate the entire package and create:

```text
funding-data-room-copilot-no-auth-actions-complete.zip
```

The final ZIP must preserve the exact folder tree.

---

# Validation Requirements

Before marking a batch complete:

## JavaScript Validation

- confirm balanced braces and valid syntax
- confirm all import paths resolve within the requested file tree
- confirm named exports and imports match
- confirm no undeclared external package is required
- confirm browser-only APIs are not used in server modules
- confirm Node-only APIs are not used in static HTML

## JSON Validation

- parse every JSON file
- confirm no comments
- confirm examples files remain valid JSON
- confirm enums match JS constants

## YAML and OpenAPI Validation

- confirm valid YAML indentation
- confirm OpenAPI version is present
- confirm path and operationId are correct
- confirm request and response contracts match implementation
- confirm no authentication requirement is declared

## Security Validation

- no secret values
- no credentials
- no raw document storage
- no binary upload handling
- no stack traces in responses
- no logging of complete payloads
- privacy Blocker behavior present

## Architecture Validation

- exactly one serverless-function file:
  - `api/actions/public.js`
- all action modules imported by the dispatcher
- no duplicate business logic in the dispatcher
- composite action reuses individual action modules
- static HTML creates no server function

---

# Required Output After Each Batch

Use:

## Batch [Number] Completed

### Individual Downloads

Provide one direct link per file.

### Batch ZIP

Provide the ZIP download link.

### File Tree

Show the generated tree.

### Validation Report

State:

- files created
- JS syntax status
- JSON status
- YAML/OpenAPI status when applicable
- import resolution status
- security checks
- unresolved issues

Then stop and wait for the user to approve the next batch.

---

# Final Completion Report

After Batch 5, provide:

- total file count
- exact serverless-function count
- complete ZIP link
- full file tree
- validation results
- known limitations
- deployment notes
- exact OpenAPI server URL placeholder that must be replaced
- recommended first test request

The final report must explicitly confirm:

> This implementation uses one Vercel Serverless Function for all no-auth actions.

Begin with **Batch 1** now.
