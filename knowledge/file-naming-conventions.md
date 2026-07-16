# Funding Data Room File Naming Conventions

## Naming Philosophy

A good file name should answer four questions without opening the file:

1. What period does it cover?
2. Who issued or prepared it?
3. What type of document is it?
4. Which business does it belong to?

Use consistency over cleverness. The goal is fast review, clean sorting, and fewer duplicate files.

## Master Naming Formula

```text
YYYY-MM_Provider_DocumentType_BusinessName.ext
```

Use an annual format when the document covers a year:

```text
YYYY_Provider_DocumentType_BusinessName.ext
```

Use a date-specific format when necessary:

```text
YYYY-MM-DD_Provider_DocumentType_BusinessName.ext
```

## Date Formatting

Use:

- `YYYY-MM` for monthly statements
- `YYYY-Q1` through `YYYY-Q4` for quarterly reports
- `YYYY` for annual returns
- `YYYY-MM-DD` for a specific signed or generated date

Avoid:

- `JuneStatement`
- `6-26`
- `newest`
- `last_month`

## Business Name Formatting

Use the legal name or an approved short form consistently.

Good:

```text
AcmeRoofingLLC
NorthstarGoodsInc
HarborTable
```

Avoid:

```text
Acme
Acme Roofing Company Maybe
Jason Client
```

Do not place owner Social Security numbers, full account numbers, or other sensitive identifiers in a file name.

## Bank Statement Naming

```text
2026-06_Chase_BankStatement_AcmeRoofingLLC.pdf
2026-06_BankOfAmerica_BankStatement_NorthstarGoodsInc.pdf
```

For multiple accounts, use a non-sensitive account label:

```text
2026-06_Chase_OperatingAccount_BankStatement_AcmeRoofingLLC.pdf
2026-06_Chase_PayrollAccount_BankStatement_AcmeRoofingLLC.pdf
```

Do not use the full account number.

## Financial Statement Naming

```text
2026-06_QuickBooks_ProfitAndLoss_AcmeRoofingLLC.pdf
2026-06_QuickBooks_BalanceSheet_AcmeRoofingLLC.pdf
2026-06_Internal_AR-Aging_SignalHouseAgency.xlsx
2026-Q2_Internal_AccountsPayable_HarborTable.xlsx
```

Add `Draft` only when the status is truly draft:

```text
2026-06_Internal_ProfitAndLoss_DRAFT_AcmeRoofingLLC.pdf
```

## Tax Document Naming

```text
2025_IRS_BusinessTaxReturn_AcmeRoofingLLC_REDACTED.pdf
2024_State_BusinessTaxReturn_AcmeRoofingLLC_REDACTED.pdf
2025_CPA_TaxExtension_AcmeRoofingLLC.pdf
```

Do not label a draft as filed.

## Debt Document Naming

```text
2026-07_Internal_DebtSchedule_AcmeRoofingLLC.xlsx
2026-06_LenderName_LoanStatement_AcmeRoofingLLC.pdf
2026-07_ProviderName_PayoffStatement_AcmeRoofingLLC.pdf
```

Use a generic provider label when public display would expose confidential details.

## Ownership Document Naming

```text
2021_State_ArticlesOfOrganization_AcmeRoofingLLC.pdf
2026_Internal_OwnershipSchedule_AcmeRoofingLLC_REVIEWED.pdf
2021_Internal_OperatingAgreement_AcmeRoofingLLC.pdf
```

IDs should be stored in a restricted folder and named without sensitive numbers:

```text
OwnerID_PrimaryOwner_RESTRICTED.pdf
```

## Context Note Naming

```text
2026-05_Internal_EquipmentPurchaseContext_AcmeRoofingLLC.md
2026-Q2_Internal_SeasonalityContext_HarborTable.md
2026-06_Internal_PlatformPayoutDelay_NorthstarGoodsInc.md
```

Context notes should remain separate from source documents.

## Final Packet Naming

```text
2026-07-15_Internal_FundingDataRoomIndex_AcmeRoofingLLC.pdf
2026-07-15_Internal_DealSnapshot_AcmeRoofingLLC_HUMAN-REVIEWED.pdf
2026-07-15_Internal_HandoffPacket_AcmeRoofingLLC_HUMAN-REVIEWED.zip
```

Do not use `Approved` in the file name unless referring to an internal content-review status unrelated to funding approval. Prefer `HUMAN-REVIEWED`.

## Version Control

Use:

```text
_v01
_v02
_v03
```

Example:

```text
2026-07_Internal_DealSnapshot_AcmeRoofingLLC_v03.docx
```

Final internal version:

```text
2026-07_Internal_DealSnapshot_AcmeRoofingLLC_HUMAN-REVIEWED.pdf
```

Avoid:

```text
final.pdf
final2.pdf
final-final-use-this.pdf
```

## Files That Should Not Be Renamed Without Review

Require human review before renaming:

- executed legal agreements
- tax returns
- signed ownership documents
- government-issued records
- provider-generated payoff statements
- files whose exact original name is needed for audit or legal tracking

For these files, retain the original and create a clearly labeled copy or index entry.

## Bad vs Good Examples

| Bad | Better |
|---|---|
| `download (7).pdf` | `2026-06_Chase_BankStatement_AcmeRoofingLLC.pdf` |
| `taxes.pdf` | `2025_IRS_BusinessTaxReturn_AcmeRoofingLLC_REDACTED.pdf` |
| `pnl new.xlsx` | `2026-06_QuickBooks_ProfitAndLoss_AcmeRoofingLLC.xlsx` |
| `loan stuff.pdf` | `2026-06_ProviderName_LoanStatement_AcmeRoofingLLC.pdf` |
| `final final.docx` | `2026-07_Internal_DealSnapshot_AcmeRoofingLLC_v03.docx` |
| `john-ssn-bank.pdf` | `OwnerID_PrimaryOwner_RESTRICTED.pdf` |

## File Renaming QA Checklist

- [ ] Date format is consistent
- [ ] Provider or source is identified
- [ ] Document type is clear
- [ ] Business name is consistent
- [ ] No full account number appears
- [ ] No Social Security number appears
- [ ] Draft and final status are accurate
- [ ] Original legal or provider file is preserved when needed
- [ ] Version number is used when multiple working copies exist
- [ ] Human-reviewed final file is clearly labeled
- [ ] No file name implies funding approval

> File naming improves operations. It does not change the underlying financial facts or determine eligibility.
