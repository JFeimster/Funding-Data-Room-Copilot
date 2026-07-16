import {
  BLOCKER,
  FIX_BEFORE_SUBMISSION,
  IMPROVE_IF_TIME_ALLOWS,
} from "../../shared/constants/readiness-priorities.js";

const PROHIBITED_INPUT_LABELS = Object.freeze([
  "Passwords",
  "Bank usernames or login credentials",
  "API keys",
  "Access tokens",
  "Refresh tokens",
  "Private encryption keys",
  "Full Social Security numbers",
  "Full bank account numbers",
  "Card security codes",
  "Answers to security questions",
  "Unredacted government IDs when not required by an approved process",
]);

const REDACTION_CHECKLIST = Object.freeze([
  "Remove or mask full account numbers from working copies when appropriate.",
  "Remove full Social Security numbers from prompts, trackers, and summaries.",
  "Minimize dates of birth, home addresses, and government-ID numbers.",
  "Remove unrelated employee, customer, payroll, medical, and insurance data.",
  "Preserve the original source file in restricted storage.",
  "Label redacted working copies clearly.",
  "Review sharing permissions before external access is granted.",
]);

const STORAGE_REMINDERS = Object.freeze([
  "Use a restricted-access folder for bank, tax, ownership, payroll, and identity records.",
  "Keep original and redacted working copies separate.",
  "Do not assume a sharing link is private merely because it is difficult to guess.",
  "Do not place credentials or secrets in file names, trackers, or notes.",
  "Confirm authorization before sharing records outside the current team.",
]);

const PRIVACY_PATTERNS = Object.freeze([
  {
    key: "credentials",
    pattern:
      /(password|passcode|bank login|bank username|api.?key|access.?token|refresh.?token|private.?key|security question)/i,
    title: "Credential or secret may be exposed",
    reason:
      "Unauthorized access may be possible when credentials or secrets appear in a working payload.",
    action:
      "Stop processing the affected information, remove the secret from the working payload, and have an authorized administrator rotate or revoke it.",
    owner: "Authorized system administrator",
  },
  {
    key: "identity_numbers",
    pattern:
      /(full ssn|social security number|driver.?license number|passport number|full tax id|unredacted government id)/i,
    title: "Full identity information may be exposed",
    reason:
      "The workflow should not retain or repeat unnecessary full identity numbers.",
    action:
      "Remove or redact the unnecessary identity data and use an approved secure process for any required identity document.",
    owner: "Business owner or authorized privacy reviewer",
  },
  {
    key: "mixed_clients",
    pattern:
      /(mixed client|multiple clients|three clients|unrelated clients|cross-client|different clients in one file)/i,
    title: "Multiple client records may be mixed together",
    reason:
      "Cross-client files create privacy, access, and handoff risk.",
    action:
      "Stop processing the combined file and separate each client into an authorized, restricted workspace.",
    owner: "Processor or privacy owner",
  },
  {
    key: "public_link",
    pattern:
      /(public link|anyone with the link|unrestricted share|publicly shared|open sharing)/i,
    title: "Sensitive records may be publicly accessible",
    reason:
      "Unrestricted sharing may expose bank, tax, ownership, payroll, customer, or identity data.",
    action:
      "Restrict access, review the sharing history, and obtain human confirmation before continuing.",
    owner: "Storage administrator",
  },
  {
    key: "binary_or_base64",
    pattern:
      /(base64 pdf|base64 image|binary upload|embedded pdf|raw document bytes)/i,
    title: "Binary document content is not supported by the public action",
    reason:
      "The no-auth public action is designed for metadata and summaries, not raw document transfer.",
    action:
      "Use an approved storage workflow and provide only the necessary document metadata or restricted reference.",
    owner: "Application owner",
  },
]);

function normalizeSignals(payload) {
  const values = [];

  const fields = [
    payload.privacy_constraints,
    payload.privacy_risks,
    payload.warnings,
    payload.notes,
    payload.documents_available,
    payload.documents_missing,
  ];

  fields.forEach((field) => {
    if (Array.isArray(field)) {
      field.forEach((item) => {
        if (typeof item === "string") values.push(item);
        else if (item && typeof item === "object") values.push(JSON.stringify(item));
      });
    } else if (typeof field === "string") {
      values.push(field);
    } else if (field && typeof field === "object") {
      values.push(JSON.stringify(field));
    }
  });

  return values;
}

function buildBlocker(rule) {
  return {
    gap: rule.title,
    priority: BLOCKER,
    why_it_matters: rule.reason,
    next_action: rule.action,
    suggested_owner: rule.owner,
    human_review_required: true,
  };
}

export function generatePrivacyChecklist(payload = {}) {
  const signals = normalizeSignals(payload);
  const joinedSignals = signals.join(" ");
  const blockers = PRIVACY_PATTERNS
    .filter((rule) => rule.pattern.test(joinedSignals))
    .map(buildBlocker);

  const warnings = [];

  if (signals.length === 0) {
    warnings.push(
      "No privacy signals were supplied. Complete the checklist before sharing any funding documents.",
    );
  }

  const improvements = [
    {
      gap: "Original and redacted working copies should be clearly separated.",
      priority: FIX_BEFORE_SUBMISSION,
      why_it_matters:
        "Clear version control supports traceability and reduces accidental sharing of unredacted records.",
      next_action:
        "Preserve the original in restricted storage and label any redacted working copy.",
      suggested_owner: "Document owner or processor",
      human_review_required: true,
    },
    {
      gap: "Folder access and link permissions should be reviewed.",
      priority: IMPROVE_IF_TIME_ALLOWS,
      why_it_matters:
        "Permission review can reduce accidental exposure during collaboration.",
      next_action:
        "Confirm who can access each sensitive folder and remove unnecessary access.",
      suggested_owner: "Storage administrator",
      human_review_required: true,
    },
  ];

  return {
    privacy_status:
      blockers.length > 0 ? "Hold — Privacy Blocker Present" : "Review Required",
    prohibited_inputs: [...PROHIBITED_INPUT_LABELS],
    redaction_checklist: [...REDACTION_CHECKLIST],
    storage_and_sharing_reminders: [...STORAGE_REMINDERS],
    privacy_blockers: blockers,
    privacy_improvements: improvements,
    warnings,
    stop_processing: blockers.length > 0,
    human_review_requirements: [
      "Confirm the user is authorized to share the records.",
      "Confirm credentials and secrets are absent.",
      "Confirm full identity numbers are not present in prompts or trackers.",
      "Confirm different client records are separated.",
      "Confirm external sharing permissions before handoff.",
      "Require an authorized human to clear every privacy Blocker.",
    ],
    human_review_required: true,
  };
}

export default generatePrivacyChecklist;
