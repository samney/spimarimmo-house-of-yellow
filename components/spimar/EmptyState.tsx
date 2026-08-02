/* Honest empty state.

   Used wherever approved content does not exist yet. The wording must always
   say that something is *not published*, never imply a claim, a date or a
   quantity. Inventing business content is forbidden (`D-021`), and a decorative
   placeholder that reads like real copy is the most likely way that rule gets
   broken by accident. */
export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="spimarEmpty">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
