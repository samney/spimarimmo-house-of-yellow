"use client";

import { useState, useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";

/* Consent UI replicating the reference's Complianz opt-in banner: bottom-right
   dialog, Accept / Deny / View preferences, four categories with toggles
   (functional always active). State is a first-party cookie-free localStorage
   record; a "hoy:consent" event lets consumers (analytics, embeds) react.
   The reference ships mixed EN/NL strings; we render locale-consistent EN
   (FR via messages in HOY-110) — recorded in DECISIONS. */

export type ConsentCategories = {
  functional: true;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "hoy_consent_v1";

const CATEGORIES: {
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
    description: "The technical storage or access that is used exclusively for statistical purposes.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description:
      "The technical storage or access is required to create user profiles to send advertising, or to track the user on a website or across several websites for similar marketing purposes.",
  },
];

function persist(consent: ConsentCategories) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consent, at: Date.now() }));
  window.dispatchEvent(new CustomEvent("hoy:consent", { detail: consent }));
}

function subscribeToConsent(cb: () => void) {
  window.addEventListener("hoy:consent", cb);
  return () => window.removeEventListener("hoy:consent", cb);
}

export function ConsentBanner() {
  // Server snapshot pretends consent exists so the banner never renders during
  // SSR; the client snapshot reads the real stored state after hydration.
  const hasStoredConsent = useSyncExternalStore(
    subscribeToConsent,
    () => localStorage.getItem(STORAGE_KEY) !== null,
    () => true,
  );
  const [showPrefs, setShowPrefs] = useState(false);
  const [openDesc, setOpenDesc] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<ConsentCategories>({
    functional: true,
    preferences: false,
    statistics: false,
    marketing: false,
  });

  if (hasStoredConsent) return null;

  const close = (consent: ConsentCategories) => {
    persist(consent);
  };

  return (
    <div
      className="cmplz-cookiebanner hoy-consent"
      role="dialog"
      aria-modal="false"
      aria-live="polite"
      aria-labelledby="hoy-consent-title"
      aria-describedby="hoy-consent-message"
    >
      <div className="cmplz-header">
        <div className="cmplz-title" id="hoy-consent-title">
          Manage Consent
        </div>
        <button
          className="cmplz-close"
          aria-label="Close dialog"
          onClick={() => close({ functional: true, preferences: false, statistics: false, marketing: false })}
        >
          ×
        </button>
      </div>
      <div className="cmplz-body">
        <div className="cmplz-message" id="hoy-consent-message">
          To provide the best experiences, we use technologies like cookies to store and/or access
          device information. Consenting to these technologies will allow us to process data such as
          browsing behavior or unique IDs on this site. Not consenting or withdrawing consent, may
          adversely affect certain features and functions.
        </div>
        {showPrefs && (
          <div className="cmplz-categories">
            {CATEGORIES.map((cat) => (
              <div className={`cmplz-category cmplz-${cat.key}`} key={cat.key}>
                <div className="cmplz-category-header">
                  <span className="cmplz-category-title">{cat.title}</span>
                  {cat.always ? (
                    <span className="cmplz-always-active">Always active</span>
                  ) : (
                    <span className="cmplz-banner-checkbox">
                      <input
                        type="checkbox"
                        id={`hoy-consent-${cat.key}`}
                        checked={prefs[cat.key] as boolean}
                        onChange={(e) => setPrefs((p) => ({ ...p, [cat.key]: e.target.checked }))}
                      />
                      <label htmlFor={`hoy-consent-${cat.key}`}>
                        <span className="sr-only">{cat.title}</span>
                      </label>
                    </span>
                  )}
                  <button
                    className="cmplz-category-toggle"
                    aria-expanded={openDesc === cat.key}
                    onClick={() => setOpenDesc(openDesc === cat.key ? null : cat.key)}
                    aria-label={`Toggle ${cat.title} description`}
                  >
                    ▾
                  </button>
                </div>
                {openDesc === cat.key && <div className="cmplz-description">{cat.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="cmplz-buttons">
        <button
          className="cmplz-btn cmplz-accept"
          onClick={() => close({ functional: true, preferences: true, statistics: true, marketing: true })}
        >
          Accept
        </button>
        <button
          className="cmplz-btn cmplz-deny"
          onClick={() => close({ functional: true, preferences: false, statistics: false, marketing: false })}
        >
          Deny
        </button>
        {!showPrefs ? (
          <button className="cmplz-btn cmplz-view-preferences" onClick={() => setShowPrefs(true)}>
            View preferences
          </button>
        ) : (
          <button className="cmplz-btn cmplz-save-preferences" onClick={() => close(prefs)}>
            Save preferences
          </button>
        )}
      </div>
      <div className="cmplz-documents">
        <Link className="cmplz-link" href="/cookies">
          Cookies
        </Link>
      </div>
    </div>
  );
}
