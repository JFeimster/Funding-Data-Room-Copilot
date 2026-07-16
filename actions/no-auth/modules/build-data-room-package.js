import { generateFolderStructure } from "./generate-folder-structure.js";
import { generateDocumentChecklist } from "./generate-document-checklist.js";
import { generateFileNamingRules } from "./generate-file-naming-rules.js";
import { createMissingDocumentTracker } from "./create-missing-document-tracker.js";
import { generateDealSnapshot } from "./generate-deal-snapshot.js";
import { generatePrivacyChecklist } from "./generate-privacy-checklist.js";
import { rewriteContextNotes } from "./rewrite-context-notes.js";
import { runReadinessQaGate } from "./run-readiness-qa-gate.js";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function gatherWarnings(...sources) {
  const values = [];

  sources.forEach((source) => {
    if (!source || typeof source !== "object") return;

    normalizeArray(source.warnings).forEach((warning) => {
      if (typeof warning === "string") values.push(warning);
    });

    normalizeArray(source.limitations).forEach((warning) => {
      if (typeof warning === "string") values.push(warning);
    });
  });

  return [...new Set(values)];
}

function buildNextActions({
  privacyChecklist,
  tracker,
  dealSnapshot,
  readinessQa,
}) {
  const actions = [];

  normalizeArray(readinessQa.blockers).forEach((gap) => {
    actions.push({
      priority: gap.priority,
      action: gap.next_action,
      owner: gap.suggested_owner,
      source: "readiness_qa",
      human_review_required: true,
    });
  });

  normalizeArray(readinessQa.fix_before_submission).forEach((gap) => {
    actions.push({
      priority: gap.priority,
      action: gap.next_action,
      owner: gap.suggested_owner,
      source: "readiness_qa",
      human_review_required: true,
    });
  });

  normalizeArray(tracker.rows)
    .filter((row) => row.status !== "Received")
    .forEach((row) => {
      actions.push({
        priority: row.priority,
        action: row.next_action,
        owner: row.owner,
        source: "missing_document_tracker",
        human_review_required: row.human_review_required,
      });
    });

  if (privacyChecklist.stop_processing) {
    actions.unshift({
      priority: "Blocker",
      action:
        "Stop processing the affected data until an authorized human resolves the privacy issue.",
      owner: "Authorized privacy or system owner",
      source: "privacy_checklist",
      human_review_required: true,
    });
  }

  if (dealSnapshot.focused_question) {
    actions.unshift({
      priority: "Blocker",
      action: dealSnapshot.focused_question.question,
      owner: "Business owner or authorized reviewer",
      source: "deal_snapshot",
      human_review_required: true,
    });
  }

  const seen = new Set();
  return actions.filter((item) => {
    const key = `${item.priority}::${item.action}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 12);
}

export function buildDataRoomPackage(payload = {}) {
  const folderStructure = generateFolderStructure(payload);
  const documentChecklist = generateDocumentChecklist(payload);
  const fileNamingRules = generateFileNamingRules({
    ...payload,
    current_file_names: Array.isArray(payload.current_file_names)
      ? payload.current_file_names
      : [],
  });
  const missingDocumentTracker = createMissingDocumentTracker(payload);
  const privacyChecklist = generatePrivacyChecklist(payload);
  const contextNotes = Array.isArray(payload.revenue_context) &&
    payload.revenue_context.length > 0
    ? rewriteContextNotes(payload)
    : {
        title: `Revenue and Cash-Flow Context Notes — ${
          payload.business_name ?? "Business Name"
        }`,
        notes: [],
        global_constraints: [
          "Do not exaggerate or conceal negative information.",
          "Do not predict approval.",
        ],
        warnings: ["No context events were supplied."],
        human_review_required: true,
      };
  const dealSnapshot = generateDealSnapshot({
    ...payload,
    privacy_checklist: privacyChecklist,
    context_notes: contextNotes,
  });
  const readinessQa = runReadinessQaGate({
    ...payload,
    folder_structure: folderStructure,
    file_naming_rules: fileNamingRules,
    privacy_checklist: privacyChecklist,
    context_notes: contextNotes,
    deal_snapshot: dealSnapshot,
    readiness_gaps: [
      ...normalizeArray(payload.readiness_gaps),
      ...normalizeArray(dealSnapshot.readiness_gaps),
      ...normalizeArray(privacyChecklist.privacy_blockers),
    ],
  });

  const nextBestActions = buildNextActions({
    privacyChecklist,
    tracker: missingDocumentTracker,
    dealSnapshot,
    readinessQa,
  });

  const warnings = gatherWarnings(
    folderStructure,
    documentChecklist,
    fileNamingRules,
    missingDocumentTracker,
    privacyChecklist,
    contextNotes,
    dealSnapshot,
    readinessQa,
  );

  return {
    package_summary: {
      package_name: folderStructure.package_name,
      business_name: folderStructure.business_name,
      business_type: folderStructure.normalized_business_type,
      user_role: folderStructure.user_role,
      requested_amount: payload.requested_amount ?? null,
      minimum_useful_amount: payload.minimum_useful_amount ?? null,
      funding_purpose: payload.funding_purpose ?? null,
      qa_classification: readinessQa.classification,
      blocker_count: readinessQa.pass_hold_summary.blocker_count,
      fix_before_submission_count:
        readinessQa.pass_hold_summary.fix_before_submission_count,
      improve_if_time_allows_count:
        readinessQa.pass_hold_summary.improve_if_time_allows_count,
    },
    folder_structure: folderStructure,
    document_checklist: documentChecklist,
    file_naming_rules: fileNamingRules,
    missing_document_tracker: missingDocumentTracker,
    deal_snapshot: dealSnapshot,
    privacy_checklist: privacyChecklist,
    context_notes: contextNotes,
    readiness_qa: readinessQa,
    warnings,
    next_best_actions: nextBestActions,
    human_review_required: true,
    final_reminder:
      "Final review still needs a human. Clean organization helps the file, but it does not guarantee approval.",
  };
}

export default buildDataRoomPackage;
