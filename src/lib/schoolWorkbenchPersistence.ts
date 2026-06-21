import { extractUnknownSchoolOfficialDomain } from "./unknownSchoolEntryPack";

export const SCHOOL_WORKBENCH_STORAGE_PREFIX = "kankan-salary.school-workbench.v1";
export const SCHOOL_CANDIDATE_COMPARE_STORAGE_KEY = "kankan-salary.school-candidate-compare.v1";

const storageVersion = 1;
const manualEvidenceLimit = 12;
const candidateLimit = 4;

export type SchoolWorkbenchStorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
};

export type PersistedSchoolManualEvidenceKind = "major" | "report" | "campus" | "salary";

export type PersistedSchoolManualEvidenceItem = {
  id: string;
  kind: PersistedSchoolManualEvidenceKind;
  title: string;
  detail: string;
  url: string;
};

export type PersistedSchoolInfoCandidate = {
  key: string;
  schoolName: string;
  majorName: string;
  jobName: string;
  salaryLabel: string;
  marketGroup: string;
  evidenceScore: number;
  evidenceLabel: string;
  evidenceNote: string;
  confirmedEvidence: string[];
  missingEvidence: string[];
  companyNames: string[];
  requiredActions: string[];
  readinessTier?: "not-ready" | "can-screen" | "ready-to-compare";
  readinessTitle?: string;
  readinessAdvice?: string;
  readinessMissingKinds?: string[];
  aggregationStatusLabel?: string;
  aggregationConfirmedCount?: number;
  aggregationLeadCount?: number;
  aggregationWeakCount?: number;
  aggregationMissingSlots?: string[];
  aggregationNextAction?: string;
  nextEvidenceLabel?: string;
  nextEvidenceSource?: string;
  nextEvidenceDetail?: string;
  nextEvidenceUrl?: string;
  nextEvidenceSaveFields?: string[];
};

export type SchoolWorkbenchStorageSnapshot = {
  manualEvidenceItems: PersistedSchoolManualEvidenceItem[];
  officialDomain: string;
};

export type SchoolCandidateComparisonSnapshot = {
  candidates: PersistedSchoolInfoCandidate[];
};

export function getSchoolWorkbenchLocalStorage(): SchoolWorkbenchStorageLike | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function buildSchoolWorkbenchStorageKey({
  schoolName,
  majorName,
  jobName,
}: {
  schoolName: string;
  majorName: string;
  jobName: string;
}) {
  return [
    SCHOOL_WORKBENCH_STORAGE_PREFIX,
    normalizeStorageScope(schoolName, "目标学校"),
    normalizeStorageScope(majorName, "未填专业"),
    normalizeStorageScope(jobName, "未填岗位"),
  ].join("::");
}

export function readSchoolWorkbenchStorageSnapshot(
  storage: SchoolWorkbenchStorageLike | null,
  key: string,
): SchoolWorkbenchStorageSnapshot {
  if (!storage) return emptyWorkbenchSnapshot();

  try {
    return sanitizeWorkbenchSnapshot(JSON.parse(storage.getItem(key) ?? "null"));
  } catch {
    return emptyWorkbenchSnapshot();
  }
}

export function writeSchoolWorkbenchStorageSnapshot(
  storage: SchoolWorkbenchStorageLike | null,
  key: string,
  snapshot: SchoolWorkbenchStorageSnapshot,
) {
  if (!storage) return;

  try {
    const safeSnapshot = sanitizeWorkbenchSnapshot(snapshot);
    storage.setItem(key, JSON.stringify({ version: storageVersion, ...safeSnapshot }));
  } catch {
    // localStorage may be disabled or full. The page should still work in memory.
  }
}

export function readSchoolCandidateComparisonSnapshot(
  storage: SchoolWorkbenchStorageLike | null,
): SchoolCandidateComparisonSnapshot {
  if (!storage) return { candidates: [] };

  try {
    return sanitizeCandidateComparisonSnapshot(JSON.parse(storage.getItem(SCHOOL_CANDIDATE_COMPARE_STORAGE_KEY) ?? "null"));
  } catch {
    return { candidates: [] };
  }
}

export function writeSchoolCandidateComparisonSnapshot(
  storage: SchoolWorkbenchStorageLike | null,
  snapshot: SchoolCandidateComparisonSnapshot,
) {
  if (!storage) return;

  try {
    const safeSnapshot = sanitizeCandidateComparisonSnapshot(snapshot);
    storage.setItem(SCHOOL_CANDIDATE_COMPARE_STORAGE_KEY, JSON.stringify({ version: storageVersion, ...safeSnapshot }));
  } catch {
    // localStorage may be disabled or full. The page should still work in memory.
  }
}

