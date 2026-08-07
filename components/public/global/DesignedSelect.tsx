"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/* Designed select (owner direction, 2026-08-07): the native popup reads as a
   cropped foreign control inside the designed surfaces, so conversion
   surfaces use this listbox instead — one trigger pill and one designed
   panel, both on the system vocabulary.

   Accessibility is the standard ARIA listbox pattern, not an approximation:
   the trigger is a real <button> (labelable — `label htmlFor` keeps
   working), `aria-haspopup`/`aria-expanded` on the trigger, options carry
   `role="option"`/`aria-selected`, the open panel manages an active option
   with `aria-activedescendant`, Arrow/Home/End move it, Enter/Space select,
   Escape closes and restores focus to the trigger, outside pointerdown
   closes. Reduced motion needs nothing: the panel is an instant state, not
   an animation. */

export type DesignedSelectOption = { readonly value: string; readonly label: string };

export function DesignedSelect({
  id,
  value,
  placeholder,
  options,
  onChange,
  surface = "light",
}: {
  id: string;
  value: string;
  placeholder: string;
  options: readonly DesignedSelectOption[];
  onChange: (value: string) => void;
  surface?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const baseId = useId();

  const selected = options.find((option) => option.value === value);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const openList = useCallback(() => {
    const start = Math.max(
      options.findIndex((option) => option.value === value),
      0,
    );
    setActiveIndex(start);
    setOpen(true);
  }, [options, value]);

  const choose = useCallback(
    (index: number) => {
      const option = options[index];
      if (option) onChange(option.value);
      close(true);
    },
    [close, onChange, options],
  );

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!listRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        close(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  function onListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (activeIndex >= 0) choose(activeIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") {
      close(false);
    }
  }

  return (
    <span className={`dsel${surface === "dark" ? " dselOnDark" : ""}`}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className="dselTrigger"
        id={id}
        onClick={() => (open ? close(true) : openList())}
        onKeyDown={(event) => {
          if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            event.preventDefault();
            openList();
          }
        }}
        ref={triggerRef}
        type="button"
      >
        <span className={`dselValue${selected ? "" : " isPlaceholder"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="dselChevron" aria-hidden="true" />
      </button>
      {open && (
        <ul
          aria-activedescendant={activeIndex >= 0 ? `${baseId}-opt-${activeIndex}` : undefined}
          aria-labelledby={id}
          className="dselPanel"
          onKeyDown={onListKeyDown}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              aria-selected={option.value === value}
              className={`dselOption${index === activeIndex ? " isActive" : ""}`}
              id={`${baseId}-opt-${index}`}
              key={option.value}
              onClick={() => choose(index)}
              onPointerMove={() => setActiveIndex(index)}
              role="option"
            >
              <span className="dselOptionLabel">{option.label}</span>
              {option.value === value && <span className="dselOptionMark" aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
