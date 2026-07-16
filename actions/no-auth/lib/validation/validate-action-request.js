import { isPublicActionName } from "../constants/public-action-names.js";

const PROHIBITED_KEY_PATTERN =
  /(password|passcode|secret|api[_-]?key|access[_-]?token|refresh[_-]?token|private[_-]?key|bank[_-]?(login|username|password)|full[_-]?ssn|social[_-]?security[_-]?number)/i;

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function findProhibitedKeys(value, path = "payload", findings = [], depth = 0) {
  if (depth > 8 || findings.length >= 20) {
    return findings;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      findProhibitedKeys(item, `${path}[${index}]`, findings, depth + 1),
    );
    return findings;
  }

  if (!isPlainObject(value)) {
    return findings;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    const currentPath = `${path}.${key}`;
    if (PROHIBITED_KEY_PATTERN.test(key)) {
      findings.push({
        path: currentPath,
        issue: "Potential credential, secret, or prohibited sensitive field.",
      });
    }
    findProhibitedKeys(nestedValue, currentPath, findings, depth + 1);
  }

  return findings;
}

export function validateActionRequest(input) {
  const errors = [];

  if (!isPlainObject(input)) {
    return {
      valid: false,
      code: "INVALID_REQUEST",
      message: "The request body must be a JSON object.",
      errors: [{ path: "$", issue: "Expected a JSON object." }],
    };
  }

  const { action, payload, request_id: requestId } = input;

  if (typeof action !== "string" || action.trim() === "") {
    errors.push({
      path: "action",
      issue: "A non-empty action string is required.",
    });
  } else if (!isPublicActionName(action)) {
    errors.push({
      path: "action",
      issue: `Unsupported public action: ${action}`,
    });
  }

  if (!isPlainObject(payload)) {
    errors.push({
      path: "payload",
      issue: "The payload must be a JSON object.",
    });
  }

  if (
    requestId !== undefined &&
    requestId !== null &&
    typeof requestId !== "string"
  ) {
    errors.push({
      path: "request_id",
      issue: "request_id must be a string when provided.",
    });
  }

  if (typeof requestId === "string" && requestId.length > 200) {
    errors.push({
      path: "request_id",
      issue: "request_id must not exceed 200 characters.",
    });
  }

  if (isPlainObject(payload)) {
    errors.push(...findProhibitedKeys(payload));
  }

  if (errors.length > 0) {
    const unknownAction = errors.some(
      (error) =>
        error.path === "action" &&
        error.issue.startsWith("Unsupported public action"),
    );
    const privacyRisk = errors.some((error) =>
      error.issue.includes("credential, secret, or prohibited sensitive field"),
    );

    return {
      valid: false,
      code: privacyRisk
        ? "PRIVACY_RISK"
        : unknownAction
          ? "UNKNOWN_ACTION"
          : "INVALID_REQUEST",
      message: privacyRisk
        ? "The request appears to contain a prohibited credential, secret, or sensitive field."
        : unknownAction
          ? "The requested public action is not supported."
          : "The request failed validation.",
      errors,
    };
  }

  return {
    valid: true,
    value: {
      action,
      payload,
      request_id: requestId ?? null,
    },
    errors: [],
  };
}
