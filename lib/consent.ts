/* Shared consent model (Complianz-equivalent, first-party localStorage).
   Used by the global ConsentBanner and the /cookies ConsentPreferences
   widget so both read and write the same record + "hoy:consent" event. */

export type ConsentCategories = {
  functional: true;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
};

export const CONSENT_STORAGE_KEY = "hoy_consent_v1";

export const DEFAULT_CONSENT: ConsentCategories = {
  functional: true,
  preferences: false,
  statistics: false,
  marketing: false,
};

export const CONSENT_CATEGORIES: {
  key: keyof ConsentCategories;
  title: string;
  description: string;
  always?: boolean;
}[] = [
  {
    key: "functional",
    title: "Functional",
    always: true,
    description:
      "The technical storage or access is strictly necessary for the legitimate purpose of enabling the use of a specific service explicitly requested by the subscriber or user, or for the sole purpose of carrying out the transmission of a communication over an electronic communications network.",
  },
  {
    key: "preferences",
    title: "Preferences",
    description:
      "The technical storage or access is necessary for the legitimate purpose of storing preferences that are not requested by the subscriber or user.",
  },
  {
    key: "statistics",
    title: "Statistics",
    description:
      "The technical storage or access that is used exclusively for statistical purposes.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description:
      "The technical storage or access is required to create user profiles to send advertising, or to track the user on a website or across several websites for similar marketing purposes.",
  },
];

export function persistConsent(consent: ConsentCategories) {
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ...consent, at: Date.now() }));
  window.dispatchEvent(new CustomEvent("hoy:consent", { detail: consent }));
}

export function readConsent(): ConsentCategories | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return {
      functional: true,
      preferences: !!v.preferences,
      statistics: !!v.statistics,
      marketing: !!v.marketing,
    };
  } catch {
    return null;
  }
}

export function subscribeConsent(cb: () => void) {
  window.addEventListener("hoy:consent", cb);
  return () => window.removeEventListener("hoy:consent", cb);
}
