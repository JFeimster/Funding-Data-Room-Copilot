# Funding Data Room Checklist

## How to Use the Checklist

This checklist helps a business owner, broker, or processor organize a funding file before human review.

Complete it in five passes:

1. Build the folder structure.
2. Collect and label documents.
3. Add factual context.
4. Identify readiness gaps and owners.
5. Run the final QA gate.

Requirements vary by funding product, provider, business type, and business profile. A document appearing on this checklist does not mean every provider will require it.

## Business Identity

These items establish which business is requesting funding.

- [ ] Legal business name
- [ ] DBA or trade name, if applicable
- [ ] EIN confirmation or equivalent business tax identifier record
- [ ] Business address
- [ ] Business phone and email
- [ ] Website, if available
- [ ] State and date of formation
- [ ] Industry description
- [ ] Business license, if applicable
- [ ] Short plain-English business description

**Why it matters:** Conflicting business names, addresses, or entity information create avoidable questions and may become a Blocker when the correct entity cannot be confirmed.

### Business Description Template

```text
[Business Name] is a [business type] based in [location]. It has operated since [year] and generates revenue through [main products or services]. The business is organizing a funding file for [funding purpose].
```

## Ownership and Legal Documents

- [ ] Articles of organization or incorporation
- [ ] Operating agreement or bylaws, if available
- [ ] Ownership percentages
- [ ] Authorized signer
- [ ] Owner contact information
- [ ] Business license or professional license, if relevant
- [ ] Franchise agreement, if applicable
- [ ] Lease agreement, if relevant
- [ ] Government ID stored and shared only through an approved process

**Why it matters:** Ownership and authority must be internally consistent. Do not guess when documents conflict.

## Bank Statements

- [ ] Requested review-period statements collected
- [ ] Full PDF statements rather than screenshots
- [ ] All pages included
- [ ] Correct business account
- [ ] Bank name visible
- [ ] Account holder name visible
- [ ] Statement month visible
- [ ] Unusual deposits noted
- [ ] Large withdrawals or transfers noted
- [ ] Negative-balance days or overdrafts noted when relevant
- [ ] File names standardized

**Why it matters:** Missing months or pages can prevent the file from being treated as complete. Context notes should explain facts, not rewrite history.

### Suggested Name

```text
2026-06_Chase_BankStatement_AcmeRoofingLLC.pdf
```

## Financial Statements

- [ ] Year-to-date profit and loss statement
- [ ] Prior-year profit and loss statement, if relevant
- [ ] Balance sheet, if available
- [ ] Accounts receivable aging report, if relevant
- [ ] Accounts payable report, if relevant
- [ ] Payroll report, if relevant
- [ ] Merchant processing statements, if relevant
- [ ] Platform sales or payout reports, if relevant
- [ ] Preparation source documented
- [ ] Date generated documented
- [ ] Known limitations noted

**Why it matters:** Financial reports may help explain revenue, margins, receivables, obligations, and current operating conditions. Old or unexplained reports may need to be refreshed before submission.

### Financial Statement Source Note

```text
Report:
Prepared by:
Generated on:
Accounting method, if known:
Known limitations:
Human review completed:
```

## Tax Documents

- [ ] Most recent business tax return, if requested
- [ ] Prior-year return, if requested
- [ ] Filing extension record, if relevant
- [ ] Tax payment-plan notes, if relevant
- [ ] Sales-tax or payroll-tax notes, if relevant
- [ ] Sensitive identifiers redacted where appropriate

**Why it matters:** Tax documents are sensitive and should not be casually uploaded or summarized without controls. AI may organize factual notes but should not interpret tax obligations.

## Revenue and Cash-Flow Context

Create a factual note when relevant for:

- [ ] seasonality
- [ ] temporary revenue drop
- [ ] unusual revenue spike
- [ ] large deposit
- [ ] large withdrawal
- [ ] delayed customer payment
- [ ] equipment purchase
- [ ] inventory purchase
- [ ] payroll pressure
- [ ] merchant hold or reserve
- [ ] platform payout delay
- [ ] increased advertising spend
- [ ] owner transfer or draw
- [ ] one-time disruption

**Why it matters:** Documents show activity; context explains the event. The note must be factual, supported where possible, and reviewed by a human.

### Context Note Template

```text
Event:
Date or period:
Amount, if relevant:
Factual explanation:
Supporting document:
Expected ongoing impact:
Human review required:
```

