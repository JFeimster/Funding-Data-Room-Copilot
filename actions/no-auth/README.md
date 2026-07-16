# Funding Data Room Copilot — No-Auth Actions

This package implements nine stateless public actions through one Vercel Serverless Function.

## Function

```text
api/actions/public.js
```

## OpenAPI

```text
actions/no-auth/openapi/no-auth-actions.openapi.yaml
```

Replace `https://funding-data-room-copilot.vercel.app` with the production Vercel domain before adding the schema to GPT Builder.

## Test Console

```text
site/tools/no-auth-test.html
```

## Architecture

- `api/` — Vercel function entry point
- `actions/no-auth/` — modules, schemas, registry, examples, OpenAPI, and docs
- `actions/shared/` — shared priorities, responses, and request validation
- `site/tools/` — static browser test console

## Guardrails

The actions organize funding files and identify readiness gaps. They do not determine eligibility, predict approval, or replace human underwriting, legal, tax, accounting, lending, or compliance judgment.
