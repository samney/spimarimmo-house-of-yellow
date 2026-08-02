/* Shared navigation contract.

   Deliberately a plain module with no "use client" directive: both the client
   header and the server footer import it. Exporting this from the client
   component instead turns it into a client reference on the server side, where
   `NAV.map` is not a function — which is exactly how it failed first time.

   Routes follow the approved Release 1 inventory (`SPM-RTI-001`). The semantic
   paths are French because the approved sitemap specifies them that way, and
   they are stable across locales; only the labels are translated. */
export const NAV = [
  { href: "/salons", key: "events" },
  { href: "/exposer", key: "exhibit" },
  { href: "/preuves", key: "proof" },
  { href: "/ressources", key: "resources" },
] as const;
