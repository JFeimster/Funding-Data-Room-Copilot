import {
  BLOCKER,
  FIX_BEFORE_SUBMISSION,
  IMPROVE_IF_TIME_ALLOWS,
} from "../../shared/constants/readiness-priorities.js";

const EVENT_SUPPORT = Object.freeze({
  revenue_drop: [
    "Profit and loss statement",
    "Sales report",
    "Bank statements",
    "Customer or project records",
  ],
  revenue_spike: [
    "Sales report",
    "Invoices",
    "Customer contract",
    "Platform payout report",
  ],
  large_deposit: [
    "Invoice",
    "Customer contract",
    "Deposit record",
    "Platform payout report",
  ],
  large_withdrawal: [
    "Vendor invoice",
    "Purchase order",
    "Equipment quote",
    "Bank statement",
  ],
  negative_balance_days: [
    "Bank statements",
    "Receivables report",
    "Payroll report",
    "Payment schedule",
  ],
  seasonality: [
    "Prior-year monthly sales",
    "Merchant processing statements",
    "Sales reports",
    "Bank statements",
  ],
  delayed_customer_payments: [
    "Accounts receivable aging",
    "Invoices",
    "Customer correspondence",
    "Payment records",
  ],
  equipment_purchase: [
    "Vendor invoice",
    "Equipment quote",
    "Purchase agreement",
    "Bank statement",
  ],
  inventory_purchase: [
    "Purchase order",
    "Supplier invoice",
    "Freight invoice",
    "Inventory report",
  ],
  payroll_pressure: [
    "Payroll report",
    "Receivables report",
    "Bank statements",
    "Customer payment schedule",
  ],
  merchant_hold_or_reserve: [
    "Processor notice",
    "Merchant processing statement",
    "Reserve report",
    "Bank statement",
  ],
  platform_payout_delay: [
    "Platform payout report",
    "Reserve or hold notice",
    "Sales report",
    "Bank statement",
  ],
  ad_spend_increase: [
    "Advertising platform report",
    "Sales report",
    "Bank statement",
    "Campaign invoice",
  ],
  owner_transfer_or_draw: [
    "Bank statement",
    "Transfer record",
    "Bookkeeper note",
    "Owner confirmation",
  ],
  existing_debt_payment: [
    "Debt schedule",
    "Loan statement",
    "Payment record",
    "Bank statement",
  ],
  one_time_business_event: [
    "Invoice",
    "Contract",
    "Insurance record",
    "Operational notice",
  ],
});

const MATERIAL_CONFLICT_PATTERN =
  /(identity|ownership|legal business name|requested amount|use of funds|statement period|authorized signer)/i;

function cleanText(value, fallback = null) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim();
  return cleaned || fallback;
}

