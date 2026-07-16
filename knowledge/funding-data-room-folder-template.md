# Funding Data Room Folder Templates

## Master Folder Structure

Use numbered folders so the package stays in a predictable order.

```text
Funding Data Room - [Business Name]/
├── 00_Read_Me_and_Status/
├── 01_Business_Identity/
├── 02_Ownership_and_Legal/
├── 03_Bank_Statements/
├── 04_Financial_Statements/
├── 05_Tax_Documents/
├── 06_Revenue_and_Cash_Flow_Context/
├── 07_Debt_and_Obligations/
├── 08_Funding_Request/
├── 09_Missing_Document_Tracker/
├── 10_Deal_Snapshot/
├── 11_Broker_Processor_Handoff/
└── 12_Final_Human_Review_Packet/
```

`00_Read_Me_and_Status` should contain:

- package purpose
- current stage
- file owner
- last updated date
- Blockers
- next action
- privacy warning
- human review status

## Google Drive Version

```text
Funding Data Room - [Business Name]/
├── 00_Read_Me_and_Status/
│   ├── Data_Room_Status.md
│   └── Privacy_and_Sharing_Notes.md
├── 01_Business_Identity/
├── 02_Ownership_and_Legal/
│   └── Restricted_Owner_ID/
├── 03_Bank_Statements/
│   ├── 2026-01/
│   ├── 2026-02/
│   └── 2026-03/
├── 04_Financial_Statements/
│   ├── Profit_and_Loss/
│   ├── Balance_Sheet/
│   ├── Accounts_Receivable/
│   └── Accounts_Payable/
├── 05_Tax_Documents/
├── 06_Revenue_and_Cash_Flow_Context/
├── 07_Debt_and_Obligations/
├── 08_Funding_Request/
├── 09_Missing_Document_Tracker/
├── 10_Deal_Snapshot/
├── 11_Broker_Processor_Handoff/
└── 12_Final_Human_Review_Packet/
```

Review Drive sharing permissions before placing sensitive records in the folder. Do not assume a link is private merely because it is difficult to guess.

## Dropbox Version

Use the same numbered structure. Add an `_Archive` folder inside each section only when version history is not enough for the workflow.

```text
03_Bank_Statements/
├── Current/
└── _Archive/
```

Avoid creating multiple public share links. Use the narrowest practical sharing scope.

## OneDrive Version

Use a top-level restricted folder and create a separate collaboration folder for non-sensitive trackers.

```text
Funding Data Room - [Business Name]/
├── Restricted_Documents/
│   ├── Ownership_and_ID/
│   ├── Bank_Statements/
│   └── Tax_Documents/
└── Working_Package/
    ├── Status/
    ├── Missing_Document_Tracker/
    ├── Context_Notes/
    └── Deal_Snapshot/
```

## Broker Multi-Client Version

```text
Funding Data Rooms/
├── Active/
│   └── [Client ID] - [Business Name]/
│       ├── 00_Status/
│       ├── 01_Client_Provided/
│       ├── 02_Internal_Review/
│       ├── 03_Context_Notes/
│       ├── 04_Handoff_Packet/
│       └── 05_Questions_and_Responses/
├── On_Hold/
├── Closed/
└── Archive/
```

Use a client ID when businesses have similar names. Do not place multiple clients’ sensitive records in the same working folder.

## Business-Owner Version

```text
My Funding Data Room/
├── Start_Here/
├── Business_Documents/
├── Bank_Statements/
├── Financial_Reports/
├── Tax_Documents/
├── Debt_Information/
├── Funding_Request/
├── Explanations_and_Context/
├── Missing_Items/
└── Final_Review/
```

This version uses plain-English labels. The broker version may use more operational stages.

## Naming and Numbering Rules

- Use two-digit numeric prefixes.
- Keep one category per folder.
- Use consistent business names.
- Avoid punctuation that may break sync or export workflows.
- Use `YYYY-MM` for monthly documents.
- Use `YYYY` for annual documents.
- Avoid names such as `misc`, `stuff`, `new`, or `final-final`.
- Do not place sensitive IDs in file names.

