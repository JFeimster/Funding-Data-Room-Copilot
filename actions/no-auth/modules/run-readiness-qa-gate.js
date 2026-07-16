import {
  BLOCKER,
  FIX_BEFORE_SUBMISSION,
  IMPROVE_IF_TIME_ALLOWS,
} from "../../shared/constants/readiness-priorities.js";

const QA_CLASSIFICATIONS = Object.freeze([
  "Ready for Human Review",
  "Hold — Blocker Present",
  "Provisional — Confirmation Needed",
]);

const MATERIAL_PATTERNS = Object.freeze({
  identity: /(legal name|business identity|wrong entity|entity conflict|dba conflict)/i,
  ownership: /(ownership|authorized signer|signing authority)/i,
  statement_completeness: /(missing statement|missing month|missing pages?|incomplete bank statement)/i,
  privacy: /(credential|password|api.?key|access.?token|social security|mixed client|public link|identity data)/i,
  request_conflict: /(conflicting requested amount|requested amount conflict|use of funds conflict)/i,
  manipulation: /(altered document|document alteration|fabricated|fake statement|suspected manipulation)/i,
});

function normalizeArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item !== null && item !== undefined);
}

function textOf(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return JSON.stringify(value);
  return "";
}

function makeGap({
  gap,
  priority,
  why,
  action,
  owner,
  source = null,
}) {
  return {
    gap,
    priority,
    why_it_matters: why,
    next_action: action,
    suggested_owner: owner,
    human_review_required: true,
    source,
  };
}

function normalizeSuppliedGap(item) {
  if (typeof item === "string") {
    return makeGap({
      gap: item,
      priority: FIX_BEFORE_SUBMISSION,
      why:
        "The issue may create delay, additional questions, or weaker presentation.",
      action: "Confirm the fact or obtain the supporting record.",
      owner: "Business owner or processor",
      source: "readiness_gaps",
    });
  }

  if (item && typeof item === "object") {
    const priority = [
      BLOCKER,
      FIX_BEFORE_SUBMISSION,
      IMPROVE_IF_TIME_ALLOWS,
    ].includes(item.priority)
      ? item.priority
      : FIX_BEFORE_SUBMISSION;

    return makeGap({
      gap: String(item.gap ?? item.issue ?? "Unspecified readiness gap"),
      priority,
      why: String(
        item.why_it_matters ??
          (priority === BLOCKER
            ? "The issue materially affects package completeness, identity, privacy, or a core request fact."
            : "The issue may create delay, additional questions, or weaker presentation."),
      ),
      action: String(
        item.next_action ??
          "Confirm the fact or obtain the supporting record.",
      ),
      owner: String(
        item.suggested_owner ??
          item.owner ??
          "Business owner or processor",
      ),
      source: "readiness_gaps",
    });
  }

  return null;
}

function classifyDocumentIssue(item) {
  const text = textOf(item);
  const lower = text.toLowerCase();

  if (
    Object.values(MATERIAL_PATTERNS).some((pattern) => pattern.test(text))
  ) {
    return makeGap({
      gap: `Material issue detected: ${text}`,
      priority: BLOCKER,
      why:
        "The issue materially affects package completeness, identity consistency, privacy, authenticity, or a core request fact.",
      action:
        "Resolve the issue and obtain human confirmation before submission readiness is reassessed.",
      owner: "Business owner, processor, or authorized reviewer",
      source: "documents_missing",
    });
  }

  if (
    /(outdated|debt schedule|payment frequency|revenue context|large deposit|large withdrawal|use of funds|balance sheet|profit and loss|p&l)/i.test(
      lower,
    )
  ) {
    return makeGap({
      gap: `Review issue: ${text}`,
      priority: FIX_BEFORE_SUBMISSION,
      why:
        "The issue may create avoidable questions, delay, or weaker presentation.",
      action:
        "Update the document or add a factual, human-reviewed explanation.",
      owner: "Business owner, processor, or bookkeeper",
      source: "documents_missing",
    });
  }

  return makeGap({
    gap: `Open item: ${text}`,
    priority: IMPROVE_IF_TIME_ALLOWS,
    why:
      "Resolving the item can improve organization and handoff quality.",
    action: "Confirm whether the item is needed and update the tracker.",
    owner: "Business owner or processor",
    source: "documents_missing",
  });
}

function collectPrivacyGaps(payload) {
  const privacy = payload.privacy_checklist;
  if (!privacy || typeof privacy !== "object") return [];

  const blockers = normalizeArray(privacy.privacy_blockers).map((item) => ({
    ...normalizeSuppliedGap(item),
    source: "privacy_checklist",
  }));

  return blockers.filter(Boolean);
}

function collectSnapshotGaps(payload) {
  const snapshot = payload.deal_snapshot;
  if (!snapshot || typeof snapshot !== "object") return [];

  return normalizeArray(snapshot.readiness_gaps)
    .map(normalizeSuppliedGap)
    .filter(Boolean)
    .map((gap) => ({ ...gap, source: "deal_snapshot" }));
}

