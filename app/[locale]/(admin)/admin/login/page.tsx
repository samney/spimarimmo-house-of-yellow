"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/cms";
import { SpimarMark } from "@/components/admin/icons";

/* Sign-in (ADM-038, VISUAL_02).

   Failures return one message for both unknown user and wrong password — never
   disclose which was wrong. */
export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div className="gate__panel">
      <div className="gate__brand">
        <SpimarMark size={30} />
        <span className="sidebar__wordmark">
          SPIMAR
          <span>IMMO</span>
        </span>
      </div>

      <h1 style={{ fontSize: 28 }}>SPIMAR Control</h1>
      <p className="lede" style={{ marginBlockEnd: 28 }}>
        Accès à la console d’administration, au CRM et au CMS.
      </p>

      {state && !state.ok ? (
        <div className="notice notice--error" role="alert" style={{ marginBlockEnd: 20 }}>
          {state.message}
        </div>
      ) : null}

      <form className="form" action={action}>
        <div className="field">
          <label className="field__label" htmlFor="email">
            E-mail
          </label>
          <input
            className="input"
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="password">
            Mot de passe
          </label>
          <input
            className="input"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