## Existing Debt and Obligations

- [ ] Business loans
- [ ] Lines of credit
- [ ] Credit-card balances
- [ ] Equipment financing
- [ ] Merchant cash advances or receivables purchases
- [ ] Daily, weekly, or monthly payments
- [ ] Provider names
- [ ] Current balances
- [ ] Payment frequency
- [ ] Payoff records, if available
- [ ] Debt schedule reviewed by a human

**Why it matters:** An incomplete debt schedule can create confusion and weak handoffs. The Copilot should not advise users to omit obligations.

### Debt Schedule

| Provider | Obligation Type | Current Balance | Payment | Frequency | Notes |
|---|---|---:|---:|---|---|
|  |  |  |  |  |  |

## Funding Request

- [ ] Requested amount
- [ ] Minimum useful amount
- [ ] Specific use of funds
- [ ] Timing need
- [ ] Preferred product type, if known
- [ ] Existing obligations considered
- [ ] Expected business impact
- [ ] Backup plan if less capital is available
- [ ] Requested amount consistent across notes and forms

**Why it matters:** “Growth” is not a use-of-funds explanation. State what the capital is intended to support.

### Funding Request Template

```text
Requested amount:
Minimum useful amount:
Use of funds:
Timing:
Expected operational impact:
Existing debt considerations:
Facts requiring confirmation:
Human review required:
```

## Missing Document Review

Track every missing or incomplete item.

| Document | Status | Priority | Owner | Due Date | Next Action | Human Review |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

Use statuses such as:

- Not requested
- Requested
- Partially received
- Received
- Outdated
- Incomplete
- Needs explanation
- Ready for human review

## Privacy Review

- [ ] Full account numbers redacted where appropriate
- [ ] Social Security numbers not included in prompts
- [ ] Government IDs handled through an approved process
- [ ] Passwords and login credentials excluded
- [ ] API keys excluded
- [ ] Payroll and customer data minimized
- [ ] Sensitive folders use restricted access
- [ ] Sharing permissions reviewed
- [ ] AI-generated notes contain no unnecessary private data
- [ ] Privacy Blockers resolved by a human

## Final Submission-Readiness QA

### Identity and Consistency

- [ ] Business name is consistent
- [ ] Ownership details are consistent
- [ ] Requested amount is consistent
- [ ] Use of funds is consistent

### Documents

- [ ] Requested statement period is complete
- [ ] All statement pages are present
- [ ] Financial reports are current enough for the intended workflow
- [ ] Existing obligations are documented
- [ ] File names are readable
- [ ] Duplicates are removed or archived

### Context and Handoff

- [ ] Material revenue changes are explained
- [ ] Supporting documents are linked
- [ ] Missing items have owners and due dates
- [ ] Deal snapshot is current
- [ ] Handoff notes state the next action
- [ ] Human reviewer has signed off

### Allowed QA Outcomes

- **Ready for Human Review**
- **Hold — Blocker Present**
- **Provisional — Confirmation Needed**

Never label a file approved for funding.

## Broker / Processor Addendum

Add these operational fields:

- Deal owner
- Referral source
- Current stage
- Document status
- Blockers
- Fix Before Submission items
- Improve If Time Allows items
- Missing-document owner
- Follow-up date
- Submission destination
- Questions pending
- Handoff notes
- Human review completed

### Handoff Summary

```text
Business:
Deal owner:
Stage:
Requested amount:
Use of funds:
Documents complete:
Documents missing:
Blockers:
Context still needed:
Next action:
Next-action owner:
Follow-up date:
Human review status:
```

## Common Mistakes

### Screenshots Instead of Full Statements

Screenshots may omit pages, balances, or account context.

### Conflicting Business Names

Do not silently choose one name. Ask one focused question and require confirmation.

### Vague Use of Funds

Replace “growth” with a factual description such as inventory, payroll timing, equipment, receivables gap, or expansion costs.

### Old Financial Reports

Mark outdated reports as **Fix Before Submission** when a current report may materially improve the review package.

### Hidden or Unlisted Debt

Do not recommend omission. Escalate incomplete debt information for human review.

### Over-Polished AI Language

Clear beats inflated. “Cash flow was compressed by a one-time equipment purchase” is better than corporate fog.

### Unsafe Data Sharing

Do not paste passwords, bank credentials, API keys, or full identity numbers into the GPT.

> Final review still needs a human. Clean organization helps the file, but it does not guarantee approval.
