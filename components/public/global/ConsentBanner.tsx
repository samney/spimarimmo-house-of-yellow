"use client";

import { useState, useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import {
  CONSENT_CATEGORIES as CATEGORIES,
  CONSENT_STORAGE_KEY as STORAGE_KEY,
  persistConsent as persist,
  subscribeConsent as subscribeToConsent,
  type ConsentCategories,
} from "@/lib/consent";

/* Consent UI replicating the reference's Complianz opt-in banner: bottom-right
   dialog, Accept / Deny / View preferences, four categories with toggles
   (functional always active). State is a first-party cookie-free localStorage
   record; a "hoy:consent" event lets consumers (analytics, embeds) react.
   The reference ships mixed EN/NL strings; we render locale-consistent EN
   (FR via messages in HOY-110) — recorded in DECISIONS. Shared model in
   lib/consent.ts (also drives the /cookies preferences widget). */

export type { ConsentCategories };

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
          onClick={() =>
            close({ functional: true, preferences: false, statistics: false, marketing: false })
          }
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
          onClick={() =>
            close({ functional: true, preferences: true, statistics: true, marketing: true })
          }
        >
          Accept
        </button>
        <button
          className="cmplz-btn cmplz-deny"
          onClick={() =>
            close({ functional: true, preferences: false, statistics: false, marketing: false })
          }
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
