import Link from "next/link";
import "./globals.css";

/* Root 404 boundary.

   TRF-004 removed the reference logo, marquee treatment and brand copy that
   previously composed this page. What remains is the behaviour the boundary
   needs and nothing more: a heading, an explanation and a link home.

   Self-contained on purpose — importing the localized shell (next-intl
   provider/Link) opts the whole route tree out of static generation, so this
   uses plain anchors. English strings; localized 404 copy is delivered with the
   locale work in TRF-080, and the SPIMAR-designed error surface in TRF-039. */
export default function RootNotFound() {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <section className="interimSurface">
          <div className="interimSurface__eyebrow">404</div>
          <h1>This page does not exist.</h1>
          <p>The page you are looking for has moved or is not available.</p>
          {/* A 404 that offers only "Home" makes the visitor start over. These
              are the routes someone who mistyped a URL most often wanted, and
              they are English because this boundary cannot use the localized
              provider without opting the whole route tree out of static
              generation (see the note above). */}
          <nav className="interimSurface__links" aria-label="Useful pages">
            <Link href="/">Home</Link>
            <Link href="/fr/salons">Exhibitions</Link>
            <Link href="/fr/exposer">Exhibit with us</Link>
            <Link href="/fr/contact">Contact</Link>
          </nav>
        </section>
      </body>
    </html>
  );
}
