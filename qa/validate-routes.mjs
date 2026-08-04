import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.ROUTE_TEST_PORT ?? 3211);
const origin = `http://127.0.0.1:${port}`;
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");

const coreRoutes = ["/", "/salons", "/exposer", "/pourquoi-spimar", "/etudes-de-cas", "/ressources", "/visiteurs", "/contact", "/confidentialite", "/mentions-legales"];
const projectRoutes = [];
const publicRoutes = [...coreRoutes, ...projectRoutes];

async function waitForServer(server) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`next start exited before becoming ready (code ${server.exitCode})`);
    }

    try {
      const response = await fetch(origin, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // The server is still starting.
    }

    await delay(250);
  }

  throw new Error(`next start did not become ready at ${origin}`);
}

async function inspectRoute(route, expectedStatus) {
  const response = await fetch(`${origin}${route}`, {
    redirect: "manual",
    headers: { "accept-language": "en-US,en;q=0.9" },
  });
  const body = await response.text();
  const errors = [];

  if (response.status !== expectedStatus) {
    errors.push(`expected ${expectedStatus}, received ${response.status}`);
  }
  if (expectedStatus === 200 && response.headers.get("x-robots-tag") !== "noindex, nofollow, noarchive") {
    errors.push("missing preview/staging X-Robots-Tag protection");
  }
  if (expectedStatus === 200 && body.includes("/videos/")) {
    errors.push("rendered HTML contains an unavailable /videos/ request");
  }

  return errors.map((error) => `${route}: ${error}`);
}

const server = spawn(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)], {
  cwd: projectRoot,
  env: {
    ...process.env,
    VERCEL_ENV: "preview",
    NEXT_PUBLIC_SITE_URL: "",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk;
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk;
});

try {
  await waitForServer(server);

  const checks = [
    ...publicRoutes.map((route) => [route, 200]),
    ...publicRoutes.map((route) => [`/en${route === "/" ? "" : route}`, 200]),
    ["/this-route-does-not-exist", 404],
    ["/en/this-route-does-not-exist", 404],
  ];
  const results = await Promise.all(checks.map(([route, status]) => inspectRoute(route, status)));
  const errors = results.flat();

  for (const [route, location] of [
    ["/fr", "/"],
    ["/fr/salons", "/salons"],
  ]) {
    const response = await fetch(`${origin}${route}`, { redirect: "manual" });
    if (response.status !== 307 || response.headers.get("location") !== location) {
      errors.push(
        `${route}: expected 307 to ${location}, received ${response.status} to ${response.headers.get("location")}`,
      );
    }
  }

  if (errors.length > 0) {
    console.error(`Route validation failed with ${errors.length} defect(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(
      `Route validation passed: ${publicRoutes.length} French routes, ${publicRoutes.length} English-prefixed routes, two localized 404s, and canonical /fr redirects.`,
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  if (serverOutput.trim()) console.error(serverOutput.trim());
  process.exitCode = 1;
} finally {
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    delay(2_000).then(() => server.kill("SIGKILL")),
  ]);
}
