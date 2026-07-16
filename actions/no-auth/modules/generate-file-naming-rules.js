const DEFAULT_FORMULA =
  "YYYY-MM_Provider_DocumentType_BusinessName.ext";

const CATEGORY_EXAMPLES = Object.freeze({
  bank_statement:
    "2026-06_Chase_BankStatement_AcmeRoofingLLC.pdf",
  profit_and_loss:
    "2026-06_QuickBooks_ProfitAndLoss_AcmeRoofingLLC.pdf",
  balance_sheet:
    "2026-06_QuickBooks_BalanceSheet_AcmeRoofingLLC.pdf",
  tax_return:
    "2025_IRS_BusinessTaxReturn_AcmeRoofingLLC_REDACTED.pdf",
  debt_schedule:
    "2026-07_Internal_DebtSchedule_AcmeRoofingLLC.xlsx",
  context_note:
    "2026-06_Internal_EquipmentPurchaseContext_AcmeRoofingLLC.md",
  deal_snapshot:
    "2026-07-15_Internal_DealSnapshot_AcmeRoofingLLC_HUMAN-REVIEWED.pdf",
});

const SENSITIVE_PATTERN =
  /(?:\b\d{3}[- ]?\d{2}[- ]?\d{4}\b|\b\d{12,19}\b|ssn|social.?security|account.?number|routing.?number|password|api.?key|access.?token)/i;

const PROTECTED_SOURCE_PATTERN =
  /(signed|executed|tax.?return|articles|operating.?agreement|government.?id|driver.?license|passport|payoff.?statement)/i;

function cleanText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim() || fallback;
}

function safeBusinessName(value) {
  return cleanText(value, "BusinessName")
    .replace(/[^A-Za-z0-9]+/g, "")
    .slice(0, 80) || "BusinessName";
}

function splitFileName(fileName) {
  const normalized = cleanText(fileName, "document");
  const lastDot = normalized.lastIndexOf(".");
  if (lastDot <= 0) {
    return { base: normalized, extension: "" };
  }
  return {
    base: normalized.slice(0, lastDot),
    extension: normalized.slice(lastDot + 1).replace(/[^A-Za-z0-9]/g, ""),
  };
}

function inferDocumentType(base) {
  const value = base.toLowerCase();
  if (/bank|statement/.test(value)) return "BankStatement";
  if (/profit|p.?&.?l|pnl/.test(value)) return "ProfitAndLoss";
  if (/balance/.test(value)) return "BalanceSheet";
  if (/tax|return/.test(value)) return "BusinessTaxReturn";
  if (/debt|loan|advance/.test(value)) return "DebtDocument";
  if (/ownership|operating|articles/.test(value)) return "OwnershipDocument";
  if (/invoice|quote|purchase.?order/.test(value)) return "SupportingDocument";
  if (/snapshot/.test(value)) return "DealSnapshot";
  if (/context|explanation|note/.test(value)) return "ContextNote";
  return "Document";
}

function inferDate(base) {
  const iso = base.match(/\b(20\d{2})[-_ .](0[1-9]|1[0-2])\b/);
  if (iso) return `${iso[1]}-${iso[2]}`;

  const year = base.match(/\b(20\d{2})\b/);
  if (year) return year[1];

  return "YYYY-MM";
}

function inferProvider(base) {
  const knownProviders = [
    "Chase",
    "BankOfAmerica",
    "WellsFargo",
    "QuickBooks",
    "Stripe",
    "Shopify",
    "Amazon",
    "Square",
    "PayPal",
    "IRS",
  ];

  const compact = base.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
  return (
    knownProviders.find((provider) =>
      compact.includes(provider.toLowerCase()),
    ) ?? "Provider"
  );
}

function suggestName(fileName, businessName) {
  const { base, extension } = splitFileName(fileName);
  const date = inferDate(base);
  const provider = inferProvider(base);
  const documentType = inferDocumentType(base);
  const safeExtension = extension || "ext";
  return `${date}_${provider}_${documentType}_${businessName}.${safeExtension}`;
}

export function generateFileNamingRules(payload = {}) {
  const businessName = safeBusinessName(payload.business_name);
  const currentFileNames = Array.isArray(payload.current_file_names)
    ? payload.current_file_names
    : [];

  const mappings = currentFileNames.map((item) => {
    const original =
      typeof item === "string"
        ? item
        : cleanText(item?.file_name ?? item?.name, "document");

    const containsSensitiveIdentifier = SENSITIVE_PATTERN.test(original);
    const protectedSource = PROTECTED_SOURCE_PATTERN.test(original);

    return {
      original,
      suggested_working_name: suggestName(original, businessName),
      preserve_original: protectedSource,
      human_review_required: protectedSource || containsSensitiveIdentifier,
      warnings: [
        ...(containsSensitiveIdentifier
          ? [
              "The original file name appears to contain sensitive information. Remove sensitive identifiers from the working-copy name and review the source file.",
            ]
          : []),
        ...(protectedSource
          ? [
              "This may be a signed, legal, tax, identity, or provider-generated record. Preserve the original and rename only a clearly labeled working copy after human review.",
            ]
          : []),
      ],
    };
  });

  return {
    naming_formula: DEFAULT_FORMULA,
    date_rules: {
      monthly: "YYYY-MM",
      quarterly: "YYYY-Q1 through YYYY-Q4",
      annual: "YYYY",
      date_specific: "YYYY-MM-DD",
    },
    business_name_rule:
      "Use the legal business name or one approved short form consistently. Do not include owner identity numbers.",
    category_examples: CATEGORY_EXAMPLES,
    mappings,
    privacy_rules: [
      "Do not include full account numbers, Social Security numbers, tax identifiers, credentials, or access tokens in file names.",
      "Use account labels such as OperatingAccount or PayrollAccount instead of full account numbers.",
      "Use a restricted folder for identity and tax records.",
    ],
    protected_source_rules: [
      "Preserve original signed, executed, legal, tax, identity, and provider-generated records.",
      "Create a separate working copy when a standardized name is operationally useful.",
      "Do not alter source-document content.",
    ],
    version_control_rules: [
      "Use _v01, _v02, and _v03 for working versions.",
      "Use HUMAN-REVIEWED for the approved internal working version.",
      "Avoid final, final2, and final-final naming.",
      "Never use APPROVED to imply funding approval.",
    ],
    human_review_required: mappings.some(
      (mapping) => mapping.human_review_required,
    ),
  };
}

export default generateFileNamingRules;
