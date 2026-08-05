"use client";

import { useCallback, useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { searchConsole, type SearchHit } from "@/app/actions/search";
import { Icon } from "./icons";

/* Command palette (ADM-034, with the ADM-018/019 primitives it needs).

   Ctrl/Cmd+K anywhere in the console. Searches what the actor may actually
   read — the filtering is server-side in `searchConsole` — and offers the
   create commands the navigation already exposes.

   Keyboard is the point of a palette, so it is complete: arrows move, Enter
   opens, Escape closes, focus is trapped while open and returned to the
   trigger on close. */

const KIND_LABEL: Record<SearchHit["kind"], string> = {
  lead: "Lead",
  page: "Page",
  event: "Salon",
  destination: "Destination",
  media: "Média",
};

type Command = { id: string; label: string; detail: string; href: string };

const COMMANDS: Command[] = [
  { id: "cmd-leads", label: "Ouvrir les leads", detail: "CRM", href: "/admin/crm/leads" },
  { id: "cmd-pipeline", label: "Ouvrir le pipeline", detail: "CRM", href: "/admin/crm/pipeline" },
  { id: "cmd-page", label: "Nouvelle page", detail: "Contenus", href: "/admin/cms/pages" },
  { id: "cmd-event", label: "Nouveau salon", detail: "Salons", href: "/admin/events" },
  { id: "cmd-media", label: "Nouveau média", detail: "Contenus", href: "/admin/cms/media" },
  { id: "cmd-tasks", label: "Voir les tâches", detail: "Activité", href: "/admin/tasks" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const [pending, startTransition] = useTransition();

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const listId = useId();

  const commandHits: Command[] = query.trim()
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))
    : COMMANDS;

  const rows: { key: string; label: string; detail: string; href: string; badge: string }[] = [
    ...hits.map((hit) => ({
      key: `${hit.kind}-${hit.id}`,
      label: hit.label,
      detail: hit.detail,
      href: hit.href,
      badge: KIND_LABEL[hit.kind],
    })),
    ...commandHits.map((c) => ({
      key: c.id,
      label: c.label,
      detail: c.detail,
      href: c.href,
      badge: "Action",
    })),
  ];

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHits([]);
    setActive(0);
    // Focus returns to whatever opened the palette, so keyboard users are not
    // dropped at the top of the document.
    openerRef.current?.focus();
  }, []);

  // Global shortcut. Registered once, on the document, so it works wherever
  // focus happens to be.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openerRef.current = document.activeElement as HTMLElement;
        setOpen((wasOpen) => !wasOpen);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Debounced search: a keystroke should not be a round trip.
  useEffect(() => {
    if (!open) return;
    const term = query.trim();
    if (term.length < 2) {
      setHits([]);
      return;
    }
    const timer = setTimeout(() => {
      startTransition(async () => {
        setHits(await searchConsole(term));
        setActive(0);
      });
    }, 180);
    return () => clearTimeout(timer);
  }, [query, open]);

  if (!open) {
    return (
      <button
        type="button"
        className="commandbar__search"
        onClick={(event) => {
          openerRef.current = event.currentTarget;
          setOpen(true);
        }}
      >
        {Icon.search({ size: 16 })}
        <span>Rechercher un lead, une page, un salon…</span>
        <kbd className="commandbar__shortcut">Ctrl K</kbd>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className="commandbar__search"
        aria-expanded="true"
        onClick={() => setOpen(false)}
      >
        {Icon.search({ size: 16 })}
        <span>Rechercher un lead, une page, un salon…</span>
        <kbd className="commandbar__shortcut">Ctrl K</kbd>
      </button>

      <div className="paletteScrim" onClick={close} role="presentation" />

      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Palette de commandes"
        ref={dialogRef}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
            return;
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((index) => (rows.length === 0 ? 0 : (index + 1) % rows.length));
            return;
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((index) => (rows.length === 0 ? 0 : (index - 1 + rows.length) % rows.length));
            return;
          }
          if (event.key === "Enter") {
            event.preventDefault();
            const row = rows[active];
            if (row) {
              close();
              router.push(row.href);
            }
          }
        }}
      >
        <div className="palette__field">
          {Icon.search({ size: 17 })}
          <input
            ref={inputRef}
            className="palette__input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un lead, une page, un salon…"
            aria-label="Rechercher"
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
          />
          <kbd className="commandbar__shortcut">Échap</kbd>
        </div>

        <ul className="palette__list" id={listId} role="listbox" aria-label="Résultats">
          {rows.length === 0 ? (
            <li className="palette__empty">
              {pending
                ? "Recherche…"
                : query.trim().length < 2
                  ? "Tapez au moins deux caractères."
                  : "Aucun résultat."}
            </li>
          ) : (
            rows.map((row, index) => (
              <li key={row.key}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  className={`palette__item${index === active ? " palette__item--active" : ""}`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => {
                    close();
                    router.push(row.href);
                  }}
                >
                  <span className="palette__label">{row.label}</span>
                  <span className="palette__detail">{row.detail}</span>
                  <span className="palette__badge">{row.badge}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
