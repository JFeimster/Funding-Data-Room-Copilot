# No-Auth Action Examples

## Endpoint

```text
POST /api/actions/public
```

## Build Data Room Package

```json
{
  "action": "build_data_room_package",
  "payload": {
    "business_name": "Northstar Goods Inc",
    "business_type": "ecommerce",
    "user_role": "business_owner",
    "funding_purpose": "Inventory and payout timing",
    "requested_amount": 75000,
    "minimum_useful_amount": 50000,
    "documents_available": [
      "June business bank statement",
      "Shopify sales report",
      "Stripe payout report"
    ],
    "documents_missing": [
      {
        "document": "Current debt schedule",
        "category": "Debt and Obligations",
        "status": "Requested"
      }
    ],
    "current_file_names": ["June Statement.pdf"]
  },
  "request_id": "example-package-001"
}
```

## Generate Folder Structure

```json
{
  "action": "generate_folder_structure",
  "payload": {
    "business_name": "Ridgeway Electric LLC",
    "business_type": "contractor",
    "user_role": "business_owner",
    "funding_purpose": "Equipment"
  },
  "request_id": "example-folders-001"
}
```

## Generate Document Checklist

```json
{
  "action": "generate_document_checklist",
  "payload": {
    "business_name": "Harbor Table LLC",
    "business_type": "restaurant",
    "user_role": "processor",
    "documents_available": ["Formation document", "March bank statement"],
    "documents_missing": ["Current P&L", "Debt schedule"]
  },
  "request_id": "example-checklist-001"
}
```

## Generate File Naming Rules

```json
{
  "action": "generate_file_naming_rules",
  "payload": {
    "business_name": "Acme Roofing LLC",
    "current_file_names": [
      "download (7).pdf",
      "June Chase Statement.pdf",
      "2025 tax return signed.pdf"
    ]
  },
  "request_id": "example-names-001"
}
```

## Create Missing Document Tracker

```json
{
  "action": "create_missing_document_tracker",
  "payload": {
    "business_name": "Signal House Agency",
    "user_role": "broker",
    "documents_available": ["Formation document"],
    "documents_missing": [
      {
        "document": "May bank statement",
        "category": "Bank Statements",
        "status": "Incomplete",
        "notes": "Two pages are missing."
      },
      {
        "document": "Current AR aging",
        "category": "Financial Statements",
        "status": "Outdated"
      }
    ]
  },
  "request_id": "example-tracker-001"
}
```

## Generate Deal Snapshot

```json
{
  "action": "generate_deal_snapshot",
  "payload": {
    "business_name": "Ridgeway Electric LLC",
    "legal_entity": "Virginia LLC",
    "industry": "Electrical contractor",
    "location": "Richmond, Virginia",
    "time_in_business": "4 years",
    "owner_name": "Morgan Reed",
    "requested_amount": 80000,
    "minimum_useful_amount": 55000,
    "funding_purpose": "Equipment, supplier deposits, and payroll timing",
    "documents_available": ["YTD P&L", "Equipment quote"],
    "documents_missing": ["May bank statement"]
  },
  "request_id": "example-snapshot-001"
}
```

## Generate Privacy Checklist

```json
{
  "action": "generate_privacy_checklist",
  "payload": {
    "business_name": "Willow Creek Clinic",
    "privacy_constraints": [
      "The receivables report includes patient names.",
      "The folder is shared with anyone who has the link."
    ]
  },
  "request_id": "example-privacy-001"
}
```

## Rewrite Context Notes

```json
{
  "action": "rewrite_context_notes",
  "payload": {
    "business_name": "Northstar Goods Inc",
    "revenue_context": [
      {
        "event_type": "inventory_purchase",
        "period": "June 2026",
        "amount": 32000,
        "explanation": "Supplier deposit for seasonal inventory.",
        "source": "User-reported information",
        "supporting_documents": ["Purchase order", "Supplier invoice"]
      }
    ]
  },
  "request_id": "example-context-001"
}
```

## Run Readiness QA Gate

```json
{
  "action": "run_readiness_qa_gate",
  "payload": {
    "business_name": "Ridgeway Electric LLC",
    "documents_available": [
      "February bank statement",
      "March bank statement"
    ],
    "documents_missing": ["April bank statement"],
    "readiness_gaps": [
      {
        "gap": "April bank statement is missing.",
        "priority": "Blocker",
        "why_it_matters": "The designated review period is incomplete.",
        "next_action": "Obtain the complete April statement.",
        "suggested_owner": "Business owner",
        "human_review_required": true
      }
    ]
  },
  "request_id": "example-qa-001"
}
```

## Unknown Action Error

```json
{
  "action": "predict_approval",
  "payload": {},
  "request_id": "invalid-action-001"
}
```

Expected code:

```text
UNKNOWN_ACTION
```

## Privacy Risk Error

Use test-only data. Never use a real credential.

```json
{
  "action": "generate_privacy_checklist",
  "payload": {
    "bank_password": "TEST-ONLY-NOT-REAL"
  },
  "request_id": "invalid-privacy-001"
}
```

Expected code:

```text
PRIVACY_RISK
```
