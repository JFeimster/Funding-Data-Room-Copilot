import {
  BLOCKER,
  FIX_BEFORE_SUBMISSION,
  IMPROVE_IF_TIME_ALLOWS,
} from "../../shared/constants/readiness-priorities.js";

export const DOCUMENT_STATUSES = Object.freeze([
  "Not Requested",
  "Requested",
  "Partially Received",
  "Received",
  "Outdated",
  "Incomplete",
  "Needs Explanation",
  "Conflicting",
  "Ready for Human Review",
  "Not Applicable",
]);

const BLOCKER_PATTERN =
  /(missing pages?|missing month|bank statement|legal name|business identity|ownership|authorized signer|credential|password|api.?key|access.?token|social.?security|mixed client|public link|document alteration|conflicting requested amount)/i;

const FIX_PATTERN =
  /(outdated|debt schedule|payment frequency|use of funds|revenue drop|large deposit|large withdrawal|context|explanation|balance sheet|profit and loss|p.?&.?l)/i;

function cleanText(value, fallback = "") {
  if (typeof value === "string") return value.trim() || fallback;
  return fallback;
}

function normalizeDocument(item, defaultStatus) {
  if (typeof item === "string") {
    return {
      document: item.trim(),
      category: "Other",
      status: defaultStatus,
      owner: null,
      due_date: null,
      notes: "",
    };
  }

  if (item && typeof item === "object") {
    return {
      document: cleanText(
        item.document ?? item.label ?? item.name,
        "Unnamed document",
      ),
      category: cleanText(item.category, "Other"),
      status: DOCUMENT_STATUSES.includes(item.status)
        ? item.status
        : defaultStatus,
      owner: cleanText(item.owner, "") || null,
      due_date: cleanText(item.due_date, "") || null,
      notes: cleanText(item.notes, ""),
      reason: cleanText(item.reason ?? item.why_it_matters, ""),
      next_action: cleanText(item.next_action, ""),
      priority: cleanText(item.priority, ""),
    };
  }

  return {
    document: "Unnamed document",
    category: "Other",
    status: defaultStatus,
    owner: null,
    due_date: null,
    notes: "",
  };
}

function inferPriority(document) {
  const combined = `${document.document} ${document.category} ${document.status} ${document.notes}`;

  if (
    document.status === "Conflicting" &&
    /(ownership|identity|requested amount|legal|authorized)/i.test(combined)
  ) {
    return BLOCKER;
  }

  if (
    document.status === "Incomplete" &&
    /(bank statement|statement pages?|statement month)/i.test(combined)
  ) {
    return BLOCKER;
  }

  if (BLOCKER_PATTERN.test(combined)) return BLOCKER;
  if (FIX_PATTERN.test(combined)) return FIX_BEFORE_SUBMISSION;
  return IMPROVE_IF_TIME_ALLOWS;
}

function inferWhyItMatters(document, priority) {
  if (document.reason) return document.reason;

  if (priority === BLOCKER) {
    return "The issue materially affects package completeness, identity consistency, privacy, or a core funding-request fact.";
  }

  if (priority === FIX_BEFORE_SUBMISSION) {
    return "The issue may create delay, confusion, repeated questions, or weaker presentation during human review.";
  }

  return "Resolving the item can improve organization and handoff quality.";
}

function inferNextAction(document, priority) {
  if (document.next_action) return document.next_action;

  if (document.status === "Partially Received" || document.status === "Incomplete") {
    return `Obtain the complete ${document.document} and confirm all pages or required fields are present.`;
  }

  if (document.status === "Outdated") {
    return `Request a current version of ${document.document}.`;
  }

  if (document.status === "Conflicting") {
    return `Ask one focused question to confirm the correct ${document.document}; do not resolve the conflict by assumption.`;
  }

  if (document.status === "Needs Explanation") {
    return `Create a factual context note for ${document.document} and attach supporting information when available.`;
  }

  if (priority === BLOCKER) {
    return `Resolve the material issue involving ${document.document} and obtain human confirmation.`;
  }

  return `Request or update ${document.document}.`;
}

function inferOwner(document, userRole) {
  if (document.owner) return document.owner;

  if (/tax|profit|loss|balance|accounts receivable|accounts payable|payroll|debt schedule/i.test(document.document)) {
    return "Business owner or bookkeeper";
  }

  if (/ownership|legal|authorized signer/i.test(document.document)) {
    return "Business owner and authorized human reviewer";
  }

  if (/privacy|credential|identity|mixed client|public link/i.test(document.document)) {
    return "Authorized administrator or privacy owner";
  }

  if (["broker", "processor", "funding_broker"].includes(String(userRole ?? "").toLowerCase())) {
    return "Processor or deal owner";
  }

  return "Business owner";
}

function buildRows(items, defaultStatus, userRole) {
  return items.map((item) => {
    const normalized = normalizeDocument(item, defaultStatus);
    const explicitPriority = [
      BLOCKER,
      FIX_BEFORE_SUBMISSION,
      IMPROVE_IF_TIME_ALLOWS,
    ].includes(normalized.priority)
      ? normalized.priority
      : null;
    const priority = explicitPriority ?? inferPriority(normalized);

    return {
      document: normalized.document,
      category: normalized.category,
      status: normalized.status,
      priority,
      owner: inferOwner(normalized, userRole),
      due_date: normalized.due_date,
      why_it_matters: inferWhyItMatters(normalized, priority),
      next_action: inferNextAction(normalized, priority),
      human_review_required:
        priority !== IMPROVE_IF_TIME_ALLOWS ||
        normalized.status === "Conflicting",
      notes: normalized.notes,
    };
  });
}

export function createMissingDocumentTracker(payload = {}) {
  const available = Array.isArray(payload.documents_available)
    ? payload.documents_available
    : [];
  const missing = Array.isArray(payload.documents_missing)
    ? payload.documents_missing
    : [];

  const rows = [
    ...buildRows(missing, "Requested", payload.user_role),
    ...buildRows(available, "Received", payload.user_role),
  ];

  const uniqueRows = [];
  const seen = new Set();

  rows.forEach((row) => {
    const key = `${row.document.toLowerCase()}::${row.status}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRows.push(row);
    }
  });

  const counts = uniqueRows.reduce(
    (summary, row) => {
      summary.total += 1;
      if (row.priority === BLOCKER) summary.blockers += 1;
      if (row.priority === FIX_BEFORE_SUBMISSION) {
        summary.fix_before_submission += 1;
      }
      if (row.priority === IMPROVE_IF_TIME_ALLOWS) {
        summary.improve_if_time_allows += 1;
      }
      return summary;
    },
    {
      total: 0,
      blockers: 0,
      fix_before_submission: 0,
      improve_if_time_allows: 0,
    },
  );

  return {
    title: `Missing Document Tracker — ${String(
      payload.business_name ?? "Business Name",
    ).trim() || "Business Name"}`,
    statuses: DOCUMENT_STATUSES,
    rows: uniqueRows,
    summary: counts,
    blocker_notice:
      counts.blockers > 0
        ? "One or more operational Blockers require human confirmation before submission readiness can be reassessed."
        : null,
    follow_up_rules: [
      "Use one specific request per missing item.",
      "Assign one owner and a real due date.",
      "Do not invent provider deadlines.",
      "Escalate unresolved Blockers to an authorized human.",
      "Do not mark Not Applicable without human confirmation.",
    ],
    human_review_required: uniqueRows.some(
      (row) => row.human_review_required,
    ),
  };
}

export default createMissingDocumentTracker;
