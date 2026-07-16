const CHECKLIST_SECTIONS = Object.freeze([
  {
    key: "business_identity",
    label: "Business Identity",
    items: [
      ["legal_business_name", "Legal business name", true, true],
      ["dba", "DBA or trade name, when applicable", false, false],
      ["ein_confirmation", "EIN confirmation or equivalent business identifier record", true, true],
      ["business_address", "Current business address", true, false],
      ["formation_state_and_date", "State and date of formation", true, false],
      ["business_license", "Business or professional license, when applicable", false, true],
      ["business_description", "Plain-English business description", true, false],
    ],
  },
  {
    key: "ownership_and_legal",
    label: "Ownership and Legal",
    items: [
      ["formation_document", "Articles of organization or incorporation", true, true],
      ["operating_agreement", "Operating agreement or bylaws, when available", false, true],
      ["ownership_schedule", "Current ownership percentages", true, true],
      ["authorized_signer", "Authorized signer confirmation", true, true],
      ["lease_or_franchise", "Lease or franchise agreement, when relevant", false, true],
    ],
  },
  {
    key: "bank_statements",
    label: "Bank Statements",
    items: [
      ["bank_statement_period", "Requested statement period", true, true],
      ["complete_statement_pages", "All pages for each statement", true, true],
      ["provider_generated_pdf", "Provider-generated PDF rather than screenshots", true, true],
      ["correct_business_account", "Correct business account and account label", true, true],
      ["unusual_transaction_context", "Context for material deposits, withdrawals, or transfers", false, true],
    ],
  },
  {
    key: "financial_statements",
    label: "Financial Statements",
    items: [
      ["current_profit_and_loss", "Current year-to-date profit and loss statement", true, true],
      ["balance_sheet", "Current balance sheet, when available", false, true],
      ["accounts_receivable", "Accounts receivable aging, when relevant", false, true],
      ["accounts_payable", "Accounts payable report, when relevant", false, true],
      ["payroll_report", "Payroll report, when relevant", false, true],
      ["platform_or_processing_reports", "Platform sales, payout, or merchant-processing reports, when relevant", false, true],
    ],
  },
  {
    key: "tax_documents",
    label: "Tax Documents",
    items: [
      ["business_tax_return", "Most recent business tax return, when requested", false, true],
      ["prior_tax_return", "Prior-year business tax return, when requested", false, true],
      ["tax_extension_or_payment_plan", "Extension or payment-plan record, when relevant", false, true],
      ["redacted_tax_working_copy", "Appropriately redacted working copy", false, true],
    ],
  },
  {
    key: "revenue_and_cash_flow_context",
    label: "Revenue and Cash-Flow Context",
    items: [
      ["revenue_change_note", "Factual note for material revenue changes", false, true],
      ["large_transaction_note", "Factual note for material deposits or withdrawals", false, true],
      ["seasonality_note", "Seasonality explanation, when relevant", false, true],
      ["supporting_context_document", "Supporting invoice, contract, quote, payout report, or notice", false, true],
    ],
  },
  {
    key: "debt_and_obligations",
    label: "Debt and Obligations",
    items: [
      ["debt_schedule", "Current debt schedule", true, true],
      ["current_balances", "Current balances", true, true],
      ["payment_amounts", "Payment amounts", true, true],
      ["payment_frequency", "Daily, weekly, or monthly payment frequency", true, true],
      ["payoff_records", "Payoff records, when relevant", false, true],
    ],
  },
  {
    key: "funding_request",
    label: "Funding Request",
    items: [
      ["requested_amount", "Requested amount", true, true],
      ["minimum_useful_amount", "Minimum useful amount, when relevant", false, true],
      ["specific_use_of_funds", "Specific use of funds", true, true],
      ["timing_need", "Timing need", true, false],
      ["supporting_quote_or_allocation", "Supporting quote or use-of-funds allocation", false, true],
    ],
  },
  {
    key: "privacy_review",
    label: "Privacy Review",
    items: [
      ["credentials_removed", "Passwords, API keys, and access tokens excluded", true, true],
      ["identity_numbers_minimized", "Full identity numbers excluded from prompts and trackers", true, true],
      ["originals_preserved", "Original source documents preserved", true, true],
      ["sharing_permissions_reviewed", "Sharing permissions reviewed", true, true],
      ["client_files_separated", "Different client files separated", true, true],
    ],
  },
]);

const BROKER_PROCESSOR_SECTION = Object.freeze({
  key: "broker_processor_addendum",
  label: "Broker / Processor Addendum",
  items: [
    ["client_id", "Client ID", true, false],
    ["deal_owner", "Deal owner", true, false],
    ["workflow_stage", "Current workflow stage", true, false],
    ["follow_up_owner", "Next-action owner", true, false],
    ["follow_up_date", "Follow-up date", true, false],
    ["handoff_notes", "Current handoff notes", true, true],
    ["human_reviewer", "Human reviewer and review date", true, true],
  ],
});

