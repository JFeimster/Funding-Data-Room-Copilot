import {
  BLOCKER,
  FIX_BEFORE_SUBMISSION,
  IMPROVE_IF_TIME_ALLOWS,
} from "../../shared/constants/readiness-priorities.js";

export const QA_CLASSIFICATIONS = Object.freeze([
  "Ready for Human Review",
  "Hold — Blocker Present",
  "Provisional — Confirmation Needed",
]);

function cleanText(value, fallback = null) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim();
  return cleaned || fallback;
}

function normalizeArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return item.trim();
    if (item && typeof item === "object") return { ...item };
    return item;
  }).filter((item) => item !== "" && item !== null && item !== undefined);
}

function normalizeGap(item) {
  if (typeof item === "string") {
    return {
      gap: item,
      priority: FIX_BEFORE_SUBMISSION,
      why_it_matters:
        "The item may create avoidable questions or delay during human review.",
      next_action: "Confirm the fact or obtain the supporting document.",
      suggested_owner: "Business owner or processor",
      human_review_required: true,
    };
  }

  if (item && typeof item === "object") {
    const priority = [
      BLOCKER,
      FIX_BEFORE_SUBMISSION,
      IMPROVE_IF_TIME_ALLOWS,
    ].includes(item.priority)
      ? item.priority
      : FIX_BEFORE_SUBMISSION;

    return {
      gap: cleanText(item.gap ?? item.issue, "Unspecified readiness gap"),
      priority,
      why_it_matters: cleanText(
        item.why_it_matters,
        priority === BLOCKER
          ? "The issue materially affects package completeness, identity consistency, privacy, or a core request fact."
          : "The issue may create questions, delay, or weaker presentation.",
      ),
      next_action: cleanText(
        item.next_action,
        "Confirm the fact or obtain the supporting document.",
      ),
      suggested_owner: cleanText(
        item.suggested_owner ?? item.owner,
        "Business owner or processor",
      ),
      human_review_required:
        item.human_review_required !== false,
    };
  }

  return null;
}

function deriveMissingDocumentGaps(documentsMissing) {
  return documentsMissing.map((item) => {
    const document =
      typeof item === "string"
        ? item
        : cleanText(item?.document ?? item?.label ?? item?.name, "Missing document");
    const normalized = String(document).toLowerCase();
    const blocker =
      /(bank statement|statement pages?|ownership|legal name|identity|authorized signer|credential|requested amount)/i.test(
        normalized,
      );

    return {
      gap: `${document} is missing or incomplete.`,
      priority: blocker ? BLOCKER : FIX_BEFORE_SUBMISSION,
      why_it_matters: blocker
        ? "The item materially affects completeness, identity, privacy, or a core request fact."
        : "The item may create delay or additional questions during human review.",
      next_action: `Obtain or complete ${document} and confirm the status.`,
      suggested_owner: "Business owner or processor",
      human_review_required: true,
    };
  });
}

function identifyMaterialQuestion(payload) {
  const conflicts = normalizeArray(payload.conflicting_facts);
  if (conflicts.length === 0) return null;

  const material = conflicts.find((conflict) => {
    const text =
      typeof conflict === "string"
        ? conflict
        : JSON.stringify(conflict);
    return /(legal|business name|ownership|authorized signer|requested amount|use of funds|statement period|identity)/i.test(
      text,
    );
  });

  if (!material) return null;

  return {
    question:
      typeof material === "string"
        ? `Please confirm the correct information for this conflict: ${material}`
        : cleanText(
            material.question,
            "Please confirm the correct value for the material conflicting fact.",
          ),
    reason:
      "The answer may materially change the deal snapshot, readiness priority, or document requirements.",
  };
}

