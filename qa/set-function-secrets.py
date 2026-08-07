"""One-shot provisioning of Edge Function config (F4, per D-044).

Origins come from the recorded release target; the two server secrets are
generated fresh here and never printed. Owner-only keys (Turnstile, Resend)
are deliberately NOT set — see the session record.
"""

import secrets
import shutil
import subprocess

supabase = shutil.which("supabase")
if not supabase:
    raise SystemExit("supabase CLI not found on PATH")

pairs = {
    "LEAD_ALLOWED_ORIGINS": "https://spimarimmo.vercel.app,http://localhost:3000",
    "CMS_ALLOWED_ORIGINS": "https://spimarimmo.vercel.app,http://localhost:3000",
    "CRM_ALLOWED_ORIGINS": "https://spimarimmo.vercel.app,http://localhost:3000",
    "FORM_HASH_SECRET": secrets.token_hex(32),
    "WORKER_SHARED_SECRET": secrets.token_hex(32),
}
args = [supabase, "secrets", "set"] + [f"{k}={v}" for k, v in pairs.items()]
r = subprocess.run(args, capture_output=True, text=True)
out = r.stdout + r.stderr
for hidden in (pairs["FORM_HASH_SECRET"], pairs["WORKER_SHARED_SECRET"]):
    out = out.replace(hidden, "<generated-64-hex>")
print("exit:", r.returncode)
print(out[:500])
