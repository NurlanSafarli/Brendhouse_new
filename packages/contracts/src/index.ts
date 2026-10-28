export type Locale = "az" | "ru" | "en";
export type Verification = "UNVERIFIED" | "VERIFIED";
export type Publication = "DRAFT" | "PUBLISHED";
/** Money is stored and transmitted as integer qəpik, never floating point AZN. */
export type Money = { amount: number; currency: "AZN" };
