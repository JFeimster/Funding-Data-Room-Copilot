# Funding Data Room Copilot — No-Auth Actions

## Overview

The no-auth stack exposes nine stateless tools through one Vercel Serverless Function:

```text
POST /api/actions/public
```

Each request selects an action by name and supplies an action-specific `payload` object.

The stack organizes funding files, identifies readiness gaps, and prepares human-reviewed outputs. It does not determine eligibility, predict approval, replace underwriting, or provide legal, tax, accounting, compliance, or lending advice.

## Architecture

```text
api/actions/public.js
        │
        ├── validates the request
        ├── enforces the 128 KB JSON limit
        ├── routes by action name
        └── returns a standardized response
                │
                ▼
actions/no-auth/modules/
```

The dispatcher owns transport and routing only. Business behavior belongs in imported modules.

## Why One Dispatcher

One public dispatcher helps the project:

- preserve a limited Vercel function budget
- centralize CORS, methods, request limits, and error formatting
- reuse shared validation and response contracts
- add public actions without adding function entry points
- maintain one authentication boundary for all no-auth actions

## Action Catalog

| Action | Purpose |
|---|---|
| `build_data_room_package` | Builds the complete folder, checklist, tracker, snapshot, privacy, context, and QA package |
| `generate_folder_structure` | Creates a business-type-aware data room folder tree |
| `generate_document_checklist` | Creates a categorized funding-document checklist |
| `generate_file_naming_rules` | Suggests standardized working-copy file names |
| `create_missing_document_tracker` | Creates an operational missing-document tracker |
| `generate_deal_snapshot` | Creates a factual one-page deal snapshot |
| `generate_privacy_checklist` | Identifies privacy, redaction, and sharing risks |
| `rewrite_context_notes` | Rewrites rough revenue or cash-flow notes into factual context |
| `run_readiness_qa_gate` | Classifies organizational readiness for human review |

## Shared Request Contract

```json
{
  "action": "generate_folder_structure",
  "payload": {
    "business_name": "Acme Roofing LLC",
    "business_type": "contractor",
    "user_role": "business_owner",
    "funding_purpose": "equipment"
  },
  "request_id": "optional-client-generated-id"
}
```

Required:

- `action`
- `payload`

Optional:

- `request_id`

The service echoes `request_id` in the response.

## Shared Success Response

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

## Shared Error Response

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

## Error Codes

| Code | Status | Meaning |
|---|---:|---|
| `METHOD_NOT_ALLOWED` | 405 | Unsupported HTTP method |
| `INVALID_JSON` | 400 | Body cannot be parsed as JSON |
| `INVALID_REQUEST` | 400 | Shared request contract failed |
| `UNKNOWN_ACTION` | 400 | Action name is unsupported |
| `INVALID_PAYLOAD` | 400 | Action-specific payload validation failed |
| `PAYLOAD_TOO_LARGE` | 413 | JSON exceeds 128 KB |
| `PRIVACY_RISK` | 400 | Prohibited credential or sensitive field detected |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Readiness Priorities

Use only:

- `Blocker`
- `Fix Before Submission`
- `Improve If Time Allows`

These are operational priorities. They do not predict approval or represent a provider decision.

## Allowed QA Classifications

- `Ready for Human Review`
- `Hold — Blocker Present`
- `Provisional — Confirmation Needed`

The stack never classifies a file as approved for funding.

## Privacy Model

The endpoint is stateless. It does not:

- persist requests
- accept binary uploads
- accept base64 documents
- accept passwords or credentials
- accept API keys or access tokens
- accept full Social Security numbers
- accept full bank account numbers
- call an external AI provider
- make a lending or underwriting decision

Use document metadata and factual summaries only.

## Request Size

Maximum JSON request size:

```text
128 KB
```

Upload large files directly to an approved storage workflow. Send only metadata, summaries, or restricted references to the action.

## CORS

The dispatcher supports `POST` and `OPTIONS`.

Set this environment variable in production:

```text
ALLOWED_ORIGIN=https://your-production-domain.example
```

When it is blank, the dispatcher falls back to `*` for initial testing. Restrict it before exposing a browser-based production console.

## Deployment

The root `package.json` includes:

```json
{
  "type": "module"
}
```

Deploy the repository root to Vercel. The endpoint becomes:

```text
https://funding-data-room-copilot.vercel.app/api/actions/public
```

## GPT Builder Setup

1. Deploy the project.
2. Open `actions/no-auth/openapi/no-auth-actions.openapi.yaml`.
3. Replace `https://funding-data-room-copilot.vercel.app` with the production domain.
4. Add the OpenAPI document to the GPT Action configuration.
5. Select no authentication.
6. Test `generate_folder_structure`.
7. Test an invalid action and a privacy-risk request.
8. Confirm the GPT states that human review remains required.

## Static Test Console

The static console is located at:

```text
site/tools/no-auth-test.html
```

It calls `/api/actions/public` and does not consume another function slot.

## Limitations

- Output quality depends on supplied metadata.
- The actions do not verify source-document authenticity.
- They do not calculate approval probability.
- They do not determine eligibility.
- They do not replace qualified human judgment.
- A human must confirm material facts and clear every Blocker.