const COMMON_DOC_ALIASES = Object.freeze({
  formation_document: ["formation", "articles of organization", "articles of incorporation"],
  ownership_schedule: ["ownership", "ownership schedule", "operating agreement"],
  bank_statement_period: ["bank statement", "bank statements"],
  complete_statement_pages: ["complete bank statement", "all pages"],
  current_profit_and_loss: ["profit and loss", "p&l", "pnl"],
  balance_sheet: ["balance sheet"],
  accounts_receivable: ["accounts receivable", "ar aging", "receivables"],
  accounts_payable: ["accounts payable", "ap aging", "payables"],
  payroll_report: ["payroll"],
  business_tax_return: ["tax return", "business tax"],
  debt_schedule: ["debt schedule", "loan schedule"],
  requested_amount: ["requested amount", "funding request"],
  specific_use_of_funds: ["use of funds", "funding purpose"],
});

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeDocumentList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return normalizeText(item);
    if (item && typeof item === "object") {
      return normalizeText(
        item.document ?? item.label ?? item.name ?? item.category ?? "",
      );
    }
    return "";
  }).filter(Boolean);
}

function documentMatches(key, label, list) {
  const terms = [
    normalizeText(key.replaceAll("_", " ")),
    normalizeText(label),
    ...(COMMON_DOC_ALIASES[key] ?? []).map(normalizeText),
  ];

  return list.some((document) =>
    terms.some((term) => term && (document.includes(term) || term.includes(document))),
  );
}

function resolveStatus(key, label, available, missing) {
  if (documentMatches(key, label, missing)) return "Requested";
  if (documentMatches(key, label, available)) return "Received";
  return "Not Requested";
}

function whyItemMatters(sectionKey, label) {
  const sectionReasons = {
    business_identity:
      "Helps confirm which business is organizing the funding file.",
    ownership_and_legal:
      "May help confirm ownership, authority, and the current legal record.",
    bank_statements:
      "Supports a complete, internally consistent view of recent business account activity.",
    financial_statements:
      "May help explain revenue, expenses, receivables, obligations, and operating conditions.",
    tax_documents:
      "May provide historical business and financial information when requested.",
    revenue_and_cash_flow_context:
      "Provides factual context for activity that may otherwise create avoidable questions.",
    debt_and_obligations:
      "Helps present current obligations and payment load without omission.",
    funding_request:
      "Makes the amount, purpose, and timing of the request specific.",
    privacy_review:
      "Reduces unnecessary exposure of sensitive business, owner, employee, or customer information.",
    broker_processor_addendum:
      "Supports ownership of follow-up, internal review, and a clean human handoff.",
  };

  return `${sectionReasons[sectionKey] ?? "Supports a clearer human review."} Item: ${label}.`;
}

function isBrokerRole(userRole) {
  const role = normalizeText(userRole).replaceAll("-", "_").replaceAll(" ", "_");
  return ["broker", "processor", "funding_broker", "referral_partner"].includes(role);
}

export function generateDocumentChecklist(payload = {}) {
  const available = normalizeDocumentList(payload.documents_available);
  const missing = normalizeDocumentList(payload.documents_missing);
  const sections = [...CHECKLIST_SECTIONS];

  if (isBrokerRole(payload.user_role)) {
    sections.push(BROKER_PROCESSOR_SECTION);
  }

  const generatedSections = sections.map((section) => ({
    key: section.key,
    label: section.label,
    items: section.items.map(
      ([key, label, commonlyRequested, humanReviewRequired]) => ({
        key,
        label,
        category: section.label,
        status: resolveStatus(key, label, available, missing),
        why_it_matters: whyItemMatters(section.key, label),
        commonly_requested: commonlyRequested,
        human_review_required: humanReviewRequired,
      }),
    ),
  }));

  const summary = generatedSections.reduce(
    (counts, section) => {
      section.items.forEach((item) => {
        counts.total += 1;
        if (item.status === "Received") counts.received += 1;
        if (item.status === "Requested") counts.requested += 1;
        if (item.status === "Not Requested") counts.not_requested += 1;
      });
      return counts;
    },
    { total: 0, received: 0, requested: 0, not_requested: 0 },
  );

  return {
    title: `Funding Data Room Checklist — ${String(
      payload.business_name ?? "Business Name",
    ).trim() || "Business Name"}`,
    business_type: String(payload.business_type ?? "generic_small_business"),
    user_role: String(payload.user_role ?? "not_specified"),
    requirements_notice:
      "Document requirements vary by funding product, provider, business type, and business profile. This checklist supports organization and does not guarantee eligibility or approval.",
    sections: generatedSections,
    summary,
    final_review_checklist: [
      "Confirm legal business identity and ownership records.",
      "Confirm the designated statement period is complete and includes all pages.",
      "Confirm the requested amount and use of funds are consistent across the package.",
      "Confirm existing debt and payment frequency are documented.",
      "Confirm privacy and sharing permissions.",
      "Require a human reviewer before any external submission.",
    ],
    human_review_required: true,
  };
}

export default generateDocumentChecklist;