function normalizeEventType(value) {
  return cleanText(value, "one_time_business_event")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeEvents(value) {
  if (!Array.isArray(value)) return [];

  return value.map((item, index) => {
    if (typeof item === "string") {
      return {
        id: `context-${index + 1}`,
        event_type: "one_time_business_event",
        raw_explanation: item.trim(),
      };
    }

    if (item && typeof item === "object") {
      return {
        id: cleanText(item.id, `context-${index + 1}`),
        event_type: normalizeEventType(
          item.event_type ?? item.event ?? item.type,
        ),
        period: cleanText(item.period ?? item.date),
        amount:
          typeof item.amount === "number" && Number.isFinite(item.amount)
            ? item.amount
            : null,
        raw_explanation: cleanText(
          item.raw_explanation ?? item.explanation ?? item.notes,
          "",
        ),
        source_of_information: cleanText(
          item.source_of_information ?? item.source,
          "User-reported information",
        ),
        supporting_documents: Array.isArray(item.supporting_documents)
          ? item.supporting_documents
          : [],
        conflicts: Array.isArray(item.conflicts) ? item.conflicts : [],
      };
    }

    return {
      id: `context-${index + 1}`,
      event_type: "one_time_business_event",
      raw_explanation: "",
    };
  });
}

function titleFromEventType(eventType) {
  return eventType
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildExplanation(event) {
  const title = titleFromEventType(event.event_type);
  const period = event.period ? ` during ${event.period}` : "";
  const amount =
    typeof event.amount === "number"
      ? ` involving approximately $${event.amount.toLocaleString("en-US")}`
      : "";
  const explanation = cleanText(
    event.raw_explanation,
    "The factual cause and operational impact still need to be confirmed.",
  );

  return `${title}${period}${amount}: ${explanation}`;
}

function buildQuestions(event) {
  const questions = [];

  if (!event.period) {
    questions.push("What date or period does this event cover?");
  }

  if (
    event.amount === null &&
    /(deposit|withdrawal|purchase|payment|payroll|reserve|spend|transfer)/.test(
      event.event_type,
    )
  ) {
    questions.push("What amount is associated with the event?");
  }

  if (!cleanText(event.raw_explanation)) {
    questions.push("What is the factual cause of the event?");
  }

  if (event.supporting_documents.length === 0) {
    questions.push("Which source document may support the explanation?");
  }

  return questions.slice(0, 5);
}

function identifyMaterialConflict(event) {
  const conflict = event.conflicts.find((item) =>
    MATERIAL_CONFLICT_PATTERN.test(
      typeof item === "string" ? item : JSON.stringify(item),
    ),
  );

  if (!conflict) return null;

  return {
    question:
      typeof conflict === "string"
        ? `Please confirm the correct information for this conflict: ${conflict}`
        : cleanText(
            conflict.question,
            "Please confirm the correct value for the material conflicting fact.",
          ),
    reason:
      "The answer may materially change the context note, readiness priority, or package summary.",
  };
}

function determinePriority(event, focusedQuestion) {
  if (focusedQuestion) return BLOCKER;

  if (
    /(large_deposit|large_withdrawal|negative_balance_days|owner_transfer_or_draw|existing_debt_payment|merchant_hold_or_reserve|platform_payout_delay)/.test(
      event.event_type,
    )
  ) {
    return FIX_BEFORE_SUBMISSION;
  }

  if (!cleanText(event.raw_explanation)) {
    return FIX_BEFORE_SUBMISSION;
  }

  return IMPROVE_IF_TIME_ALLOWS;
}

export function rewriteContextNotes(payload = {}) {
  const events = normalizeEvents(payload.revenue_context);

  const notes = events.map((event) => {
    const focusedQuestion = identifyMaterialConflict(event);
    const priority = determinePriority(event, focusedQuestion);
    const suggestedDocuments =
      EVENT_SUPPORT[event.event_type] ??
      EVENT_SUPPORT.one_time_business_event;

    const assumptions = [];

    if (!event.period) {
      assumptions.push({
        assumption: "The event period is not yet stated.",
        why_it_was_necessary:
          "A provisional note can still be drafted from the supplied facts.",
        must_confirm: "Confirm the date or period.",
        affected_output: "Context note and related reviewer questions.",
      });
    }

    return {
      id: event.id,
      event: titleFromEventType(event.event_type),
      event_type: event.event_type,
      period: event.period ?? null,
      amount: event.amount ?? null,
      plain_english_explanation: buildExplanation(event),
      source_of_information:
        event.source_of_information ?? "User-reported information",
      supporting_document_suggestions: [
        ...new Set([
          ...event.supporting_documents,
          ...suggestedDocuments,
        ]),
      ],
      likely_reviewer_questions: buildQuestions(event),
      open_facts_to_confirm: [
        ...buildQuestions(event),
        ...(focusedQuestion ? [focusedQuestion.question] : []),
      ],
      focused_question: focusedQuestion,
      provisional_assumptions: assumptions,
      priority,
      next_action:
        focusedQuestion?.question ??
        (event.supporting_documents.length === 0
          ? "Attach the most relevant supporting document and have the owner confirm the explanation."
          : "Have the owner confirm the explanation against the supporting record."),
      suggested_owner:
        /(tax|owner_transfer_or_draw)/.test(event.event_type)
          ? "Business owner and bookkeeper or qualified professional"
          : "Business owner or processor",
      human_review_warning:
        "This note must be reviewed against source records. It provides context and does not determine eligibility or approval.",
      human_review_required: true,
    };
  });

  return {
    title: `Revenue and Cash-Flow Context Notes — ${cleanText(
      payload.business_name,
      "Business Name",
    )}`,
    notes,
    global_constraints: [
      "Do not exaggerate or conceal negative information.",
      "Do not label a transfer as revenue without confirmation.",
      "Do not treat expected customer payments as cash received.",
      "Do not classify tax or accounting treatment.",
      "Do not predict approval.",
    ],
    warnings:
      notes.length === 0
        ? ["No context events were supplied."]
        : [],
    human_review_required: true,
  };
}

export default rewriteContextNotes;
