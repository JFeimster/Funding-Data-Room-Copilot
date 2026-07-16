export const BLOCKER = "Blocker";
export const FIX_BEFORE_SUBMISSION = "Fix Before Submission";
export const IMPROVE_IF_TIME_ALLOWS = "Improve If Time Allows";

export const READINESS_PRIORITIES = Object.freeze([
  BLOCKER,
  FIX_BEFORE_SUBMISSION,
  IMPROVE_IF_TIME_ALLOWS,
]);

export const READINESS_PRIORITY_DESCRIPTIONS = Object.freeze({
  [BLOCKER]:
    "The file should not be treated as ready for human submission review until the issue is resolved.",
  [FIX_BEFORE_SUBMISSION]:
    "The issue may cause delay, confusion, additional questions, or weaker presentation.",
  [IMPROVE_IF_TIME_ALLOWS]:
    "The improvement can strengthen clarity or handoff quality but is not essential to assembling the file.",
});

const READINESS_PRIORITY_SET = new Set(READINESS_PRIORITIES);

export function isReadinessPriority(value) {
  return typeof value === "string" && READINESS_PRIORITY_SET.has(value);
}
