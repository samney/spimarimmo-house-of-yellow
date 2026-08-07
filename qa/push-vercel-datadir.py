"""DEMO-1: point the store at Vercel's writable filesystem.

On Vercel functions the deploy bundle is read-only; /tmp is the writable
area. Without this, every form submission throws EROFS and the funnel is
dead on the deployment while working locally.
"""

import shutil
import subprocess

vercel = shutil.which("vercel")
if not vercel:
    raise SystemExit("vercel CLI not found on PATH")

r = subprocess.run(
    [vercel, "env", "add", "SPIMAR_DATA_DIR", "production", "--force"],
    input="/tmp/spimar-data",
    capture_output=True,
    text=True,
)
print("exit:", r.returncode)
print((r.stdout + r.stderr).strip().splitlines()[-1][:120])
