import type { ID } from "../../../lib/types/common";

function normalizePrefix(prefix: string): string {
  return prefix.trim().replace(/\s+/g, "_").toLowerCase();
}

export function createId(prefix = "id"): ID {
  const safePrefix = normalizePrefix(prefix);
  const randomPart = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  return `${safePrefix}_${randomPart}`;
}

export function createIsoTimestamp(): string {
  return new Date().toISOString();
}