## Archive and Version-Control Rules

Use:

```text
DocumentName_v01.ext
DocumentName_v02.ext
DocumentName_FINAL-HUMAN-REVIEWED.ext
```

Do not overwrite a source document with an AI-edited version. Context notes and summaries should be separate files.

Recommended archive rule:

- current working version stays in the main folder
- previous versions move to `_Archive`
- final packet contains copies or links approved by a human
- archive date appears in the file name or folder note

## Sensitive Document Folder Rules

Create a restricted folder for:

- government IDs
- tax documents
- ownership records containing personal data
- bank statements with unredacted identifiers
- payroll or customer information

Rules:

- minimize access
- review sharing permissions
- avoid public links
- do not place passwords or credentials in the folder
- use redacted working copies when practical
- require human review before external sharing

## Ecommerce Seller Example

```text
Funding Data Room - Northstar Goods/
├── 01_Business_Identity/
├── 02_Ownership_and_Legal/
├── 03_Bank_Statements/
├── 04_Financial_Statements/
├── 05_Platform_Payouts/
│   ├── Shopify/
│   ├── Amazon/
│   └── Stripe/
├── 06_Inventory_and_Purchase_Orders/
├── 07_Ad_Spend_and_Cash_Flow_Context/
├── 08_Debt_and_Obligations/
├── 09_Funding_Request/
├── 10_Missing_Document_Tracker/
└── 11_Final_Human_Review_Packet/
```

## Contractor Example

```text
Funding Data Room - Ridgeway Electric/
├── 01_Business_Identity/
├── 02_Licenses_and_Insurance/
├── 03_Bank_Statements/
├── 04_Financial_Statements/
├── 05_Contracts_and_Backlog/
├── 06_Accounts_Receivable/
├── 07_Equipment_Quotes/
├── 08_Debt_and_Obligations/
├── 09_Funding_Request/
└── 10_Final_Human_Review_Packet/
```

## Agency Example

```text
Funding Data Room - Signal House Agency/
├── 01_Business_Identity/
├── 02_Client_Contracts/
├── 03_Bank_Statements/
├── 04_Financial_Statements/
├── 05_Accounts_Receivable/
├── 06_Client_Concentration_Context/
├── 07_Payroll_and_Contractor_Costs/
├── 08_Funding_Request/
└── 09_Final_Human_Review_Packet/
```

## Restaurant Example

```text
Funding Data Room - Harbor Table/
├── 01_Business_Identity/
├── 02_Licenses_and_Lease/
├── 03_Bank_Statements/
├── 04_Financial_Statements/
├── 05_Merchant_Processing/
├── 06_Payroll_and_Food_Costs/
├── 07_Seasonality_Context/
├── 08_Equipment_or_Repair_Quotes/
├── 09_Funding_Request/
└── 10_Final_Human_Review_Packet/
```

## Clinic Example

```text
Funding Data Room - Willow Creek Clinic/
├── 01_Business_Identity/
├── 02_Licenses_and_Ownership/
├── 03_Bank_Statements/
├── 04_Financial_Statements/
├── 05_Insurance_Receivables/
├── 06_Payroll_and_Operating_Costs/
├── 07_Reimbursement_Delay_Context/
├── 08_Debt_and_Obligations/
├── 09_Funding_Request/
└── 10_Final_Human_Review_Packet/
```

## Funding Broker Example

```text
Client Data Room - [Client ID] - [Business Name]/
├── 00_Deal_Status/
├── 01_Original_Client_Files/
├── 02_Validated_Identity_and_Ownership/
├── 03_Financial_Documents/
├── 04_Missing_Document_Tracker/
├── 05_Context_Notes/
├── 06_Deal_Snapshot/
├── 07_Internal_QA/
├── 08_Partner_Handoff/
└── 09_Questions_and_Responses/
```

> Folder organization can support a cleaner review process, but it does not determine funding eligibility or approval.
