"""Push the non-owner env vars to the linked Vercel project (D-044 target).

SPIMAR_SESSION_SECRET is generated fresh and never printed. Credentials
(SPIMAR_ADMIN_*/SPIMAR_EDITOR_*) and SUPABASE_DATABASE_URL are deliberately
NOT pushed here — the first are owner-typed by policy, and the second would
flip the composition root to the Postgres adapters, which the console does
not have yet: setting it today would break every admin screen.
"""

import secrets
import shutil
import subprocess

vercel = shutil.which("vercel")
if not vercel:
    raise SystemExit("vercel CLI not found on PATH")

pairs = {
    "SPIMAR_SESSION_SECRET": secrets.token_hex(32),
    "SPIMAR_SITE_ID": "00000000-0000-4000-8000-000000000100",
    "SPIMAR_SITE_SLUG": "reference-foundation",
}

for name, value in pairs.items():
    r = subprocess.run(
        [vercel, "env", "add", name, "production", "--force"],
        input=value,
        capture_output=True,
        text=True,
    )
    out = (r.stdout + r.stderr).replace(value, "<value>")
    print(name, "exit:", r.returncode, "-", out.strip().splitlines()[-1][:100] if out.strip() else "")
