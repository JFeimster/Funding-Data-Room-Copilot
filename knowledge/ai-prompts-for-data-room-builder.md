# AI Prompt Library for Funding Data Room Copilot

## Prompt Design Standard

Every prompt should include:

- role
- inputs
- constraints
- output format
- human-review requirement

The prompts support organization and readiness. They do not predict approval.

## 1. Build Folder Structure

```text
Role:
Act as Funding Data Room Copilot.

Inputs:
- business name
- business type
- user role
- funding purpose
- available documents
- storage platform

Constraints:
- organize only
- do not request credentials
- create a restricted area for sensitive documents
- requirements vary by funding workflow

Output:
1. Copy/paste folder tree
2. Purpose of each folder
3. Sensitive-folder warning
4. Three next actions

Human review:
A person must confirm the structure and access permissions before documents are shared.
```

## 2. Generate Document Checklist

```text
Create a funding data room checklist for a [business type] organizing a file for [funding purpose].

Inputs:
- user role
- documents available
- missing documents
- known provider request, if supplied

Constraints:
- do not claim every document is required
- distinguish common, optional, and provider-requested items
- include privacy warnings

Output:
- checklist by category
- why each category matters
- missing-item table
- human-review gate
```

## 3. Rename Files

```text
Review the file names below and suggest standardized working-copy names.

Convention:
YYYY-MM_Provider_DocumentType_BusinessName.ext

Constraints:
- preserve originals
- never include full account numbers or identity numbers
- flag legal or signed files that should not be renamed without review
- do not alter file contents

Output:
| Original | Suggested Working Name | Reason | Human Review |
```

## 4. Create Missing Document Tracker

```text
Build a tracker from the supplied document inventory.

Inputs:
- documents received
- documents missing
- incomplete documents
- owners
- due dates

Use statuses:
Not Requested, Requested, Partially Received, Received, Outdated, Incomplete, Needs Explanation, Conflicting, Ready for Human Review.

Use priorities:
Blocker, Fix Before Submission, Improve If Time Allows.

Output fields:
Document, Status, Priority, Owner, Due Date, Why It Matters, Next Action, Human Review Required, Notes.
```

## 5. Classify Readiness Gaps

```text
Identify organizational readiness gaps in the supplied file summary.

Rules:
- do not predict approval
- do not imitate an underwriter
- use Blocker only for material operational issues
- explain why each gap matters
- assign one next action and owner
- identify any fact that requires one focused question

Output:
| Gap | Priority | Why It Matters | Next Action | Owner | Human Review |
```

## 6. Rewrite Revenue Context

```text
Rewrite the rough notes into a factual context note.

Inputs:
- event
- period
- amount
- user explanation
- supporting documents

Constraints:
- no exaggeration
- no concealment
- no approval claims
- distinguish reported facts from verified facts

Output:
1. Context note
2. Likely reviewer questions
3. Supporting documents
4. Open fact to confirm
5. Human review warning
```

## 7. Generate Reviewer Questions

```text
Generate up to five questions a human reviewer may reasonably ask about the supplied package.

Prioritize:
- missing facts
- conflicting facts
- unsupported explanations
- incomplete documents
- privacy issues

Do not predict what a lender will decide.
```

## 8. Create Deal Snapshot

```text
Create a one-page deal snapshot.

Inputs:
- business identity
- requested amount
- use of funds
- documents received
- documents missing
- existing debt
- revenue context
- readiness gaps

Constraints:
- factual and concise
- no approval language
- label assumptions
- flag Blockers

Output:
Use the standard deal-snapshot fields and end with one allowed QA classification.
```

## 9. Create Broker Handoff Notes

```text
Create broker or processor handoff notes.

Include:
- client ID
- deal owner
- stage
- requested amount
- use of funds
- documents complete
- documents missing
- Blockers
- questions pending
- next action
- next-action owner
- follow-up date
- privacy review
- human review status

Do not recommend automatic submission.
```

## 10. Run Privacy Review

```text
Review the described workflow for privacy and redaction risks.

Look for:
- credentials
- full identity numbers
- public links
- mixed client files
- unnecessary payroll or customer data
- unredacted IDs
- sensitive data in filenames

Output:
1. Privacy Blockers
2. Fix Before Sharing
3. Data to minimize
4. Required human action

Do not claim a platform is secure unless verified.
```

## 11. Run Final QA Gate

```text
Run the funding data room QA gate.

Check:
- identity
- ownership
- statement completeness
- financial freshness
- debt schedule
- use of funds
- revenue context
- missing documents
- privacy
- file naming
- folder structure
- deal snapshot
- handoff

Allowed result:
- Ready for Human Review
- Hold — Blocker Present
- Provisional — Confirmation Needed

Never use approved for funding.
```

## 12. Produce Provisional Version

```text
Create a provisional output using only noncritical assumptions.

For each assumption include:
- assumption
- why necessary
- what must be confirmed
- affected output

Do not assume identity, ownership, authorization, privacy safety, or document authenticity.
```

## 13. Ask One Focused Question

```text
Review the conflict and ask exactly one question that resolves the highest-impact uncertainty.

Choose the question only if the answer materially changes:
- identity
- ownership
- requested amount
- use of funds
- required document period
- priority classification
- final snapshot

Do not ask a full questionnaire.
```

## 14. Generate Next-Best Actions

```text
Create a prioritized action queue.

Output:
1. Blockers
2. Fix Before Submission
3. Improve If Time Allows

For each action:
- task
- owner
- due date if supplied
- supporting document
- human review requirement
```

## 15. Create Business-Owner Summary

```text
Create a plain-English summary for the business owner.

Include:
- what is complete
- what is missing
- why each open item matters
- one next action
- privacy reminder
- human-review reminder

Avoid broker jargon and approval claims.
```

## 16. Create Broker / Processor Summary

```text
Create an operational summary for a broker or processor.

Include:
- client and deal identifiers
- current stage
- document status
- Blockers
- context still needed
- owner and due date
- next follow-up
- handoff readiness
- privacy status
- human review status

Keep it concise enough for CRM notes.
```
