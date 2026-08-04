import type { Lead } from "./types";

/* CSV export for the lead desk.

   Every cell is quoted, quotes are doubled, and a cell whose content starts
   with a formula trigger (= + - @, or a tab/CR) is prefixed with a quote so a
   spreadsheet opens it as text — CSV injection is a real attack on operator
   tooling, and lead fields are attacker-supplied input. */

const FORMULA_TRIGGER = /^[=+\-@\t\r]/;

export function csvCell(value: string): string {
  const guarded = FORMULA_TRIGGER.test(value) ? `'${value}` : value;
  return `"${guarded.replace(/"/g, '""')}"`;
}

const COLUMNS: { header: string; value: (lead: Lead) => string }[] = [
  { header: "received", value: (l) => l.createdAt },
  { header: "name", value: (l) => l.name },
  { header: "email", value: (l) => l.email },
  { header: "organisation", value: (l) => l.organisation },
  { header: "kind", value: (l) => l.kind },
  { header: "stage", value: (l) => l.stage },
  { header: "assignee", value: (l) => l.assignee },
  { header: "locale", value: (l) => l.locale },
  { header: "source_path", value: (l) => l.sourcePath },
  { header: "cta", value: (l) => l.cta },
  { header: "event", value: (l) => l.eventSlug },
  { header: "consent", value: (l) => (l.consent ? "given" : "not_given") },
  { header: "message", value: (l) => l.message },
];

export function leadsToCsv(leads: Lead[]): string {
  const rows = [
    COLUMNS.map((c) => csvCell(c.header)).join(","),
    ...leads.map((lead) => COLUMNS.map((c) => csvCell(c.value(lead))).join(",")),
  ];
  return rows.join("\r\n") + "\r\n";
}
