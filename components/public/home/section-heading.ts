/* A section that can also be a whole route needs its heading level to follow
   the document, not the component. On the homepage these sections sit under the
   hero's `h1` and are `h2`s; on their own route they are the only heading, and
   A-02 measured five such routes rendering no `h1` at all — invisible to a
   screen-reader's heading list and to a crawler.

   Default stays `h2`, so nothing changes unless a route asks. */
export type SectionHeadingProps = {
  readonly headingLevel?: "h1" | "h2";
};
