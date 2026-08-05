import Link from "next/link";
import { Icon } from "./icons";

/* Page header: breadcrumb, title, lede and page-level actions.

   Used by every admin screen so the vertical rhythm above the content is
   identical across the console. */

export function PageHeader({
  breadcrumb,
  title,
  lede,
  actions,
  back,
}: {
  breadcrumb?: readonly { label: string; href?: string }[];
  title: string;
  lede?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <>
      {back ? (
        <Link href={back.href} className="btn btn--ghost btn--sm" style={{ marginInlineStart: -8 }}>
          {Icon.arrowBack({ size: 15 })}
          {back.label}
        </Link>
      ) : null}

      <div className="pageHead">
        <div className="pageHead__text">
          {breadcrumb && breadcrumb.length > 0 ? (
            <nav className="breadcrumb" aria-label="Fil d’Ariane">
              {breadcrumb.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="cluster" style={{ gap: 8 }}>
                  {index > 0 ? Icon.chevronEnd({ size: 12 }) : null}
                  {crumb.href ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          ) : null}
          <h1>{title}</h1>
          {lede ? <p className="lede">{lede}</p> : null}
        </div>
        {actions ? <div className="pageHead__actions">{actions}</div> : null}
      </div>
    </>
  );
}