function sanitizeWorkbenchSnapshot(input: unknown): SchoolWorkbenchStorageSnapshot {
  const record = isRecord(input) ? input : {};
  return {
    manualEvidenceItems: Array.isArray(record.manualEvidenceItems)
      ? record.manualEvidenceItems.map(sanitizeManualEvidenceItem).filter(isPersistedManualEvidenceItem).slice(0, manualEvidenceLimit)
      : [],
    officialDomain: extractUnknownSchoolOfficialDomain(toText(record.officialDomain)),
  };
}

function sanitizeCandidateComparisonSnapshot(input: unknown): SchoolCandidateComparisonSnapshot {
  const record = isRecord(input) ? input : {};
  return {
    candidates: Array.isArray(record.candidates)
      ? record.candidates.map(sanitizeCandidate).filter(isPersistedCandidate).slice(0, candidateLimit)
      : [],
  };
}

function sanitizeManualEvidenceItem(input: unknown): PersistedSchoolManualEvidenceItem | null {
  if (!isRecord(input) || !isManualEvidenceKind(input.kind)) return null;

  return {
    id: toText(input.id),
    kind: input.kind,
    title: toText(input.title),
    detail: toText(input.detail),
    url: toText(input.url),
  };
}

function sanitizeCandidate(input: unknown): PersistedSchoolInfoCandidate | null {
  if (!isRecord(input)) return null;
  const key = toText(input.key);
  const schoolName = toText(input.schoolName);
  if (!key || !schoolName) return null;

  return {
    key,
    schoolName,
    majorName: toText(input.majorName),
    jobName: toText(input.jobName),
    salaryLabel: toText(input.salaryLabel),
    marketGroup: toText(input.marketGroup),
    evidenceScore: toBoundedScore(input.evidenceScore),
    evidenceLabel: toText(input.evidenceLabel),
    evidenceNote: toText(input.evidenceNote),
    confirmedEvidence: toStringArray(input.confirmedEvidence, 8),
    missingEvidence: toStringArray(input.missingEvidence, 8),
    companyNames: toStringArray(input.companyNames, 8),
    requiredActions: toStringArray(input.requiredActions, 8),
    readinessTier: isReadinessTier(input.readinessTier) ? input.readinessTier : undefined,
    readinessTitle: toOptionalText(input.readinessTitle),
    readinessAdvice: toOptionalText(input.readinessAdvice),
    readinessMissingKinds: toOptionalStringArray(input.readinessMissingKinds, 8),
    aggregationStatusLabel: toOptionalText(input.aggregationStatusLabel),
    aggregationConfirmedCount: toOptionalCount(input.aggregationConfirmedCount),
    aggregationLeadCount: toOptionalCount(input.aggregationLeadCount),
    aggregationWeakCount: toOptionalCount(input.aggregationWeakCount),
    aggregationMissingSlots: toOptionalStringArray(input.aggregationMissingSlots, 8),
    aggregationNextAction: toOptionalText(input.aggregationNextAction),
    nextEvidenceLabel: toOptionalText(input.nextEvidenceLabel),
    nextEvidenceSource: toOptionalText(input.nextEvidenceSource),
    nextEvidenceDetail: toOptionalText(input.nextEvidenceDetail),
    nextEvidenceUrl: toOptionalText(input.nextEvidenceUrl),
    nextEvidenceSaveFields: toOptionalStringArray(input.nextEvidenceSaveFields, 8),
  };
}

function emptyWorkbenchSnapshot(): SchoolWorkbenchStorageSnapshot {
  return {
    manualEvidenceItems: [],
    officialDomain: "",
  };
}

function normalizeStorageScope(value: string, fallback: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 80) || fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isManualEvidenceKind(value: unknown): value is PersistedSchoolManualEvidenceKind {
  return value === "major" || value === "report" || value === "campus" || value === "salary";
}

function isReadinessTier(value: unknown): value is PersistedSchoolInfoCandidate["readinessTier"] {
  return value === "not-ready" || value === "can-screen" || value === "ready-to-compare";
}

function isPersistedManualEvidenceItem(value: PersistedSchoolManualEvidenceItem | null): value is PersistedSchoolManualEvidenceItem {
  return Boolean(value && value.id && (value.title || value.detail || value.url));
}

function isPersistedCandidate(value: PersistedSchoolInfoCandidate | null): value is PersistedSchoolInfoCandidate {
  return Boolean(value && value.key && value.schoolName);
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 800) : "";
}

function toOptionalText(value: unknown) {
  const text = toText(value);
  return text || undefined;
}

function toStringArray(value: unknown, limit: number) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim().slice(0, 240)).slice(0, limit)
    : [];
}

function toOptionalStringArray(value: unknown, limit: number) {
  const items = toStringArray(value, limit);
  return items.length ? items : undefined;
}

function toBoundedScore(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;
}

function toOptionalCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.round(value)) : undefined;
}
