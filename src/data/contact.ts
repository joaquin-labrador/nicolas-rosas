export const CONTACT_REASONS = [
  "sport",
  "scouting",
  "representation",
  "press",
] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];
export interface ContactFields {
  name: string;
  club: string;
  email: string;
  reason: ContactReason;
  message: string;
}
export const EMPTY_CONTACT: ContactFields = {
  name: "",
  club: "",
  email: "",
  reason: "sport",
  message: "",
};
export const CONTACT_LIMITS = {
  name: 100,
  club: 120,
  email: 160,
  message: 2500,
} as const;
