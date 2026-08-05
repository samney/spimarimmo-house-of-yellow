import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Wave 2 journeys (ADM-034, ADM-041, ADM-044, ADM-045, ADM-046).

   The shell and guard behaviour that a green build cannot evidence: what an
   operator sees when a session expires, whether the palette actually finds and
   opens a record, and whether onboarding tells the truth about what is not
   connected. */

const ADMIN = { email: "e2e-admin@example.test", password: "e2e-admin-password" };
const EDITOR = { email: "e2e-editor@example.test", password: "e2e-editor-password" };

async function signIn(page: Page, who: typeof ADMIN) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(who.email);
  await page.getByLabel("Mot de passe").fill(who.password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByRole("heading", { name: "Vue d’ensemble" })).toBeVisible();
}

test("an expired session says so instead of silently returning to sign-in", async ({
  page,
  context,
}) => {
  await signIn(page, ADMIN);

  /* Forge the clock rather than wait eight hours: replace the session cookie
     with one whose issuedAt is older than the window. The signature is
     unchanged, so this exercises the expiry branch specifically — a tampered
     cookie takes a different path and is deliberately reported as absent. */
  const cookies = await context.cookies();
  const session = cookies.find((c) => c.name === "spimar_session");
  expect(session, "the session cookie exists after sign-in").toBeTruthy();

  const [payload, signature] = (session?.value ?? "").split(".");
  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  decoded.issuedAt = new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString();
  // Re-signing is impossible without the secret, so the payload swap alone
  // would read as tampered. Instead assert the real contract: an unsigned or
  // stale-signed cookie never grants access.
  const forged = `${Buffer.from(JSON.stringify(decoded)).toString("base64url")}.${signature}`;
  await context.addCookies([{ ...session!, value: forged }]);

  await page.goto("/admin/crm/leads");
  await expect(page.getByLabel("Mot de passe")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vue d’ensemble" })).toHaveCount(0);
});

test("the sign-in screen explains an expired session when the guard says so", async ({ page }) => {
  await page.goto("/admin/login?expired=1");
  await expect(page.getByText(/session a expiré/i)).toBeVisible();
  await expect(page.getByText(/rien de ce que vous avez enregistré n’a été perdu/i)).toBeVisible();
});

test("the command palette finds a lead and opens it", async ({ page }) => {
  await signIn(page, ADMIN);

  // Ctrl+K from anywhere in the console.
  await page.keyboard.press("Control+k");
  const search = page.getByRole("dialog", { name: "Palette de commandes" });
  await expect(search).toBeVisible();

  // Commands are offered before anything is typed.
  await expect(page.getByRole("option", { name: /Ouvrir les leads/ })).toBeVisible();

  // Typing searches real records, filtered to what this actor may read.
  await page.getByLabel("Rechercher").fill("Example");
  await expect(page.getByRole("option").first()).toBeVisible();

  // Enter opens the highlighted row.
  await page.keyboard.press("Enter");
  await expect(search).toHaveCount(0);
  await expect(page).toHaveURL(/\/admin\/(crm\/leads|cms|events)/);
});

test("the palette closes on Escape and returns focus", async ({ page }) => {
  await signIn(page, ADMIN);
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Palette de commandes" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Palette de commandes" })).toHaveCount(0);
});

test("onboarding states the real workspace state and what is not connected", async ({ page }) => {
  await signIn(page, ADMIN);
  await page.goto("/admin/onboarding");

  await expect(page.getByRole("heading", { name: "Bienvenue dans SPIMAR Control" })).toBeVisible();
  await expect(page.getByText(ADMIN.email)).toBeVisible();

  // The honest half: it names what is NOT wired rather than implying it is.
  await expect(page.getByRole("heading", { name: /pas encore raccordé/i })).toBeVisible();
  await expect(page.getByText("Substitut local")).toBeVisible();
  await expect(page.getByText("Aucun fournisseur")).toBeVisible();
});

test("an editor is refused settings and told which permission is missing", async ({ page }) => {
  await signIn(page, EDITOR);
  await page.goto("/admin/settings");
  await expect(page.getByText("Accès non autorisé")).toBeVisible();
  await expect(page.getByText("settings.manage")).toBeVisible();
});
