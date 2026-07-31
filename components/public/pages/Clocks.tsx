"use client";

import { useEffect, useState } from "react";

/* Live local times (reference .timeZones): HH:MM:SS, 24h, ticking every
   second. Server renders the wrappers empty exactly like the reference DOM
   (times are filled client-side), which also avoids hydration mismatch.
   Documented dynamic region for visual diffs. */
export function Clocks({ zones }: { zones: { label: string; timeZone: string }[] }) {
  const [times, setTimes] = useState<string[]>(() => zones.map(() => ""));

  useEffect(() => {
    const formatters = zones.map(
      (z) =>
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: z.timeZone,
        }),
    );
    const tick = () => {
      const now = new Date();
      setTimes(formatters.map((f) => f.format(now)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [zones]);

  return (
    <div className="timeZones">
      {zones.map((z, i) => (
        <div className="timeZoneWrapper" key={z.timeZone}>
          <div className="text medium">{z.label}</div>
          <div className="text timeZone" data-timezone={z.timeZone} suppressHydrationWarning>
            {times[i]}
          </div>
        </div>
      ))}
    </div>
  );
}
