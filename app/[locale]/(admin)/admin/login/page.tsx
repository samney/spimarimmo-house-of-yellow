"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/actions/cms";
import { SpimarMark } from "@/components/admin/icons";

/* Sign-in (ADM-038, VISUAL_02).

   Failures return one message for both unknown user and wrong password — never
   disclose which was wrong. */
export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  /* `?expired=1` is set by the route guard when a session timed out. Saying so
     is the point: an operator who was working should learn why they are back
     at sign-in rather than assume the console lost their work. */
  const expired = useSearchParams().get("expired") === "1";

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

      {expired && !state ? (
        <div className="notice notice--warning" role="status" style={{ marginBlockEnd: 20 }}>
          Votre session a expiré après huit heures d’inactivité. Reconnectez-vous pour reprendre —
          rien de ce que vous avez enregistré n’a été perdu.
        </div>
      ) : null}

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
