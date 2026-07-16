import {
  BLOCKER,
  FIX_BEFORE_SUBMISSION,
  IMPROVE_IF_TIME_ALLOWS,
} from "../../shared/constants/readiness-priorities.js";

const BUSINESS_TYPE_ALIASES = Object.freeze({
  contractor: "contractor",
  construction: "contractor",
  trades: "contractor",
  ecommerce: "ecommerce",
  "e-commerce": "ecommerce",
  retailer: "ecommerce",
  restaurant: "restaurant",
  food_service: "restaurant",
  agency: "agency",
  marketing_agency: "agency",
  clinic: "clinic",
  healthcare: "clinic",
  medical_practice: "clinic",
  "local service business": "local_service_business",
  local_service_business: "local_service_business",
  service_business: "local_service_business",
  "funding broker": "funding_broker",
  funding_broker: "funding_broker",
  broker: "funding_broker",
  generic: "generic_small_business",
  small_business: "generic_small_business",
  generic_small_business: "generic_small_business",
});

const BASE_FOLDERS = Object.freeze([
  {
    number: "00",
    key: "status",
    label: "Read_Me_and_Status",
    description:
      "Package purpose, workflow status, open Blockers, next action, privacy notes, and human-review status.",
    sensitive: false,
  },
  {
    number: "01",
    key: "identity",
    label: "Business_Identity",
    description:
      "Formation identity, business address, DBA information, licenses, and other business-level identity records.",
    sensitive: true,
  },
  {
    number: "02",
    key: "ownership",
    label: "Ownership_and_Legal",
    description:
      "Ownership, authorized-signer, operating agreement, lease, and legal records.",
    sensitive: true,
  },
  {
    number: "03",
    key: "bank_statements",
    label: "Bank_Statements",
    description:
      "Complete provider-generated business bank statements organized by statement period and account label.",
    sensitive: true,
  },
  {
    number: "04",
    key: "financial_statements",
    label: "Financial_Statements",
    description:
      "Profit and loss, balance sheet, accounts receivable, accounts payable, payroll, and related reports.",
    sensitive: true,
  },
  {
    number: "05",
    key: "tax_documents",
    label: "Tax_Documents",
    description:
      "Tax returns, extensions, payment-plan records, and related tax documents requiring restricted access.",
    sensitive: true,
  },
  {
    number: "06",
    key: "context",
    label: "Revenue_and_Cash_Flow_Context",
    description:
      "Separate factual notes and supporting documents explaining material cash-flow events.",
    sensitive: false,
  },
  {
    number: "07",
    key: "debt",
    label: "Debt_and_Obligations",
    description:
      "Debt schedule, current obligations, balances, payment frequency, and payoff records.",
    sensitive: true,
  },
  {
    number: "08",
    key: "funding_request",
    label: "Funding_Request",
    description:
      "Requested amount, minimum useful amount, use of funds, timing, and supporting quotes or allocations.",
    sensitive: false,
  },
  {
    number: "09",
    key: "tracker",
    label: "Missing_Document_Tracker",
    description:
      "Operational tracker for missing, outdated, incomplete, conflicting, or review-needed items.",
    sensitive: false,
  },
  {
    number: "10",
    key: "snapshot",
    label: "Deal_Snapshot",
    description:
      "Concise, factual one-page summary prepared for human review.",
    sensitive: false,
  },
  {
    number: "11",
    key: "handoff",
    label: "Broker_Processor_Handoff",
    description:
      "Handoff notes, open questions, next-action owner, and internal review status.",
    sensitive: true,
  },
  {
    number: "12",
    key: "final_review",
    label: "Final_Human_Review_Packet",
    description:
      "Human-reviewed working copies or secure links selected for the intended next step.",
    sensitive: true,
  },
]);

const BUSINESS_TYPE_ADDITIONS = Object.freeze({
  contractor: [
    ["Licenses_and_Insurance", "Trade licenses, insurance certificates, and related operating records."],
    ["Contracts_and_Backlog", "Current contracts, work orders, backlog summaries, and project schedules."],
    ["Equipment_Quotes", "Vendor quotes, invoices, and equipment-purchase support."],
  ],
  ecommerce: [
    ["Platform_Sales_and_Payouts", "Marketplace, storefront, processor sales, reserves, fees, and payout reports."],
    ["Inventory_and_Purchase_Orders", "Inventory purchase orders, supplier invoices, deposits, and freight support."],
    ["Advertising_and_Payout_Timing", "Ad-spend reports and factual notes about the sales-to-cash cycle."],
  ],
  restaurant: [
    ["Licenses_Lease_and_Insurance", "Operating licenses, lease records, and relevant insurance documents."],
    ["Merchant_Processing", "Processor statements, card-sales summaries, reserves, and chargeback records."],
    ["Seasonality_Food_Costs_and_Payroll", "Seasonality context, food-cost reports, and payroll summaries."],
  ],
  agency: [
    ["Client_Contracts", "Active client agreements, statements of work, and recurring-revenue support."],
    ["Accounts_Receivable", "Current AR aging, invoice support, and delayed-payment context."],
    ["Client_Concentration_and_Labor_Costs", "Client concentration notes, payroll, and contractor-cost summaries."],
  ],
  clinic: [
    ["Licenses_and_Provider_Records", "Business-level licenses and operating records without unnecessary patient data."],
    ["Insurance_Receivables", "Minimized or aggregated reimbursement and receivables reports."],
    ["Reimbursement_Delay_Context", "Factual notes about reimbursement timing and operational impact."],
  ],
  local_service_business: [
    ["Licenses_Insurance_and_Contracts", "Business licenses, insurance, customer contracts, and work orders."],
    ["Equipment_Vehicles_and_Quotes", "Equipment or vehicle records and current vendor quotes."],
    ["Receivables_and_Job_Pipeline", "Invoice aging, booked jobs, and customer-payment timing."],
  ],
  funding_broker: [
    ["Original_Client_Files", "Untouched source files received from the client."],
    ["Internal_QA", "Internal readiness review, open questions, and human-review notes."],
    ["Partner_Handoff", "Provider-facing handoff packet prepared by an authorized human."],
    ["Questions_and_Responses", "Tracked questions, factual responses, and supporting records."],
  ],
  generic_small_business: [
    ["Supporting_Documents", "Contracts, invoices, quotes, sales reports, and other relevant support."],
  ],
});

