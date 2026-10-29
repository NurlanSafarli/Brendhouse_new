/** Server implementations must enforce OTP expiration, rate limits and single use.
 * A preview result never confers an authenticated session or loyalty balance. */
export type Challenge = { id: string; expiresAt: number; retryAt: number };
export type OtpResult =
  | { kind: "preview" }
  | { kind: "error"; code: "INVALID" | "EXPIRED" | "LOCKED" | "UNAVAILABLE" };
export interface IdentityPort {
  request(phone: string): Promise<Challenge | null>;
  verify(id: string, code: string): Promise<OtpResult>;
}
