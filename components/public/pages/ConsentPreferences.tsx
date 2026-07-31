"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_CATEGORIES,
  DEFAULT_CONSENT,
  persistConsent,
  readConsent,
  subscribeConsent,
  type ConsentCategories,
} from "@/lib/consent";

/* /cookies section 7.1 — the reference embeds Complianz's live
   consent-management widget here (#cmplz-manage-consent-container): category
   rows with toggle switches (functional always active) and expandable
   descriptions. Ours binds to the shared consent record, applying changes
   immediately like the original. */
export function ConsentPreferences() {
  const [consent, setConsent] = useState<ConsentCategories>(DEFAULT_CONSENT);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setConsent(readConsent() ?? DEFAULT_CONSENT);
    sync();
    return subscribeConsent(sync);
  }, []);

  const toggle = (key: keyof ConsentCategories, value: boolean) => {
    const next = { ...consent, [key]: value, functional: true as const };
    setConsent(next);
    persistConsent(next);
  };

  return (
    <div id="cmplz-manage-consent-container" className="cmplz-manage-consent-container">
      <div className="cmplz-categories">
        {CONSENT_CATEGORIES.map((cat) => (
          <div className={`cmplz-category cmplz-${cat.key}`} key={cat.key}>
            <div className="cmplz-category-header">
              <span className="cmplz-category-title">{cat.title}</span>
              {cat.always ? (
                <span className="cmplz-always-active">Always active</span>
              ) : (
                <span className="cmplz-banner-checkbox">
                  <input
                    type="checkbox"
                    id={`cmplz-${cat.key}-optin`}
                    className="cmplz-consent-checkbox"
                    checked={consent[cat.key] as boolean}
                    onChange={(e) => toggle(cat.key, e.target.checked)}
                  />
                  <label className="cmplz-label" htmlFor={`cmplz-${cat.key}-optin`}>
                    <span className="sr-only">{cat.title}</span>
                  </label>
                </span>
              )}
              <button
                className="cmplz-category-toggle"
                aria-expanded={open === cat.key}
                onClick={() => setOpen(open === cat.key ? null : cat.key)}
                aria-label={`Toggle ${cat.title} description`}
              >
                ▾
              </button>
            </div>
            {open === cat.key && <div className="cmplz-description">{cat.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
