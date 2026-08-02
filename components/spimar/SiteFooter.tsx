import { Link } from "@/i18n/navigation";
import { NAV } from "./nav";

type Labels = {
  explore: string;
  legalHeading: string;
  legal: string;
  privacy: string;
  cookies: string;
  contactHeading: string;
  /* Contact details are NOT hardcoded. SPIMARIMMO's published address, phone and
     email are business facts that must come from approved content; inventing
     them is forbidden (D-021). Until they are supplied, the footer says so. */
  contactPending: string;
  rights: string;
  items: Record<string, string>;
};

export function SiteFooter({ labels }: { labels: Labels }) {
  const year = new Date().getFullYear();
  return (
    <footer className="spimarFooter">
      <div className="spimarFooter__inner">
        <div>
          <h2>{labels.explore}</h2>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {labels.items[item.key]}
            </Link>
          ))}
        </div>
        <div>
          <h2>{labels.legalHeading}</h2>
          <Link href="/mentions-legales">{labels.legal}</Link>
          <Link href="/confidentialite">{labels.privacy}</Link>
          <Link href="/cookies">{labels.cookies}</Link>
        </div>
        <div>
          <h2>{labels.contactHeading}</h2>
          <p className="spimarFooter__legal" style={{ margin: 0, paddingTop: 0, border: 0 }}>
            {labels.contactPending}
          </p>
          <Link href="/contact">{labels.items.contact}</Link>
        </div>
      </div>
      <p className="spimarFooter__legal">
        © {year} SPIMARIMMO. {labels.rights}
      </p>
    </footer>
  );
}
