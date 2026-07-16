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
} from "../../actions/no-auth/constants/public-action-names.js";

import { createSuccessResponse } from "../../actions/shared/responses/success-response.js";
import {
  createErrorResponse,
  getErrorStatus,
} from "../../actions/shared/responses/error-response.js";
import { validateActionRequest } from "../../actions/shared/validation/validate-action-request.js";
import { validatePublicPayload } from "../../actions/no-auth/validation/validate-public-payload.js";

import { buildDataRoomPackage } from "../../actions/no-auth/modules/build-data-room-package.js";
import { generateFolderStructure } from "../../actions/no-auth/modules/generate-folder-structure.js";
import { generateDocumentChecklist } from "../../actions/no-auth/modules/generate-document-checklist.js";
import { generateFileNamingRules } from "../../actions/no-auth/modules/generate-file-naming-rules.js";
import { createMissingDocumentTracker } from "../../actions/no-auth/modules/create-missing-document-tracker.js";
import { generateDealSnapshot } from "../../actions/no-auth/modules/generate-deal-snapshot.js";
import { generatePrivacyChecklist } from "../../actions/no-auth/modules/generate-privacy-checklist.js";
import { rewriteContextNotes } from "../../actions/no-auth/modules/rewrite-context-notes.js";
import { runReadinessQaGate } from "../../actions/no-auth/modules/run-readiness-qa-gate.js";

const MAX_JSON_BYTES = 128 * 1024;
const ALLOWED_METHODS = Object.freeze(["POST", "OPTIONS"]);

const ACTION_HANDLERS = Object.freeze(
  new Map([
    [BUILD_DATA_ROOM_PACKAGE, buildDataRoomPackage],
    [GENERATE_FOLDER_STRUCTURE, generateFolderStructure],
    [GENERATE_DOCUMENT_CHECKLIST, generateDocumentChecklist],
    [GENERATE_FILE_NAMING_RULES, generateFileNamingRules],
    [CREATE_MISSING_DOCUMENT_TRACKER, createMissingDocumentTracker],
    [GENERATE_DEAL_SNAPSHOT, generateDealSnapshot],
    [GENERATE_PRIVACY_CHECKLIST, generatePrivacyChecklist],
    [REWRITE_CONTEXT_NOTES, rewriteContextNotes],
    [RUN_READINESS_QA_GATE, runReadinessQaGate],
  ]),
);

class PublicActionError extends Error {
  constructor(code, message, details = [], action = null, requestId = null) {
    super(message);
    this.name = "PublicActionError";
    this.code = code;
    this.details = Array.isArray(details) ? details : [details];
    this.action = action;
    this.requestId = requestId;
  }
}

function byteLength(value) {
  return Buffer.byteLength(value, "utf8");
}

function resolveCorsOrigin(req) {
  const configuredOrigin = String(process.env.ALLOWED_ORIGIN ?? "").trim();
  const requestOrigin = String(req.headers?.origin ?? "").trim();

  if (configuredOrigin) {
    return requestOrigin === configuredOrigin || !requestOrigin
      ? configuredOrigin
      : configuredOrigin;
  }

  return "*";
}

function setCommonHeaders(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Access-Control-Allow-Origin", resolveCorsOrigin(req));
  res.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS.join(", "));
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Request-ID");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader("Vary", "Origin");
}

function sendJson(req, res, status, body) {
  setCommonHeaders(req, res);
  res.statusCode = status;

  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(status).json(body);
  }

  return res.end(JSON.stringify(body));
}

function throwIfPayloadTooLarge(serializedLength) {
  if (serializedLength > MAX_JSON_BYTES) {
    throw new PublicActionError(
      "PAYLOAD_TOO_LARGE",
      `The JSON request exceeds the ${MAX_JSON_BYTES}-byte public action limit.`,
      [
        {
          maximum_bytes: MAX_JSON_BYTES,
          received_bytes: serializedLength,
          guidance:
            "Send document metadata and summaries only. Do not send binary files or base64 document content.",
        },
      ],
    );
  }
}

