import type { IdentityPort } from "@brendhouse/contracts";
/** UI simulation only: no accounts, cards, sessions, SMS or persisted phone data. */
export function createPreviewIdentity(
  now: () => number = Date.now,
): IdentityPort {
  let challenge: {
    id: string;
    expiresAt: number;
    retryAt: number;
    attempts: number;
  } | null = null;
  return {
    async request(phone) {
      if (process.env.NODE_ENV !== "development" || !/^\+994\d{9}$/.test(phone))
        return null;
      if (challenge && now() < challenge.retryAt) return null;
      challenge = {
        id: crypto.randomUUID(),
        expiresAt: now() + 120000,
        retryAt: now() + 30000,
        attempts: 0,
      };
      return {
        id: challenge.id,
        expiresAt: challenge.expiresAt,
        retryAt: challenge.retryAt,
      };
    },
    async verify(id, code) {
      if (process.env.NODE_ENV !== "development")
        return { kind: "error", code: "UNAVAILABLE" };
      if (!challenge || id !== challenge.id)
        return { kind: "error", code: "INVALID" };
      if (now() >= challenge.expiresAt)
        return { kind: "error", code: "EXPIRED" };
      if (challenge.attempts >= 5) return { kind: "error", code: "LOCKED" };
      challenge.attempts++;
      if (code !== "123456") return { kind: "error", code: "INVALID" };
      challenge = null;
      return { kind: "preview" };
    },
  };
}
