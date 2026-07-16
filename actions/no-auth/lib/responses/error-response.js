const API_VERSION = "1.0.0";

export const ERROR_STATUS_BY_CODE = Object.freeze({
  METHOD_NOT_ALLOWED: 405,
  INVALID_JSON: 400,
  INVALID_REQUEST: 400,
  UNKNOWN_ACTION: 400,
  INVALID_PAYLOAD: 400,
  PAYLOAD_TOO_LARGE: 413,
  PRIVACY_RISK: 400,
  INTERNAL_ERROR: 500,
});

export function getErrorStatus(code) {
  return ERROR_STATUS_BY_CODE[code] ?? 500;
}

export function createErrorResponse({
  action,
  code = "INTERNAL_ERROR",
  message = "The request could not be completed.",
  details = [],
  requestId,
  humanReviewRequired = false,
  meta = {},
} = {}) {
  return {
    ok: false,
    action: action ?? null,
    error: {
      code,
      message,
      details: Array.isArray(details) ? details : [String(details)],
    },
    human_review_required: Boolean(humanReviewRequired),
    request_id: requestId ?? null,
    meta: {
      version: API_VERSION,
      ...meta,
    },
  };
}
