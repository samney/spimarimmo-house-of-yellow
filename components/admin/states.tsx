import { Icon } from "./icons";

/* The four states every screen must be able to render (ADM-022, DoD "UX
   states"). Each is a real component rather than an ad-hoc div, so an empty
   list and a permission refusal never look accidentally identical. */

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="state">
      <span className="state__icon">{Icon.inbox({ size: 20 })}</span>
      <p className="state__title">{title}</p>
      <p className="state__body">{body}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Cette section n’a pas pu être chargée",
  body,
  action,
}: {
  title?: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon">{Icon.alert({ size: 20 })}</span>
      <p className="state__title">{title}</p>
      <p className="state__body">{body}</p>
      {action}
    </div>
  );
}

/** Shown when the actor is authenticated but lacks the permission. Never a
    blank screen and never a silent redirect: the operator must learn what is
    missing and who can grant it. */
export function PermissionState({
  permission,
  body = "Votre rôle ne donne pas accès à cette section. Un administrateur peut modifier vos autorisations.",
}: {
  permission: string;
  body?: string;
}) {
  return (
    <div className="state state--denied">
      <span className="state__icon">{Icon.lock({ size: 20 })}</span>
      <p className="state__title">Accès non autorisé</p>
      <p className="state__body">{body}</p>
      <p className="tertiary">
        Autorisation requise : <span className="mono">{permission}</span>
      </p>
    </div>
  );
}

/** Structural skeletons rather than a full-page spinner (blueprint 08 §19.3). */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="tableWrap" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div className="skeleton skeleton--row" key={i} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card" aria-hidden="true">
      <div className="skeleton skeleton--text" style={{ width: "40%" }} />
      <div className="skeleton skeleton--metric" />
    </div>
  );
}

/** Announced to assistive technology while a region loads. */
export function LoadingRegion({ label }: { label: string }) {
  return (
    <p className="sr-only" role="status" aria-live="polite">
      {label}
    </p>
  );
}
