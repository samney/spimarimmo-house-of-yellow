import { setRequestLocale } from "next-intl/server";

/* Placeholder home. The full 15-section homepage is HOY-060; this page exists
   so the HOY-050 shell (header, footer, WhatsApp, cursor, consent, smooth
   scroll) can be validated against the reference chrome. */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div style={{ minHeight: "160vh" }}>
      <section
        style={{
          height: "100vh",
          background: "var(--hoy-ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-hidden="true"
        data-cursor="video"
      />
    </div>
  );
}