function cleanText(value, fallback) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim();
  return cleaned || fallback;
}

function normalizeBusinessType(value) {
  const key = cleanText(value, "generic_small_business").toLowerCase();
  return BUSINESS_TYPE_ALIASES[key] ?? "generic_small_business";
}

function sanitizeFolderName(value) {
  return cleanText(value, "Business_Name")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "") || "Business_Name";
}

function buildFolders(businessType) {
  const folders = BASE_FOLDERS.map((folder) => ({ ...folder }));
  const additions = BUSINESS_TYPE_ADDITIONS[businessType] ?? [];

  return folders.map((folder) => {
    if (folder.key !== "context") return folder;

    return {
      ...folder,
      subfolders: additions.map(([label, description], index) => ({
        number: String(index + 1).padStart(2, "0"),
        label,
        description,
        sensitive: businessType === "clinic",
      })),
    };
  });
}

function buildTree(packageName, folders) {
  const lines = [`${packageName}/`];

  folders.forEach((folder, folderIndex) => {
    const isLastFolder = folderIndex === folders.length - 1;
    const branch = isLastFolder ? "└──" : "├──";
    lines.push(`${branch} ${folder.number}_${folder.label}/`);

    const subfolders = Array.isArray(folder.subfolders) ? folder.subfolders : [];
    subfolders.forEach((subfolder, subIndex) => {
      const isLastSubfolder = subIndex === subfolders.length - 1;
      const prefix = isLastFolder ? "    " : "│   ";
      const subBranch = isLastSubfolder ? "└──" : "├──";
      lines.push(
        `${prefix}${subBranch} ${subfolder.number}_${subfolder.label}/`,
      );
    });
  });

  return lines.join("\n");
}

export function generateFolderStructure(payload = {}) {
  const businessName = cleanText(payload.business_name, "Business Name");
  const businessType = normalizeBusinessType(payload.business_type);
  const packageName = `Funding Data Room - ${sanitizeFolderName(businessName)}`;
  const folders = buildFolders(businessType);
  const assumptions = [];
  const warnings = [];

  if (!cleanText(payload.business_name, "")) {
    assumptions.push({
      assumption: "A placeholder business name was used.",
      why_it_was_necessary:
        "A package name is needed to produce the folder tree.",
      must_confirm: "Confirm the legal or approved business name.",
      affected_output: "Package name and folder tree.",
    });
  }

  if (!BUSINESS_TYPE_ALIASES[cleanText(payload.business_type, "").toLowerCase()]) {
    assumptions.push({
      assumption: "The generic small-business folder additions were used.",
      why_it_was_necessary:
        "The supplied business type was missing or not recognized.",
      must_confirm: "Confirm the business type and any industry-specific documents.",
      affected_output: "Industry-specific subfolders.",
    });
  }

  warnings.push(
    "Keep original source documents unchanged. Use separate working copies for renaming, redaction, summaries, and context notes.",
    "Review access permissions before placing bank, tax, ownership, payroll, customer, or identity records in shared storage.",
    "Folder organization supports human review but does not determine eligibility or approval.",
  );

  return {
    package_name: packageName,
    business_name: businessName,
    normalized_business_type: businessType,
    user_role: cleanText(payload.user_role, "not_specified"),
    funding_purpose: cleanText(payload.funding_purpose, "not_specified"),
    folder_tree: buildTree(packageName, folders),
    folders,
    sensitive_folder_warnings: [
      {
        gap: "Sensitive financial or identity records require restricted access.",
        priority: BLOCKER,
        why_it_matters:
          "Unapproved sharing may expose private business or owner information.",
        next_action:
          "Confirm the approved storage location and review access permissions before uploading sensitive records.",
        suggested_owner: "Business owner or authorized operations administrator",
        human_review_required: true,
      },
      {
        gap: "Original and redacted working copies must remain distinguishable.",
        priority: FIX_BEFORE_SUBMISSION,
        why_it_matters:
          "Overwriting a source document can damage traceability and create confusion.",
        next_action:
          "Preserve the original and label any redacted or reorganized working copy.",
        suggested_owner: "Processor or document owner",
        human_review_required: true,
      },
    ],
    provisional_assumptions: assumptions,
    next_actions: [
      {
        action: "Confirm the business name and business type.",
        priority: assumptions.length > 0
          ? FIX_BEFORE_SUBMISSION
          : IMPROVE_IF_TIME_ALLOWS,
        owner: "Business owner or broker",
      },
      {
        action: "Review folder access and privacy controls.",
        priority: BLOCKER,
        owner: "Authorized storage administrator",
      },
      {
        action: "Inventory received, missing, outdated, and conflicting documents.",
        priority: FIX_BEFORE_SUBMISSION,
        owner: "Business owner or processor",
      },
    ],
    human_review_required: true,
  };
}

export default generateFolderStructure;
