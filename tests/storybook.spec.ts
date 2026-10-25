import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const index = JSON.parse(readFileSync("storybook-static/index.json", "utf8"));
const stories = Object.values(index.entries) as { id: string; type: string }[];
for (const story of stories.filter((story) => story.type === "story")) {
  test(`renders ${story.id}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    await expect(page.locator(".catalog-canvas")).toBeVisible();
    expect(errors).toEqual([]);
    if (story.id === "introduction-overview--components")
      await page.screenshot({ path: "test-results/overview.png" });
    const results = await new AxeBuilder({ page })
      .include(".catalog-canvas")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

for (const theme of ["base", "comal"]) {
  for (const scheme of ["light", "dark"]) {
    test(`applies ${theme} ${scheme} tokens to controls and portals`, async ({
      page,
    }) => {
      await page.goto(
        `/iframe.html?id=components-dialog--default&viewMode=story&globals=theme:${theme};scheme:${scheme}`
      );
      await page.getByRole("button", { name: "Edit profile" }).click();
      const dialog = page.getByRole("dialog", { name: "Edit profile" });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveCSS(
        "border-radius",
        theme === "comal" ? "24px" : "12px"
      );
      const input = dialog.getByRole("textbox", { name: "Name" });
      await expect(input).toBeFocused();
      const button = dialog.getByRole("button", { name: "Done" });
      await expect(button).toHaveCSS(
        "background-color",
        theme === "comal"
          ? scheme === "dark"
            ? "rgb(239, 168, 143)"
            : "rgb(168, 67, 48)"
          : scheme === "dark"
          ? "rgb(110, 162, 247)"
          : "rgb(23, 84, 207)"
      );
      const results = await new AxeBuilder({ page })
        .include('[role="dialog"]')
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: "Edit profile" })
      ).toBeFocused();
    });
  }
}

test("dialog fits a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/iframe.html?id=components-dialog--default&viewMode=story");
  await page.getByRole("button", { name: "Edit profile" }).click();
  const bounds = await page.getByRole("dialog").boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(375);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(667);
});

test("button moves down on press, excludes popup triggers, and respects reduced motion", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=components-button--press-feedback&viewMode=story"
  );
  const button = page.getByRole("button", { name: "Press and hold" });
  await button.hover();
  await page.mouse.down();
  await expect(button).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 1)");
  await page.mouse.up();
  await expect(button).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.down();
  await expect(button).toHaveCSS("transform", "none");
  await page.mouse.up();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/iframe.html?id=components-dialog--default&viewMode=story");
  const trigger = page.getByRole("button", { name: "Edit profile" });
  await trigger.hover();
  await page.mouse.down();
  await expect(trigger).toHaveCSS("transform", "none");
  await page.mouse.up();
});

test("token catalog previews follow consumer overrides and spacing is used by components", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=design-tokens--colors&viewMode=story&globals=theme:comal;scheme:light"
  );
  const primary = page.locator('[data-token="--primary"]');
  await expect(primary.locator(".token-sample")).toHaveCSS(
    "background-color",
    "rgb(168, 67, 48)"
  );
  await expect(primary.locator(".token-values")).toContainText(
    "9.5 55.556% 42.353%"
  );
  await page.goto("/iframe.html?id=design-tokens--spacing&viewMode=story");
  const step = page.locator('[data-token="--space-4"]');
  await expect(step.locator(".token-sample")).toHaveCSS("width", "16px");
  await expect(step.locator(".token-spacing-label")).toHaveText("16px");
  await page.goto("/iframe.html?id=components-button--default&viewMode=story");
  const button = page.getByRole("button", { name: "Continue" });
  await expect(button).toHaveCSS("padding-left", "16px");
  await page.evaluate(() =>
    document.documentElement.style.setProperty("--space-4", "28px")
  );
  await expect(button).toHaveCSS("padding-left", "28px");
});

test("Comal preview uses Meal Planner colors and locally loaded typography", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=introduction-overview--components&viewMode=story&globals=theme:comal;scheme:light"
  );
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(251, 247, 239)"
  );
  await expect(page.locator("body")).toHaveCSS(
    "font-family",
    /DM Sans Variable/
  );
  await expect(page.locator(".comal-heading").first()).toHaveCSS(
    "font-family",
    /Fraunces Variable/
  );
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.fonts.check('14px "DM Sans Variable"'))
  ).toBe(true);
  expect(
    await page.evaluate(() => document.fonts.check('20px "Fraunces Variable"'))
  ).toBe(true);
  const results = await new AxeBuilder({ page })
    .include(".catalog-canvas")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("package CSS preserves unrelated layered consumer utilities", async ({
  page,
}) => {
  const css = readFileSync("dist/styles.css", "utf8");
  await page.setContent(`<!doctype html>
    <style>@layer consumer {
      .consumer-box {
        --tw-translate-x: 32px;
        --tw-shadow: 0px 4px 8px rgb(255, 0, 0);
        transform: translateX(var(--tw-translate-x));
        box-shadow: var(--tw-shadow);
      }
    }</style>
    <div class="consumer-box">Consumer content</div>`);
  const consumer = page.locator(".consumer-box");
  const before = await consumer.evaluate((element) => {
    const style = getComputedStyle(element);
    return { transform: style.transform, shadow: style.boxShadow };
  });
  await page.addStyleTag({ content: css });
  await expect(consumer).toHaveCSS("transform", before.transform);
  await expect(consumer).toHaveCSS("box-shadow", before.shadow);
});

test("indeterminate icons remain visible inside cards and dialogs", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=components-checkbox--inside-containers&viewMode=story"
  );
  const cardCheckbox = page.getByRole("checkbox", {
    name: "Partially selected in card",
  });
  await expect(cardCheckbox).toHaveAttribute("aria-checked", "mixed");
  await expect(cardCheckbox.locator("[data-mixed-icon]")).toBeVisible();
  await expect(cardCheckbox.locator("[data-check-icon]")).toBeHidden();
  await page.getByRole("button", { name: "Open checkbox dialog" }).click();
  const dialogCheckbox = page.getByRole("checkbox", {
    name: "Partially selected in dialog",
  });
  await expect(dialogCheckbox).toHaveAttribute("aria-checked", "mixed");
  await expect(dialogCheckbox.locator("[data-mixed-icon]")).toBeVisible();
  await expect(dialogCheckbox.locator("[data-check-icon]")).toBeHidden();
});

test("exported variant helpers include the standalone component baseline", async ({
  page,
}) => {
  const api = await import(new URL("../dist/index.js", import.meta.url).href);
  await page.setContent(
    '<!doctype html><a id="button-helper" href="#example">Link action</a><div id="badge-helper">Status</div>'
  );
  await page.locator("#button-helper").evaluate((element, classes) => {
    element.setAttribute("class", classes);
  }, api.buttonVariants({ variant: "outline" }));
  await page.locator("#badge-helper").evaluate((element, classes) => {
    element.setAttribute("class", classes);
  }, api.badgeVariants({ variant: "outline" }));
  await page.addStyleTag({ content: readFileSync("dist/styles.css", "utf8") });
  for (const selector of ["#button-helper", "#badge-helper"]) {
    const helper = page.locator(selector);
    await expect(helper).toHaveCSS("border-style", "solid");
    await expect(helper).toHaveCSS("border-width", "1px");
    await expect(helper).toHaveCSS("box-sizing", "border-box");
    await expect(helper).toHaveCSS("font-family", /system-ui/);
  }
});

test("scoped Comal palettes set the native color scheme independently of the document", async ({
  page,
}) => {
  for (const [outer, inner] of [
    ["dark", "light"],
    ["light", "dark"],
  ]) {
    await page.setContent(
      `<!doctype html><div id="scoped-theme" data-theme="comal" data-color-scheme="${inner}"><input aria-label="Native field" /></div>`
    );
    await page.evaluate((scheme) => {
      document.documentElement.dataset.colorScheme = scheme;
    }, outer);
    await page.addStyleTag({
      content: readFileSync("dist/styles.css", "utf8"),
    });
    await page.addStyleTag({
      content: readFileSync(".storybook/themes/comal.css", "utf8"),
    });
    await expect(page.locator("html")).toHaveCSS("color-scheme", outer);
    await expect(page.locator("#scoped-theme")).toHaveCSS(
      "color-scheme",
      inner
    );
    await expect(page.getByRole("textbox", { name: "Native field" })).toHaveCSS(
      "color-scheme",
      inner
    );
  }
});
