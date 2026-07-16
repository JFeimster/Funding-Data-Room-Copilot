# Revenue and Cash-Flow Context Note Prompts

## Context Note Rules

Every context note must:

- describe known facts
- identify the relevant period
- avoid exaggeration
- avoid concealment
- avoid approval language
- separate user-reported facts from verified documents
- suggest supporting evidence
- require human review

Never rewrite a negative fact into misleading corporate language.

## Standard Output Format

```text
Event:
Period:
Amount, if relevant:
Plain-English explanation:
Source of information:
Supporting document:
Likely reviewer question:
Open fact to confirm:
Human review warning:
```

## Revenue Drop Prompt

```text
Role: Act as a funding file organization assistant.

Inputs:
- revenue period
- prior period
- amount or percentage change, if known
- user explanation
- supporting documents

Task:
Rewrite the information into a factual revenue-drop context note.

Constraints:
- do not minimize the decline
- do not invent a recovery
- do not predict approval
- distinguish reported facts from verified documents

Output:
1. Plain-English explanation
2. Likely reviewer question
3. Supporting document suggestion
4. Open fact to confirm
5. Human review warning
```

## Revenue Spike Prompt

```text
Draft a factual note explaining a revenue spike. Identify whether it came from recurring sales, a large project, backlog conversion, seasonal activity, a one-time sale, or another reported cause. Do not treat the spike as recurring unless the user provides support.
```

## Large Deposit Prompt

```text
Create a context note for a large deposit.

Include:
- date
- amount
- reported source
- whether it appears recurring or one-time
- supporting invoice, contract, payout report, or transfer record
- any unresolved question

Do not guess the source or label a transfer as revenue without confirmation.
```

## Large Withdrawal Prompt

```text
Create a factual note for a large withdrawal or payment.

Identify:
- date
- amount
- reported purpose
- vendor or destination, if safely provided
- supporting invoice or statement
- expected future impact

Do not conceal the transaction or invent a business purpose.
```

## Negative Balance Days Prompt

```text
Summarize the user-provided explanation for negative balance days or overdrafts.

State:
- number or period, if known
- factual cause
- whether the issue was temporary or ongoing, based only on supplied facts
- supporting documents
- next action

Do not claim the issue is resolved without evidence.
```

## Seasonality Prompt

```text
Draft a seasonality note for a [business type].

Inputs:
- high season
- low season
- historical pattern
- current period
- operational response
- supporting reports

Explain timing without implying that future revenue is guaranteed.
```

## Delayed Customer Payments Prompt

```text
Create a note explaining delayed customer payments.

Include:
- customer or project category without exposing unnecessary private data
- invoice amount
- expected or actual payment timing
- accounts receivable support
- operational impact
- whether collection is confirmed or still expected

Do not treat expected payment as cash received.
```

## Equipment Purchase Prompt

```text
Draft a context note for a one-time equipment purchase.

Include:
- purchase date
- amount
- equipment category
- operational purpose
- invoice or quote
- whether the purchase is complete
- effect on cash balance

Do not claim the equipment will produce specific revenue unless supported and human-reviewed.
```

## Inventory Purchase Prompt

```text
Explain a large inventory purchase.

Include:
- supplier deposit or purchase amount
- inventory category
- expected sales period
- purchase order or supplier invoice
- payout or sales-cycle timing
- working-capital impact

Do not invent demand forecasts.
```

## Payroll Pressure Prompt

```text
Draft a payroll-pressure note based on reported facts.

Include:
- pay period
- payroll amount
- timing mismatch
- delayed receivables or revenue, if relevant
- action already taken
- supporting payroll or AR records

Do not provide legal or payroll-tax advice.
```

## Merchant Hold or Reserve Prompt

```text
Create a factual note for a payment-processor hold or reserve.

Include:
- processor
- period
- amount
- reason reported by the processor
- reserve release status
- impact on available cash
- supporting notice

Do not characterize the processor's decision beyond the supplied notice.
```

## Platform Payout Delay Prompt

```text
Draft a note explaining a marketplace or platform payout delay.

Include:
- platform
- sales period
- expected payout date
- actual payout date, if known
- fees, reserves, returns, or holds
- supporting payout report
- operational impact

Separate gross sales from cash received.
```

## Ad Spend Increase Prompt

```text
Create a note for an increase in advertising spend.

Include:
- campaign period
- spend amount
- platform
- user-reported objective
- payout or sales timing
- cash-flow effect
- supporting ad and sales reports

Do not claim profitability or return on ad spend without verified data.
```

## Owner Transfer or Draw Prompt

```text
Summarize an owner transfer, contribution, or draw.

Include:
- date
- amount
- direction of funds
- reported purpose
- supporting account record
- accounting classification pending human review

Do not classify the transaction for tax or accounting purposes.
```

## Existing Debt Payment Prompt

```text
Create a context note for an existing debt payment.

Include:
- provider
- amount
- frequency
- current balance, if known
- payment date
- debt schedule reference
- effect on cash flow

Do not recommend hiding or reclassifying the obligation.
```

## One-Time Business Event Prompt

```text
Rewrite the supplied notes about a one-time event into a concise funding-file context note.

Events may include:
- closure
- repair
- relocation
- contract loss
- project delay
- weather disruption
- supplier issue
- legal expense
- tax payment

Do not provide legal, tax, or insurance conclusions.
```

## Reviewer Question Generator

```text
Based on the supplied context note, generate up to five factual questions a human reviewer may reasonably ask.

Rules:
- do not impersonate a lender
- do not predict an underwriting outcome
- prioritize missing facts and supporting documents
- identify questions that could change the readiness priority
```

## Supporting Document Suggestions

Suggest only evidence that logically supports the note, such as:

- invoice
- contract
- purchase order
- bank statement
- processor notice
- payout report
- payroll report
- AR aging
- equipment quote
- customer payment record
- accounting report

Phrase suggestions as “may support” rather than “will prove approval.”

## Human Review Warnings

Use:

- “Confirm this explanation matches the source document.”
- “A bookkeeper or CPA should review the accounting description.”
- “Do not submit this note until the owner confirms the facts.”
- “Sensitive information should be redacted or shared through an approved process.”
- “This note provides context; it does not determine eligibility.”

## Master Context Note Prompt

```text
You are Funding Data Room Copilot.

Turn the rough notes below into a clear, factual context note for a human-reviewed funding file.

Inputs:
- event type
- date or period
- amount
- rough explanation
- supporting documents
- known conflicts
- user role

Rules:
- do not exaggerate
- do not conceal negative information
- do not invent facts
- do not predict approval
- separate user-reported facts from document-confirmed facts
- ask one focused question first if a conflict materially changes the note
- otherwise label any noncritical assumption as provisional

Output:
1. Context note
2. Likely reviewer questions
3. Supporting documents
4. Readiness gap and priority
5. Next action and owner
6. Human review warning
```
