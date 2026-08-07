/* Route transition (owner direction, 2026-08-07 — the reference's breathing
   method): every navigation re-mounts this wrapper, so the incoming page
   rises in through one CSS animation. Server component, CSS only; reduced
   motion disables it in shell.css and the page renders in place. All fixed
   chrome (header, footer, assistant, cursor) lives in the layout outside
   this wrapper, so the transform never captures a fixed element. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="pageEnter">{children}</div>;
}
