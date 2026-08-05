/* The arrow used by this section's actions. Same 20 × 14 geometry, stroke
   weight and cap style as the arrow the other sections put inside `.button`,
   so the pill's icon slot reads identically across the page. */
export function MethodArrowIcon() {
  return (
    <svg viewBox="0 0 20 14" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M1 7h17M12.5 1.5 19 7l-6.5 5.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
