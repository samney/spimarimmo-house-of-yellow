import { expect, test } from "@playwright/test";

/* End-to-end release journey required by the accelerated brief:

     public page -> CTA -> form -> durable submission -> CRM lead
     CMS content update -> publication -> public revalidation

   These are the assertions that decide whether the platform actually works, so
   they drive real UI rather than calling actions directly. Credentials come
   from the webServer env in playwright.config.ts and exist only for this suite. */

const ADMIN = { email: "e2e-admin@example.test", password: "e2e-admin-password" };
const EDITOR = { email: "e2e-editor@example.test", password: "e2e-editor-password" };

/** Unique per run so repeated runs never collide with the dedupe key. */
const stamp = () => `${Date.now()}${Math.floor(process.hrtime()[1] / 1000)}`;

/* The consent banner is fixed to the viewport bottom and legitimately overlays
   page content until a visitor answers it — which is what a real visitor does
   before using a form. Dismiss it first so interaction tests exercise the page
   rather than the banner. */
async function dismissConsent(page: import("@playwright/test").Page) {
  const deny = page.getByRole("button", { name: /deny/i });
  if (await deny.count()) {
    await deny.first().click();
  }
}

async function signIn(page: import("@playwright/test").Page, who: typeof ADMIN) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(who.email);
  await page.getByLabel("Password").fill(who.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
}

test.describe("CMS and CRM are protected", () => {
  test("admin routes redirect anonymous visitors to sign-in", async ({ page }) => {
    for (const route of ["/admin", "/admin/pages", "/admin/events", "/admin/leads"]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    }
  });

  test("bad credentials are refused without disclosing which part was wrong", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(ADMIN.email);
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    // Scoped to the form notice: Next.js also renders a route announcer with role=alert.
    await expect(page.locator(".adminNotice--error")).toContainText("were not accepted");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toHaveCount(0);
  });
});

test("public enquiry is durably stored and appears in the CRM", async ({ page }) => {
  const id = stamp();
  const name = `E2E Visitor ${id}`;
  const message = `Integration enquiry ${id}`;

  // conversion page -> combined section: the flexible path (skip the wizard,
  // tier optional) leads straight to the request form
  await page.goto("/en/exposer/devenir-exposant");
  await dismissConsent(page);
  await page.getByRole("button", { name: "Skip straight to my request" }).click();
  await page.getByLabel("Full name").fill(name);
  await page.getByLabel("Company").fill(`E2E Co ${id}`);
  await page.getByLabel("Business email").fill(`e2e-${id}@example.test`);
  await page.getByLabel("Your message").fill(message);
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Send my request" }).click();

  // The confirmation appears only after a durable write.
  await expect(page.getByText("Your request has been sent.")).toBeVisible();

  // -> CRM lead, with attribution captured at submission.
  await signIn(page, ADMIN);
  await page.goto("/admin/leads");
  await expect(page.getByText(name)).toBeVisible();
  await page
    .getByRole("row", { name: new RegExp(name) })
    .getByRole("link", { name: "Open" })
    .click();
  await expect(page.getByText(message)).toBeVisible();
  await expect(page.getByText("devenir-exposant-flexible")).toBeVisible();

  // Operational workflow: stage, assignment and a note, each audited.
  await page.getByLabel("Current stage").selectOption("qualified");
  await page.getByRole("button", { name: "Update stage" }).click();
  await expect(page.getByText("Stage updated.")).toBeVisible();

  await page.getByLabel("Assignee").fill("ops@example.test");
  await page.getByRole("button", { name: "Save assignment" }).click();
  await expect(page.getByText("Assignment updated.")).toBeVisible();

  await page.getByRole("textbox", { name: "Note" }).fill("Following up this week.");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByText("Note added.")).toBeVisible();

  // Audit trail records actor and action (rendered as the activity list).
  await expect(page.getByText(/Stage set to qualified/).first()).toBeVisible();
  await expect(page.getByText(/Following up this week/).first()).toBeVisible();
});

test("duplicate submissions are refused without a false confirmation", async ({ page }) => {
  const id = stamp();
  const email = `dupe-${id}@example.test`;
  const message = `Duplicate probe ${id}`;

  for (const attempt of [1, 2]) {
    await page.goto("/en/exposer/devenir-exposant");
    await dismissConsent(page);
    await page.getByRole("button", { name: "Skip straight to my request" }).click();
    await page.getByLabel("Full name").fill(`Dupe ${id}`);
    await page.getByLabel("Company").fill(`Dupe Co ${id}`);
    await page.getByLabel("Business email").fill(email);
    await page.getByLabel("Your message").fill(message);
    await page.getByLabel(/I agree to be contacted/).check();
    await page.getByRole("button", { name: "Send my request" }).click();

    if (attempt === 1) {
      await expect(page.getByText("Your request has been sent.")).toBeVisible();
    } else {
      // Honest: says already recorded, does NOT claim a new enquiry was created.
      await expect(page.getByText(/already recorded/)).toBeVisible();
    }
  }
});

test("CMS publish updates the public site through revalidation", async ({ page }) => {
  const id = stamp();
  const slug = `e2e-edition-${id}`;
  const title = `E2E Edition ${id}`;

  await signIn(page, ADMIN);
  await page.goto("/admin/events");

  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("EN").first().fill(title);
  await page.getByLabel("City").fill("Casablanca");
  await page.getByLabel("Country").fill("Morocco");
  // Dates deliberately left empty — the public page must say so, not guess.
  await page.getByLabel("Publication").selectOption("published");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(/published/i).first()).toBeVisible();

  // -> public revalidation: the published edition is now live.
  await page.goto("/en/salons");
  await expect(page.getByRole("link", { name: title })).toBeVisible();
  await expect(page.getByText("Dates to be confirmed").first()).toBeVisible();

  await page.goto(`/en/salons/${slug}`);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
});

test("drafts are never visible publicly", async ({ page }) => {
  const id = stamp();
  const slug = `e2e-draft-${id}`;

  await signIn(page, ADMIN);
  await page.goto("/admin/events");
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("EN").first().fill(`Draft ${id}`);
  await page.getByLabel("Publication").selectOption("draft");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(/draft/i).first()).toBeVisible();

  // A draft must 404 rather than leak through a guessable URL.
  const response = await page.request.get(`/salons/${slug}`, { maxRedirects: 0 });
  expect(response.status()).toBe(404);
});

test("an editor cannot publish, and the server enforces it", async ({ page }) => {
  const id = stamp();
  const slug = `e2e-editor-${id}`;

  await signIn(page, EDITOR);
  await page.goto("/admin/events");
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("EN").first().fill(`Editor attempt ${id}`);
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText(/draft/i).first()).toBeVisible();

  // The publish option is disabled in the UI, but the guarantee must be
  // server-side — so ATTACK it: force-enable the disabled option, submit
  // `state=published` as the editor, and require the server to downgrade.
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("EN").first().fill(`Editor attempt ${id}`);
  await page.evaluate(() => {
    const select = document.querySelector<HTMLSelectElement>('select[name="state"]');
    if (select) {
      for (const option of select.options) option.disabled = false;
      select.value = "published";
    }
  });
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(/draft/i).first()).toBeVisible();

  // And the record must not resolve publicly either way.
  const response = await page.request.get(`/salons/${slug}`, { maxRedirects: 0 });
  expect(response.status()).toBe(404);
});
