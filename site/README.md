# Funding Data Room Copilot — Neo-Brutalist Static Site

A framework-free launch site and interactive tool suite for Funding Data Room Copilot.

## Included

- Full neo-brutalist homepage
- Eight information pages
- Five action tools
- Four source data catalogs plus a validation report
- Shared component fragments
- Local SVG favicon, app mark, and social image
- No external scripts, fonts, or UI frameworks
- No additional Vercel function files

## Repository Placement

Copy `site/` and `assets/` into the root of:

```text
JFeimster/Funding-Data-Room-Copilot
```

The build intentionally does not modify:

```text
api/actions/public.js
actions/no-auth/modules/
actions/no-auth/schemas/
actions/no-auth/openapi/
```

## Funding Data Room Copilot CTA

Edit the configuration object near the top of:

```text
site/script.js
```

Replace:

```text
https://chatgpt.com/g/g-6a580c6ec5648191a2d27f4528015f3f-funding-data-room-copilot
```

with the Funding Data Room Copilot Custom GPT URL.

The previously supplied Agent Launch Site Builder URL is the site-building GPT, not the product CTA, so it is not used as the Funding Data Room Copilot launch destination.

## Production Domain

Replace every occurrence of:

```text
https://funding-data-room-copilot.vercel.app
```

after the controlled Vercel production deployment.

This updates canonical URLs, Open Graph URLs, social-image URLs, and JSON-LD page URLs.

## Local Static Preview

From the package root:

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/site/
```

Core marketing content works without JavaScript.

## Live Action Testing

A plain Python server does not run Vercel functions.

For live `/api/actions/public` requests:

1. place the site inside the full repository
2. repair and verify the no-auth dispatcher imports
3. run Vercel locally or use a controlled deployment
4. open `/site/tools/no-auth-test.html`

All tools call:

```text
POST /api/actions/public
```

No new serverless functions are created.

## Privacy Limitations

Do not enter passwords, bank logins, API keys, access tokens, full identity numbers, full bank account numbers, security answers, raw binary documents, or base64 content.

Use safe fictional test data, redacted metadata, document names, statement periods, factual summaries, and restricted storage references.

## Screenshot Checklist

Capture after deployment:

- desktop hero
- mobile hero and menu
- action command center
- business-type selector
- privacy section
- package builder input and output
- tracker table
- readiness QA classification
- downloads page
- final social preview

## QA Status

- [x] Plain HTML, CSS, and vanilla JavaScript
- [x] No external font or script CDN
- [x] Responsive layouts
- [x] Accessible focus states and skip link
- [x] Reduced-motion support
- [x] Unique page titles and descriptions
- [x] Local SVG assets
- [x] Nine actions represented
- [x] Metadata-only tool language
- [x] `/api/actions/public` preserved
- [x] No additional serverless function
- [x] No fake testimonials or ratings
- [x] Planned downloads clearly labeled
- [x] Configure the Custom GPT URL
- [x] Configure the Vercel production domain
- [ ] Verify the repaired dispatcher before live tool testing
- [ ] Capture production screenshots
