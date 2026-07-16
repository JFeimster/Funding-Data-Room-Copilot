const API_VERSION = "1.0.0";

export function createSuccessResponse({
  action,
  data = {},
  warnings = [],
  humanReviewRequired = true,
  requestId,
  meta = {},
} = {}) {
  return {
    ok: true,
    action: action ?? null,
    data,
    warnings: Array.isArray(warnings) ? warnings : [String(warnings)],
    human_review_required: Boolean(humanReviewRequired),
    request_id: requestId ?? null,
    meta: {
      version: API_VERSION,
      ...meta,
    },
  };
}
