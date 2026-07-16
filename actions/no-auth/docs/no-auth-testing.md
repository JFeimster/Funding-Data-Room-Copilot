# No-Auth Actions Testing Guide

## Testing Objectives

Confirm that:

- every action routes through one dispatcher
- valid requests return `200`
- invalid requests return structured errors
- privacy-risk inputs are rejected
- oversized requests return `413`
- unsupported methods return `405`
- imports resolve after deployment
- outputs never claim approval or eligibility
- the static test console creates no additional function

## Local Prerequisites

Confirm Node.js is installed:

```powershell
node --version
```

The root `package.json` must contain:

```json
{
  "type": "module"
}
```

## Local Vercel Testing

From the repository root:

```powershell
vercel dev
```

Then test:

```text
http://localhost:3000/api/actions/public
```

## PowerShell: Folder Structure

```powershell
$Body = @{
    action = "generate_folder_structure"
    payload = @{
        business_name = "Ridgeway Electric LLC"
        business_type = "contractor"
        user_role = "business_owner"
        funding_purpose = "equipment"
    }
    request_id = "powershell-folder-001"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
    -Uri "http://localhost:3000/api/actions/public" `
    -Method Post `
    -ContentType "application/json" `
    -Body $Body
```

Expected:

- HTTP `200`
- `ok: true`
- action echoed
- folder tree present
- human review required

## PowerShell: Complete Package

```powershell
$Body = @{
    action = "build_data_room_package"
    payload = @{
        business_name = "Northstar Goods Inc"
        business_type = "ecommerce"
        user_role = "business_owner"
        funding_purpose = "Inventory and payout timing"
        requested_amount = 75000
        minimum_useful_amount = 50000
        documents_available = @(
            "June business bank statement",
            "Shopify sales report",
            "Stripe payout report"
        )
        documents_missing = @(
            @{
                document = "Current debt schedule"
                category = "Debt and Obligations"
                status = "Requested"
            }
        )
        current_file_names = @("June Statement.pdf")
    }
    request_id = "powershell-package-001"
} | ConvertTo-Json -Depth 20

Invoke-RestMethod `
    -Uri "http://localhost:3000/api/actions/public" `
    -Method Post `
    -ContentType "application/json" `
    -Body $Body
```

## Expected Status Codes

| Test | Status |
|---|---:|
| Valid action | 200 |
| Unknown action | 400 |
| Invalid request shape | 400 |
| Invalid action payload | 400 |
| Credential or secret field | 400 |
| Unsupported method | 405 |
| Oversized request | 413 |
| Unexpected server error | 500 |

## Negative Test: Unknown Action

```json
{
  "action": "predict_approval",
  "payload": {},
  "request_id": "negative-action-001"
}
```

Expected code:

```text
UNKNOWN_ACTION
```

## Negative Test: Missing Payload

```json
{
  "action": "generate_folder_structure",
  "request_id": "negative-payload-001"
}
```

Expected code:

```text
INVALID_REQUEST
```

## Negative Test: Missing Context Event

```json
{
  "action": "rewrite_context_notes",
  "payload": {
    "revenue_context": []
  },
  "request_id": "negative-context-001"
}
```

Expected code:

```text
INVALID_PAYLOAD
```

## Privacy Test: Credential Field

Use test-only data, never a real credential.

```json
{
  "action": "generate_privacy_checklist",
  "payload": {
    "bank_password": "TEST-ONLY-NOT-REAL"
  },
  "request_id": "privacy-test-001"
}
```

Expected:

- HTTP `400`
- `PRIVACY_RISK`
- credential not echoed in the response
- human review required

## Privacy Test: Mixed Client Records

```json
{
  "action": "generate_privacy_checklist",
  "payload": {
    "privacy_constraints": [
      "The spreadsheet contains records for multiple unrelated clients."
    ]
  },
  "request_id": "privacy-test-002"
}
```

Expected:

- action executes
- privacy Blocker appears
- `stop_processing: true`

## Oversized Request Test

```powershell
$Body = @{
    action = "generate_folder_structure"
    payload = @{
        notes = ("x" * 140000)
    }
} | ConvertTo-Json -Depth 5

try {
    Invoke-RestMethod `
        -Uri "http://localhost:3000/api/actions/public" `
        -Method Post `
        -ContentType "application/json" `
        -Body $Body
}
catch {
    $_.ErrorDetails.Message
}
```

Expected code:

```text
PAYLOAD_TOO_LARGE
```

## Unsupported Method Test

```powershell
Invoke-WebRequest `
    -Uri "http://localhost:3000/api/actions/public" `
    -Method Get
```

Expected:

- HTTP `405`
- `Allow: POST, OPTIONS`

## Browser Console Test

Open `site/tools/no-auth-test.html` and confirm:

- endpoint is editable
- all nine actions appear
- example payloads load
- JSON formatting works
- byte counter updates
- oversized requests disable the send button
- response JSON is formatted
- copy-response works
- privacy warning is visible

## Regression Checklist

- [ ] Exactly one no-auth function exists
- [ ] Action constants match the OpenAPI enum
- [ ] Registry action names match the constants
- [ ] Dispatcher map includes all nine actions
- [ ] Every import resolves
- [ ] Every JSON file parses
- [ ] OpenAPI path is `/api/actions/public`
- [ ] OpenAPI operation ID is `runPublicAction`
- [ ] No authentication scheme is declared
- [ ] `POST` works
- [ ] `OPTIONS` works
- [ ] `GET` returns `405`
- [ ] Oversized JSON returns `413`
- [ ] Credential fields return `PRIVACY_RISK`
- [ ] No raw payload is logged
- [ ] No stack trace is returned
- [ ] No output claims approval or eligibility
- [ ] Composite action reuses individual modules
- [ ] Static HTML creates no function
