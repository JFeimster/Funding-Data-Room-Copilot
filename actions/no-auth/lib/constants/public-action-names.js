export const BUILD_DATA_ROOM_PACKAGE = "build_data_room_package";
export const GENERATE_FOLDER_STRUCTURE = "generate_folder_structure";
export const GENERATE_DOCUMENT_CHECKLIST = "generate_document_checklist";
export const GENERATE_FILE_NAMING_RULES = "generate_file_naming_rules";
export const CREATE_MISSING_DOCUMENT_TRACKER = "create_missing_document_tracker";
export const GENERATE_DEAL_SNAPSHOT = "generate_deal_snapshot";
export const GENERATE_PRIVACY_CHECKLIST = "generate_privacy_checklist";
export const REWRITE_CONTEXT_NOTES = "rewrite_context_notes";
export const RUN_READINESS_QA_GATE = "run_readiness_qa_gate";

export const PUBLIC_ACTION_NAMES = Object.freeze([
  BUILD_DATA_ROOM_PACKAGE,
  GENERATE_FOLDER_STRUCTURE,
  GENERATE_DOCUMENT_CHECKLIST,
  GENERATE_FILE_NAMING_RULES,
  CREATE_MISSING_DOCUMENT_TRACKER,
  GENERATE_DEAL_SNAPSHOT,
  GENERATE_PRIVACY_CHECKLIST,
  REWRITE_CONTEXT_NOTES,
  RUN_READINESS_QA_GATE,
]);

const PUBLIC_ACTION_NAME_SET = new Set(PUBLIC_ACTION_NAMES);

export function isPublicActionName(value) {
  return typeof value === "string" && PUBLIC_ACTION_NAME_SET.has(value);
}
