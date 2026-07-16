import {
  BUILD_DATA_ROOM_PACKAGE,
  GENERATE_FOLDER_STRUCTURE,
  GENERATE_DOCUMENT_CHECKLIST,
  GENERATE_FILE_NAMING_RULES,
  CREATE_MISSING_DOCUMENT_TRACKER,
  GENERATE_DEAL_SNAPSHOT,
  GENERATE_PRIVACY_CHECKLIST,
  REWRITE_CONTEXT_NOTES,
  RUN_READINESS_QA_GATE,
} from "../constants/public-action-names.js";

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasAnyKey(payload, keys) {
  return keys.some((key) => payload[key] !== undefined);
}

function validateArrayField(payload, field, errors) {
  if (payload[field] !== undefined && !Array.isArray(payload[field])) {
    errors.push({
      path: `payload.${field}`,
      issue: `${field} must be an array when provided.`,
    });
  }
}

function validateAmountField(payload, field, errors) {
  const value = payload[field];
  if (
    value !== undefined &&
    (typeof value !== "number" || !Number.isFinite(value) || value < 0)
  ) {
    errors.push({
      path: `payload.${field}`,
      issue: `${field} must be a non-negative finite number when provided.`,
    });
  }
}

function validateCommonFields(payload, errors) {
  [
    "documents_available",
    "documents_missing",
    "current_file_names",
    "revenue_context",
    "privacy_constraints",
    "existing_debt",
    "bank_statement_notes",
    "readiness_gaps",
  ].forEach((field) => validateArrayField(payload, field, errors));

  ["requested_amount", "minimum_useful_amount"].forEach((field) =>
    validateAmountField(payload, field, errors),
  );

  [
    "business_name",
    "business_type",
    "user_role",
    "funding_purpose",
  ].forEach((field) => {
    if (
      payload[field] !== undefined &&
      payload[field] !== null &&
      typeof payload[field] !== "string"
    ) {
      errors.push({
        path: `payload.${field}`,
        issue: `${field} must be a string when provided.`,
      });
    }
  });
}

export function validatePublicPayload(action, payload) {
  if (!isPlainObject(payload)) {
    return {
      valid: false,
      code: "INVALID_PAYLOAD",
      message: "The payload must be a JSON object.",
      errors: [{ path: "payload", issue: "Expected a JSON object." }],
    };
  }

  const errors = [];
  const warnings = [];
  validateCommonFields(payload, errors);

  switch (action) {
    case GENERATE_FOLDER_STRUCTURE:
      if (!isNonEmptyString(payload.business_name)) {
        warnings.push(
          "business_name was not supplied; a safe placeholder may be used.",
        );
      }
      break;

    case GENERATE_FILE_NAMING_RULES:
      if (!Array.isArray(payload.current_file_names)) {
        errors.push({
          path: "payload.current_file_names",
          issue:
            "current_file_names is required and must be an array for file-name mapping.",
        });
      }
      break;

    case REWRITE_CONTEXT_NOTES:
      if (
        !Array.isArray(payload.revenue_context) ||
        payload.revenue_context.length === 0
      ) {
        errors.push({
          path: "payload.revenue_context",
          issue:
            "At least one context event is required to rewrite context notes.",
        });
      }
      break;

    case RUN_READINESS_QA_GATE:
      if (
        !hasAnyKey(payload, [
          "documents_available",
          "documents_missing",
          "readiness_gaps",
          "deal_snapshot",
          "folder_structure",
          "privacy_constraints",
          "existing_debt",
          "bank_statement_notes",
        ])
      ) {
        errors.push({
          path: "payload",
          issue:
            "Provide at least one document, package, privacy, debt, or readiness-status field for the QA gate.",
        });
      }
      break;

    case CREATE_MISSING_DOCUMENT_TRACKER:
      if (
        !Array.isArray(payload.documents_missing) &&
        !Array.isArray(payload.documents_available)
      ) {
        errors.push({
          path: "payload",
          issue:
            "Provide documents_missing or documents_available to build the tracker.",
        });
      }
      break;

    case GENERATE_DEAL_SNAPSHOT:
      if (
        !hasAnyKey(payload, [
          "business_name",
          "requested_amount",
          "funding_purpose",
          "documents_available",
          "documents_missing",
        ])
      ) {
        warnings.push(
          "Limited deal facts were supplied; the result should be labeled provisional.",
        );
      }
      break;

    case GENERATE_DOCUMENT_CHECKLIST:
    case GENERATE_PRIVACY_CHECKLIST:
    case BUILD_DATA_ROOM_PACKAGE:
      break;

    default:
      errors.push({
        path: "action",
        issue: `No payload validator is configured for action: ${action}`,
      });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      code: "INVALID_PAYLOAD",
      message: "The action payload failed validation.",
      errors,
      warnings,
    };
  }

  return {
    valid: true,
    value: payload,
    warnings,
    errors: [],
  };
}
