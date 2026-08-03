"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/cms";

/* Sign-in. Failures return one message for both unknown user and wrong
   password — never disclose which was wrong. */
export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <>
      <p className="adminGate__brand">
        SPIMAR<span>IMMO</span>
      </p>
      <p className="adminGate__tag">Operations</p>
      <h1>Sign in</h1>
      <p className="adminLede" style={{ marginBottom: "1.5rem" }}>
        Access to the SPIMARIMMO CMS and CRM.
      </p>

      {state && !state.ok ? (
        <div className="adminNotice adminNotice--error" role="alert">
          {state.message}
        </div>
      ) : null}

      <form className="adminForm" action={action}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <div>
          <button className="adminButton adminButton--primary" type="submit" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </>
  );
}