export function generateDealSnapshot(payload = {}) {
  const documentsAvailable = normalizeArray(payload.documents_available);
  const documentsMissing = normalizeArray(payload.documents_missing);
  const suppliedGaps = normalizeArray(payload.readiness_gaps)
    .map(normalizeGap)
    .filter(Boolean);
  const derivedGaps = deriveMissingDocumentGaps(documentsMissing);
  const readinessGaps = [...suppliedGaps, ...derivedGaps];

  const focusedQuestion = identifyMaterialQuestion(payload);
  const assumptions = normalizeArray(payload.provisional_assumptions);
  const missingCoreFacts = [];

  if (!cleanText(payload.business_name)) {
    missingCoreFacts.push({
      assumption: "A placeholder business name is used.",
      why_it_was_necessary:
        "The snapshot needs a record label.",
      must_confirm: "Confirm the legal or approved business name.",
      affected_output: "Business identity and snapshot title.",
    });
  }

  if (
    payload.requested_amount === undefined ||
    payload.requested_amount === null
  ) {
    missingCoreFacts.push({
      assumption: "The requested amount is not yet stated.",
      why_it_was_necessary:
        "The snapshot can be organized before the amount is confirmed.",
      must_confirm: "Confirm the active requested amount.",
      affected_output: "Funding request and use-of-funds section.",
    });
  }

  if (!cleanText(payload.funding_purpose)) {
    missingCoreFacts.push({
      assumption: "The use of funds is not yet specific.",
      why_it_was_necessary:
        "The snapshot can be drafted while the purpose is confirmed.",
      must_confirm: "State the specific intended use of funds.",
      affected_output: "Funding request, supporting documents, and next action.",
    });
  }

  const provisionalAssumptions = [...assumptions, ...missingCoreFacts];
  const hasBlocker = readinessGaps.some(
    (gap) => gap.priority === BLOCKER,
  );
  const classification = hasBlocker
    ? "Hold — Blocker Present"
    : focusedQuestion || provisionalAssumptions.length > 0
      ? "Provisional — Confirmation Needed"
      : "Ready for Human Review";

  const recommendedNextStep = hasBlocker
    ? readinessGaps.find((gap) => gap.priority === BLOCKER)?.next_action
    : focusedQuestion
      ? focusedQuestion.question
      : readinessGaps[0]?.next_action ??
        "Have an authorized human review the snapshot and supporting records.";

  return {
    title: `Funding Deal Snapshot — ${cleanText(
      payload.business_name,
      "Business Name",
    )}`,
    business_identity: {
      business_name: cleanText(payload.business_name, "Business Name"),
      legal_entity: cleanText(payload.legal_entity),
      dba: cleanText(payload.dba),
      industry: cleanText(payload.industry ?? payload.business_type),
      location: cleanText(payload.location),
      time_in_business: cleanText(payload.time_in_business),
      owner_name: cleanText(payload.owner_name),
    },
    funding_request: {
      requested_amount: payload.requested_amount ?? null,
      minimum_useful_amount: payload.minimum_useful_amount ?? null,
      use_of_funds: cleanText(payload.funding_purpose),
      timing_need: cleanText(payload.timing_need),
    },
    revenue_context: normalizeArray(payload.revenue_context),
    documents_received: documentsAvailable,
    documents_missing: documentsMissing,
    existing_debt: normalizeArray(payload.existing_debt),
    bank_statement_notes: normalizeArray(payload.bank_statement_notes),
    positive_factors: normalizeArray(payload.positive_factors),
    potential_concerns: normalizeArray(payload.potential_concerns),
    readiness_gaps: readinessGaps,
    provisional_assumptions: provisionalAssumptions,
    focused_question: focusedQuestion,
    recommended_next_step: recommendedNextStep,
    qa_classification: classification,
    human_review_required: true,
    limitations: [
      "This snapshot supports organization and human review.",
      "It does not predict approval, determine eligibility, or replace underwriting.",
      "User-reported facts and AI-structured summaries must be confirmed against source records.",
    ],
  };
}

export default generateDealSnapshot;