async function readStreamBody(req) {
  const chunks = [];
  let receivedBytes = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    receivedBytes += buffer.length;
    throwIfPayloadTooLarge(receivedBytes);
    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function readJsonBody(req) {
  const contentLength = Number(req.headers?.["content-length"] ?? 0);

  if (Number.isFinite(contentLength) && contentLength > 0) {
    throwIfPayloadTooLarge(contentLength);
  }

  if (req.body !== undefined && req.body !== null) {
    if (Buffer.isBuffer(req.body)) {
      throwIfPayloadTooLarge(req.body.length);
      try {
        return JSON.parse(req.body.toString("utf8"));
      } catch {
        throw new PublicActionError(
          "INVALID_JSON",
          "The request body is not valid JSON.",
        );
      }
    }

    if (typeof req.body === "string") {
      throwIfPayloadTooLarge(byteLength(req.body));
      try {
        return JSON.parse(req.body);
      } catch {
        throw new PublicActionError(
          "INVALID_JSON",
          "The request body is not valid JSON.",
        );
      }
    }

    if (typeof req.body === "object") {
      const serialized = JSON.stringify(req.body);
      throwIfPayloadTooLarge(byteLength(serialized));
      return req.body;
    }

    throw new PublicActionError(
      "INVALID_REQUEST",
      "The request body must be a JSON object.",
    );
  }

  const rawBody = await readStreamBody(req);

  if (!rawBody.trim()) {
    throw new PublicActionError(
      "INVALID_REQUEST",
      "A JSON request body is required.",
    );
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new PublicActionError(
      "INVALID_JSON",
      "The request body is not valid JSON.",
    );
  }
}

function buildValidationError(validation, action, requestId) {
  return new PublicActionError(
    validation.code ?? "INVALID_REQUEST",
    validation.message ?? "The request failed validation.",
    validation.errors ?? [],
    action,
    requestId,
  );
}

export default async function handler(req, res) {
  const method = String(req.method ?? "").toUpperCase();

  if (method === "OPTIONS") {
    setCommonHeaders(req, res);
    res.statusCode = 204;
    return res.end();
  }

  if (method !== "POST") {
    res.setHeader("Allow", ALLOWED_METHODS.join(", "));
    return sendJson(
      req,
      res,
      405,
      createErrorResponse({
        code: "METHOD_NOT_ALLOWED",
        message: "Use POST to run a public action.",
        details: [{ allowed_methods: ALLOWED_METHODS }],
      }),
    );
  }

  let action = null;
  let requestId = null;

  try {
    const input = await readJsonBody(req);
    action = typeof input?.action === "string" ? input.action : null;
    requestId =
      typeof input?.request_id === "string" ? input.request_id : null;

    const requestValidation = validateActionRequest(input);
    if (!requestValidation.valid) {
      throw buildValidationError(
        requestValidation,
        action,
        requestId,
      );
    }

    const payloadValidation = validatePublicPayload(
      requestValidation.value.action,
      requestValidation.value.payload,
    );
    if (!payloadValidation.valid) {
      throw buildValidationError(
        payloadValidation,
        requestValidation.value.action,
        requestValidation.value.request_id,
      );
    }

    const actionHandler = ACTION_HANDLERS.get(
      requestValidation.value.action,
    );

    if (typeof actionHandler !== "function") {
      throw new PublicActionError(
        "UNKNOWN_ACTION",
        "The requested public action is not supported.",
        [],
        requestValidation.value.action,
        requestValidation.value.request_id,
      );
    }

    const data = await Promise.resolve(
      actionHandler(payloadValidation.value),
    );

    const warnings = [
      ...(payloadValidation.warnings ?? []),
      ...(Array.isArray(data?.warnings) ? data.warnings : []),
    ];

    return sendJson(
      req,
      res,
      200,
      createSuccessResponse({
        action: requestValidation.value.action,
        data,
        warnings: [...new Set(warnings)],
        humanReviewRequired:
          data?.human_review_required !== false,
        requestId: requestValidation.value.request_id,
      }),
    );
  } catch (error) {
    const knownError = error instanceof PublicActionError;
    const code = knownError ? error.code : "INTERNAL_ERROR";
    const status = getErrorStatus(code);

    return sendJson(
      req,
      res,
      status,
      createErrorResponse({
        action: knownError ? error.action ?? action : action,
        code,
        message: knownError
          ? error.message
          : "The public action could not be completed.",
        details: knownError ? error.details : [],
        requestId: knownError ? error.requestId ?? requestId : requestId,
        humanReviewRequired: code === "PRIVACY_RISK",
      }),
    );
  }
}