function findFocusedQuestion(payload) {
  const supplied =
    payload.focused_question ??
    payload.deal_snapshot?.focused_question ??
    payload.context_notes?.notes?.find((note) => note?.focused_question)
      ?.focused_question;

  if (!supplied) return null;

  if (typeof supplied === "string") {
    return {
      question: supplied,
      reason:
        "A material fact requires confirmation before the affected output can be finalized.",
    };
  }

  return supplied;
}

function normalizeAssumptions(payload) {
  const assumptions = [
    ...normalizeArray(payload.provisional_assumptions),
    ...normalizeArray(payload.deal_snapshot?.provisional_assumptions),
    ...normalizeArray(payload.folder_structure?.provisional_assumptions),
  ];

  return assumptions;
}

function uniqueGaps(gaps) {
  const seen = new Set();

  return gaps.filter((gap) => {
    const key = `${gap.priority}::${gap.gap}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function runReadinessQaGate(payload = {}) {
  const suppliedGaps = normalizeArray(payload.readiness_gaps)
    .map(normalizeSuppliedGap)
    .filter(Boolean);

  const missingDocumentGaps = normalizeArray(payload.documents_missing)
    .map(classifyDocumentIssue)
    .filter(Boolean);

  const gaps = uniqueGaps([
    ...suppliedGaps,
    ...missingDocumentGaps,
    ...collectPrivacyGaps(payload),
    ...collectSnapshotGaps(payload),
  ]);

  const blockers = gaps.filter((gap) => gap.priority === BLOCKER);
  const fixBeforeSubmission = gaps.filter(
    (gap) => gap.priority === FIX_BEFORE_SUBMISSION,
  );
  const improveIfTimeAllows = gaps.filter(
    (gap) => gap.priority === IMPROVE_IF_TIME_ALLOWS,
  );

  const focusedQuestion = findFocusedQuestion(payload);
  const provisionalAssumptions = normalizeAssumptions(payload);

  let classification = "Ready for Human Review";

  if (blockers.length > 0) {
    classification = "Hold — Blocker Present";
  } else if (focusedQuestion || provisionalAssumptions.length > 0) {
    classification = "Provisional — Confirmation Needed";
  }

  const nextAction =
    blockers[0]?.next_action ??
    focusedQuestion?.question ??
    fixBeforeSubmission[0]?.next_action ??
    "Have an authorized human review the package and source records.";

  const nextOwner =
    blockers[0]?.suggested_owner ??
    fixBeforeSubmission[0]?.suggested_owner ??
    "Authorized human reviewer";

  const checks = {
    identity_consistency: !gaps.some((gap) =>
      MATERIAL_PATTERNS.identity.test(gap.gap),
    ),
    ownership_consistency: !gaps.some((gap) =>
      MATERIAL_PATTERNS.ownership.test(gap.gap),
    ),
    statement_completeness: !gaps.some((gap) =>
      MATERIAL_PATTERNS.statement_completeness.test(gap.gap),
    ),
    financial_freshness: !gaps.some((gap) =>
      /outdated|profit and loss|p&l|balance sheet/i.test(gap.gap),
    ),
    debt_disclosure: !gaps.some((gap) =>
      /debt schedule|payment frequency|existing debt/i.test(gap.gap),
    ),
    use_of_funds_clarity: !gaps.some((gap) =>
      /use of funds|funding purpose/i.test(gap.gap),
    ),
    revenue_context: !gaps.some((gap) =>
      /revenue|large deposit|large withdrawal|context/i.test(gap.gap),
    ),
    privacy_and_redaction: !gaps.some((gap) =>
      MATERIAL_PATTERNS.privacy.test(gap.gap),
    ),
    file_naming:
      payload.file_naming_rules !== undefined ||
      normalizeArray(payload.current_file_names).length === 0,
    folder_structure:
      payload.folder_structure !== undefined ||
      Boolean(payload.business_name),
    deal_snapshot: payload.deal_snapshot !== undefined,
    broker_processor_handoff:
      payload.user_role !== "broker" &&
      payload.user_role !== "processor"
        ? null
        : payload.handoff !== undefined,
  };

  return {
    classification,
    allowed_classifications: [...QA_CLASSIFICATIONS],
    checks,
    blockers,
    fix_before_submission: fixBeforeSubmission,
    improve_if_time_allows: improveIfTimeAllows,
    provisional_assumptions: provisionalAssumptions,
    focused_question: focusedQuestion,
    next_action: nextAction,
    suggested_owner: nextOwner,
    pass_hold_summary: {
      blocker_count: blockers.length,
      fix_before_submission_count: fixBeforeSubmission.length,
      improve_if_time_allows_count: improveIfTimeAllows.length,
      provisional_assumption_count: provisionalAssumptions.length,
    },
    human_review_required: true,
    limitations: [
      "The QA gate evaluates organization and readiness for human review.",
      "It does not determine eligibility, approval, pricing, or underwriting outcome.",
      "A human must clear every Blocker and confirm every material fact.",
    ],
  };
}

export default runReadinessQaGate;
