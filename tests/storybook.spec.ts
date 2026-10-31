import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildConsumerCss } from "./tailwind-consumer";

const index = JSON.parse(readFileSync("storybook-static/index.json", "utf8"));
const stories = Object.values(index.entries) as { id: string; type: string }[];
// Sweep public component states for runtime errors and accessibility regressions.
for (const story of stories.filter((story) =>
  story.type === "story" && story.id.startsWith("components-")
)) {
  test(`accessible component example: ${story.id}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    await expect(page.locator(".catalog-canvas")).toBeVisible();
    expect(errors).toEqual([]);
    const results = await new AxeBuilder({ page })
      .include(".catalog-canvas")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

for (const theme of ["base", "comal", "cobalto"]) {
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
        theme === "cobalto" ? "0px" : theme === "comal" ? "24px" : "12px"
      );
      const input = dialog.getByRole("textbox", { name: "Name" });
      await expect(input).toBeFocused();
      const button = dialog.getByRole("button", { name: "Done" });
      await expect(button).toHaveCSS(
        "background-color",
        theme === "cobalto"
          ? scheme === "dark" ? "rgb(143, 179, 255)" : "rgb(7, 61, 181)"
          : theme === "comal"
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

test("spacing overrides update component padding", async ({ page }) => {
  await page.goto("/iframe.html?id=components-button--default&viewMode=story");
  const button = page.getByRole("button", { name: "Continue" });
  await expect(button).toHaveCSS("padding-left", "16px");
  await page.evaluate(() =>
    document.documentElement.style.setProperty("--space-4", "28px")
  );
  await expect(button).toHaveCSS("padding-left", "28px");
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

test("consumer className overrides component colors and hover states", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=components-button--shared-utilities&viewMode=story"
  );
  const button = page.getByRole("button", { name: "Custom action" });
  await expect(button).toHaveCSS("background-color", "rgb(237, 239, 243)");
  await expect(button).toHaveCSS("color", "rgb(15, 23, 41)");
  await button.hover();
  await page.evaluate(() => {
    document.documentElement.style.setProperty("--accent", "120 100% 25%");
    document.documentElement.style.setProperty(
      "--accent-foreground",
      "0 0% 100%"
    );
  });
  await expect(button).toHaveCSS("background-color", "rgb(0, 128, 0)");
  await expect(button).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("Tailwind 4 consumers get token utilities from one CSS import", async ({
  page,
}) => {
  const css = await buildConsumerCss([
    "bg-primary",
    "text-primary-foreground",
    "border",
    "border-primary",
    "grid",
    "p-4",
    "m-4",
    "gap-4",
    "p-0.5",
    "p-7",
    "rounded-md",
    "font-sans",
    "font-heading",
    "text-sm",
    "font-medium",
    "shadow",
    "ring-1",
    "ring-ring",
    "ring-offset-2",
    "z-overlay",
    "opacity-disabled",
    "hover:bg-accent",
    "focus:text-accent-foreground",
    "dark:bg-muted",
  ]);
  await page.setContent(`<!doctype html>
    <div id="scope">
      <section id="panel" class="bg-primary text-primary-foreground border border-primary grid p-4 m-4 gap-4 rounded-md font-sans text-sm font-medium shadow">
        <span class="font-heading">Token-based layout</span>
      </section>
      <button id="state" class="bg-primary dark:bg-muted hover:bg-accent focus:text-accent-foreground">State colors</button>
      <div id="fraction" class="p-0.5">Fractional spacing</div>
      <div id="dynamic" class="p-7">Numeric spacing</div>
      <div id="ring" class="ring-1 ring-ring ring-offset-2">Focus ring</div>
      <div id="layer" class="z-overlay opacity-disabled">Layer and opacity</div>
    </div>`);
  await page.addStyleTag({ content: css });
  const panel = page.locator("#panel");
  await expect(panel).toHaveCSS("background-color", "rgb(23, 84, 207)");
  await expect(panel).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(panel).toHaveCSS("border-color", "rgb(202, 207, 216)");
  await expect(panel).toHaveCSS("border-width", "1px");
  for (const property of ["padding", "margin", "gap"]) {
    await expect(panel).toHaveCSS(property, "16px");
  }
  await expect(panel).toHaveCSS("border-radius", "8px");
  await expect(panel).toHaveCSS("font-family", /system-ui/);
  await expect(panel.locator("span")).toHaveCSS("font-family", /system-ui/);
  await expect(panel).toHaveCSS("font-size", "13px");
  await expect(panel).toHaveCSS("font-weight", "500");
  await expect(panel).toHaveCSS(
    "box-shadow",
    /rgba\(15, 23, 41, 0\.12\) 0px 8px 24px 0px$/
  );
  await expect(page.locator("#fraction")).toHaveCSS("padding", "2px");
  await expect(page.locator("#dynamic")).toHaveCSS("padding", "28px");
  await expect(page.locator("#layer")).toHaveCSS("z-index", "50");
  await expect(page.locator("#layer")).toHaveCSS("opacity", "0.5");
  await page.evaluate(() => {
    document.documentElement.dataset.colorScheme = "dark";
  });
  await expect(panel).toHaveCSS("background-color", "rgb(110, 162, 247)");
  await expect(page.locator("#state")).toHaveCSS(
    "background-color",
    "rgb(37, 42, 55)"
  );
  await page.locator("#state").hover();
  await expect(page.locator("#state")).toHaveCSS(
    "background-color",
    "rgb(45, 52, 67)"
  );
  await page.locator("#state").focus();
  await expect(page.locator("#state")).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.locator("#scope").evaluate((element) => {
    element.setAttribute("style", `
      --primary: 120 100% 25%;
      --space-4: 28px;
      --spacing-unit: 6px;
      --radius: 12px;
      --border-width: 3px;
      --focus-width: 4px;
      --focus-offset: 3px;
    `);
  });
  await expect(panel).toHaveCSS("background-color", "rgb(0, 128, 0)");
  await expect(panel).toHaveCSS("border-width", "3px");
  await expect(panel).toHaveCSS("border-radius", "12px");
  for (const property of ["padding", "margin", "gap"]) {
    await expect(panel).toHaveCSS(property, "28px");
  }
  await expect(page.locator("#ring")).toHaveCSS("--tw-ring-offset-width", "3px");
  await expect(page.locator("#ring")).toHaveCSS("box-shadow", /0px 0px 0px 7px/);
  await expect(page.locator("#dynamic")).toHaveCSS("padding", "42px");
});

test("Tailwind 4 app variants override Greda components through CSS layers", async ({
  page,
}) => {
  const api = await import(new URL("../dist/index.js", import.meta.url).href);
  const css = await buildConsumerCss(["md:bg-secondary", "bg-primary/50"], true);
  await page.setContent(
    "<!doctype html>" +
      renderToStaticMarkup(
        createElement(api.Button, { className: "md:bg-secondary" }, "Responsive action")
      ) +
      renderToStaticMarkup(
        createElement(api.Button, { className: "bg-primary/50" }, "Transparent action")
      )
  );
  await page.addStyleTag({ content: css });
  const button = page.getByRole("button", { name: "Responsive action" });
  await page.setViewportSize({ width: 600, height: 800 });
  await expect(button).toHaveCSS("background-color", "rgb(23, 84, 207)");
  await page.setViewportSize({ width: 1100, height: 800 });
  await expect(button).toHaveCSS("background-color", "rgb(237, 239, 243)");
  await expect(button).toHaveCSS("padding-left", "16px");
  await expect(page.getByRole("button", { name: "Transparent action" })).toHaveCSS(
    "background-color",
    /0\.5\)$/
  );
});

test("tokens.css still supplies ordinary CSS variables without Tailwind", async ({
  page,
}) => {
  await page.setContent(
    '<!doctype html><div id="plain" style="color: hsl(var(--primary)); padding: var(--space-4); font-family: var(--font-sans)">Plain CSS tokens</div>'
  );
  await page.addStyleTag({ content: readFileSync("dist/tokens.css", "utf8") });
  await expect(page.locator("#plain")).toHaveCSS("color", "rgb(23, 84, 207)");
  await expect(page.locator("#plain")).toHaveCSS("padding", "16px");
  await expect(page.locator("#plain")).toHaveCSS("font-family", /system-ui/);
});

test("base-only overrides update controls and scoped roles across CSS imports", async ({ page }) => {
  const stylesheets = [
    readFileSync("dist/tokens.css", "utf8"),
    readFileSync("dist/styles.css", "utf8"),
    await buildConsumerCss(["bg-primary", "text-primary-foreground"]),
  ];
  const overrides = `:root {
    --base-primary: 120 100% 25%;
    --base-gray-200: 120 100% 25%;
  }
  :root[data-color-scheme="dark"] { --base-primary: 120 100% 75%; }
  #scoped {
    --base-primary: 240 100% 50%;
    --base-white: 60 100% 75%;
    --base-black: 240 100% 25%;
    --base-gray-200: 120 100% 25%;
  }`;
  for (const css of stylesheets) {
    for (const overridesFirst of [true, false]) {
      await page.setContent(`<!doctype html>
        <button id="root" style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border: 1px solid hsl(var(--border-primary))">Root</button>
        <div id="scoped" data-theme="custom" data-color-scheme="light">
          <span id="child" style="background-color: hsl(var(--surface-primary)); color: hsl(var(--text-primary)); border: 1px solid hsl(var(--border-primary))">Scoped</span>
          <button id="scoped-action" style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground))">Action</button>
        </div>`);
      for (const content of overridesFirst ? [overrides, css] : [css, overrides]) {
        await page.addStyleTag({ content });
      }
      await expect(page.locator("#root")).toHaveCSS("background-color", "rgb(0, 128, 0)");
      await expect(page.locator("#root")).toHaveCSS("color", "rgb(255, 255, 255)");
      await expect(page.locator("#root")).toHaveCSS("border-color", "rgb(0, 128, 0)");
      await expect(page.locator("#child")).toHaveCSS("background-color", "rgb(255, 255, 128)");
      await expect(page.locator("#child")).toHaveCSS("color", "rgb(0, 0, 128)");
      await expect(page.locator("#child")).toHaveCSS("border-color", "rgb(0, 128, 0)");
      await expect(page.locator("#scoped-action")).toHaveCSS("background-color", "rgb(0, 0, 255)");
      await page.evaluate(() => { document.documentElement.dataset.colorScheme = "dark"; });
      await expect(page.locator("#root")).toHaveCSS("background-color", "rgb(128, 255, 128)");
      await expect(page.locator("#root")).toHaveCSS("color", "rgb(15, 23, 41)");
      await expect(page.locator("#child")).toHaveCSS("background-color", "rgb(255, 255, 128)");
      await expect(page.locator("#child")).toHaveCSS("color", "rgb(0, 0, 128)");
      await expect(page.locator("#scoped-action")).toHaveCSS("background-color", "rgb(0, 0, 255)");
    }
  }
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
      content: readFileSync("dist/themes/comal.css", "utf8"),
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

for (const layered of [false, true]) {
  test(`category color roles stay independent in ${layered ? "layered components" : "standalone utilities"}`, async ({ page }) => {
    const api = await import(new URL("../dist/index.js", import.meta.url).href);
    const candidates = [
      "bg-primary", "bg-accent", "text-primary-foreground",
      "surface-primary", "surface-tertiary", "surface-inverse", "text-primary", "text-inverse",
      "border-primary",
    ];
    const cssImports = layered
      ? [await buildConsumerCss(candidates, true)]
      : [readFileSync("dist/styles.css", "utf8"), await buildConsumerCss(candidates)];
    const comal = readFileSync("dist/themes/comal.css", "utf8");
    for (const css of cssImports) {
      for (const theme of ["base", "comal"]) {
        for (const scheme of ["light", "dark"]) {
          await page.setContent(`<!doctype html>
            <html data-theme="${theme}" data-color-scheme="${scheme}"><body>
              <div id="roles" class="comal-ui surface-primary text-primary border border-primary">Primary roles</div>
              <div id="tertiary" class="surface-tertiary text-primary">Tertiary surface</div>
              <div id="accent" class="bg-accent">Accent background</div>
              <div id="inverse" class="surface-inverse text-inverse">Inverse roles</div>
              <div id="brand" class="bg-primary">Brand action</div>
              ${renderToStaticMarkup(createElement(api.Button, { id: "component" }, "Component action"))}
              <div id="scope" data-theme="custom" data-color-scheme="light" style="--base-white: 240 100% 25%; --base-black: 60 100% 75%; --base-gray-200: 120 100% 25%; --base-tertiary: 120 100% 25%">
                <div id="scoped" class="surface-primary text-primary border-primary">Scoped roles</div>
                <div id="scoped-tertiary" class="surface-tertiary">Scoped accent surface</div>
              </div>
            </body></html>`);
          await page.addStyleTag({ content: css });
          await page.addStyleTag({ content: comal });
          const dark = scheme === "dark";
          const surface = theme === "comal"
            ? dark ? "rgb(33, 28, 23)" : "rgb(251, 247, 239)"
            : dark ? "rgb(16, 20, 30)" : "rgb(255, 255, 255)";
          const text = theme === "comal"
            ? dark ? "rgb(245, 236, 224)" : "rgb(43, 40, 35)"
            : dark ? "rgb(255, 255, 255)" : "rgb(15, 23, 41)";
          const border = theme === "comal"
            ? dark ? "rgb(97, 84, 71)" : "rgb(233, 227, 216)"
            : dark ? "rgb(78, 87, 106)" : "rgb(202, 207, 216)";
          const roles = page.locator("#roles");
          await expect(roles).toHaveCSS("background-color", surface);
          await expect(roles).toHaveCSS("color", text);
          await expect(roles).toHaveCSS("border-color", border);
          const tertiary = theme === "comal"
            ? dark ? "rgb(48, 60, 45)" : "rgb(232, 238, 224)"
            : dark ? "rgb(28, 41, 64)" : "rgb(239, 246, 255)";
          await expect(page.locator("#tertiary")).toHaveCSS("background-color", tertiary);
          await expect(page.locator("#tertiary")).toHaveCSS("color", text);
          const accent = await page.locator("#accent").evaluate((element) =>
            getComputedStyle(element).backgroundColor
          );
          await expect(page.locator("#scoped-tertiary")).toHaveCSS("background-color", "rgb(0, 128, 0)");
          const action = theme === "comal"
            ? dark ? "rgb(239, 168, 143)" : "rgb(168, 67, 48)"
            : dark ? "rgb(110, 162, 247)" : "rgb(23, 84, 207)";
          await expect(page.locator("#brand")).toHaveCSS("background-color", action);
          await expect(page.locator("#component")).toHaveCSS("background-color", action);
          const actionForeground = dark
            ? theme === "comal" ? "rgb(43, 40, 35)" : "rgb(15, 23, 41)"
            : theme === "comal" ? "rgb(251, 247, 239)" : "rgb(255, 255, 255)";
          await expect(page.locator("#component")).toHaveCSS("color", actionForeground);
          await expect(page.locator("#inverse")).toHaveCSS("background-color", text);
          await expect(page.locator("#inverse")).toHaveCSS("color", actionForeground);
          await expect(page.locator("#scoped")).toHaveCSS("background-color", "rgb(0, 0, 128)");
          await expect(page.locator("#scoped")).toHaveCSS("color", "rgb(255, 255, 128)");
          await expect(page.locator("#scoped")).toHaveCSS("border-color", "rgb(0, 128, 0)");
          await page.evaluate(() => {
            document.documentElement.style.setProperty("--base-primary", "120 100% 25%");
            document.documentElement.style.setProperty("--base-tertiary", "240 100% 50%");
          });
          await expect(page.locator("#brand")).toHaveCSS("background-color", "rgb(0, 128, 0)");
          await expect(page.locator("#component")).toHaveCSS("background-color", "rgb(0, 128, 0)");
          await expect(page.locator("#tertiary")).toHaveCSS("background-color", "rgb(0, 0, 255)");
          await expect(page.locator("#accent")).toHaveCSS("background-color", accent);
          await expect(page.locator("#scoped-tertiary")).toHaveCSS("background-color", "rgb(0, 128, 0)");
          await expect(roles).toHaveCSS("background-color", surface);
          await expect(roles).toHaveCSS("color", text);
          await expect(roles).toHaveCSS("border-color", border);
        }
      }
    }
  });
}

test("Tailwind 4 category roles support opacity, interaction, and responsive variants", async ({ page }) => {
  const css = await buildConsumerCss([
    "surface-primary/50", "text-primary/50", "border-primary/50",
    "surface-primary/[0.25]",
    "surface-primary", "hover:surface-secondary", "focus:text-inverse", "md:surface-inverse",
  ], true);
  await page.setContent(`<!doctype html>
    <div id="alpha" class="surface-primary/50 text-primary/50 border-primary/50">Transparent roles</div>
    <div id="arbitrary-alpha" class="surface-primary/[0.25]">Arbitrary opacity</div>
    <button id="state" class="surface-primary hover:surface-secondary focus:text-inverse">States</button>
    <div id="responsive" class="surface-primary md:surface-inverse">Responsive surface</div>`);
  await page.addStyleTag({ content: css });
  await expect(page.locator("#alpha")).toHaveCSS("background-color", "rgba(255, 255, 255, 0.5)");
  await expect(page.locator("#alpha")).toHaveCSS("color", "rgba(15, 23, 41, 0.5)");
  await expect(page.locator("#alpha")).toHaveCSS("border-color", "rgba(202, 207, 216, 0.5)");
  await expect(page.locator("#arbitrary-alpha")).toHaveCSS("background-color", "rgba(255, 255, 255, 0.25)");
  await page.locator("#state").hover();
  await expect(page.locator("#state")).toHaveCSS("background-color", "rgb(237, 239, 243)");
  await page.locator("#state").focus();
  await expect(page.locator("#state")).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.setViewportSize({ width: 600, height: 800 });
  await expect(page.locator("#responsive")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.setViewportSize({ width: 1100, height: 800 });
  await expect(page.locator("#responsive")).toHaveCSS("background-color", "rgb(15, 23, 41)");
});

// The published theme must work through both supported consumer CSS paths,
// without recoloring siblings or preventing ordinary application overrides.
for (const consumer of ["compiled", "tailwind4"]) {
  test(`Cobalto scopes the published palette with ${consumer} CSS`, async ({ page }) => {
    const css = consumer === "tailwind4"
      ? await buildConsumerCss(["surface-primary", "text-primary", "text-secondary", "border-primary"], true, "cobalto")
      : readFileSync("dist/styles.css", "utf8") + readFileSync("dist/themes/cobalto.css", "utf8");
    await page.goto("/iframe.html");
    await page.setContent(`
      <div id="neutral" class="comal-ui surface-primary text-primary">Neutral</div>
      <section id="cobalto" data-theme="cobalto" data-color-scheme="light">
        <div id="paper" class="comal-ui surface-primary text-primary">Paper</div>
        <p id="ink" class="text-secondary">Secondary ink</p>
        <button class="comal-ui rounded-md border border-primary">Control</button>
      </section>`);
    await page.addStyleTag({ content: css });
    await expect(page.locator("#neutral")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(page.locator("#paper")).toHaveCSS("background-color", "rgb(249, 248, 242)");
    await expect(page.locator("#paper")).toHaveCSS("color", "rgb(7, 61, 181)");
    await expect(page.locator("#ink")).toHaveCSS("color", "rgb(67, 94, 144)");
    await expect(page.getByRole("button", { name: "Control" })).toHaveCSS("border-radius", "0px");
    await expect(page.locator("#paper")).toHaveCSS("font-family", "Arial, Helvetica, sans-serif");
    await page.locator("#cobalto").evaluate((element) => { element.dataset.colorScheme = "dark"; });
    await expect(page.locator("#paper")).toHaveCSS("background-color", "rgb(9, 21, 44)");
    await expect(page.locator("#paper")).toHaveCSS("color", "rgb(249, 248, 242)");
    await expect(page.locator("#neutral")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await page.addStyleTag({ content: '[data-theme="cobalto"] { --base-white: 0 0% 100%; }' });
    await expect(page.locator("#paper")).toHaveCSS("color", "rgb(255, 255, 255)");
  });
}

test("Comal's public CSS import compiles with Tailwind 4", async ({ page }) => {
  const css = await buildConsumerCss(["bg-primary"], true, "comal");
  await page.goto("/iframe.html");
  await page.setContent('<section data-theme="comal" data-color-scheme="light"><button class="comal-ui bg-primary">Continue</button></section>');
  await page.addStyleTag({ content: css });
  const button = page.getByRole("button", { name: "Continue" });
  await expect(button).toHaveCSS("background-color", "rgb(168, 67, 48)");
  await page.locator("section").evaluate((element) => { element.dataset.colorScheme = "dark"; });
  await expect(button).toHaveCSS("background-color", "rgb(239, 168, 143)");
});

for (const recipe of [
  { theme: "cobalto", link: "Explorar el cuaderno", target: "#cobalto-details", width: "558px" },
  { theme: "comal", link: "Conocer el taller", target: "#comal-session", width: "1100px" },
] as const) {
  for (const scheme of ["light", "dark"]) {
    for (const consumer of ["storybook", "tailwind4"]) {
      test(`${recipe.theme} recipe preserves layout and focus in ${scheme} with ${consumer}`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto(`/iframe.html?id=recipes-${recipe.theme}--default&viewMode=story&globals=theme:${recipe.theme};scheme:${scheme}`);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        if (consumer === "tailwind4") {
          // Compile the actual rendered classes against the public CSS exports.
          // Recreate the page without catalog styles to catch missing mappings,
          // layering problems, and reliance on Storybook-only CSS.
          const { markup, candidates } = await page.getByRole("article").evaluate((article) => ({
            markup: article.outerHTML,
            candidates: [...new Set([article, ...article.querySelectorAll("*")]
              .flatMap((element) => [...element.classList]))],
          }));
          const css = await buildConsumerCss(candidates, true, recipe.theme);
          await page.setContent(`<!doctype html><html data-theme="${recipe.theme}" data-color-scheme="${scheme}"><body>${markup}</body></html>`);
          await page.addStyleTag({ content: css });
        }
        const article = page.getByRole("article");
        await expect(article).toHaveCSS("max-width", recipe.width);
        await page.setViewportSize({ width: 1100, height: 900 });
        expect(await article.getByRole("heading", { level: 1 }).evaluate(
          (element) => parseFloat(getComputedStyle(element).fontSize)
        )).toBeGreaterThan(50);
        if (recipe.theme === "comal") {
          const columns = await article.locator("section[aria-labelledby='comal-title']").evaluate(
            (element) => getComputedStyle(element.parentElement!).gridTemplateColumns.split(" ").length
          );
          expect(columns).toBe(2);
        }
        await page.setViewportSize({ width: 375, height: 812 });
        if (recipe.theme === "cobalto") {
          await expect(article.locator("figcaption")).toHaveCSS("font-family", /Georgia/);
        }
        expect(await article.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
        await page.keyboard.press("Tab");
        await expect(page.getByRole("link", { name: recipe.link })).toBeFocused();
        await page.keyboard.press("Enter");
        const target = page.locator(recipe.target);
        await expect(target).toBeFocused();
        await expect(target).toHaveCSS("outline-style", "solid");
        expect(await target.evaluate((element) => parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThan(0);
        const results = await new AxeBuilder({ page }).include("article")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        expect(results.violations).toEqual([]);
      });
    }
  }
}

for (const consumer of ["compiled", "tailwind4"]) {
  test(`shared typography roles compose and inherit scoped tokens with ${consumer} CSS`, async ({ page }) => {
    const { cn, Button } = await import("../dist/index.js");
    const roles = ["display", "title", "body", "label", "caption", "eyebrow"];
    const candidates = [...roles.map((role) => `text-${role}`), "text-secondary", "font-medium", "md:text-title"];
    const css = consumer === "tailwind4"
      ? await buildConsumerCss(candidates, true)
      : readFileSync("dist/styles.css", "utf8");
    const button = renderToStaticMarkup(createElement(Button, {
      variant: "ghost", className: "text-label text-secondary",
    }, "Typography control"));
    await page.setContent(`<!doctype html>
      <section data-theme="custom" data-color-scheme="light" style="--font-sans: Arial; --font-heading: Georgia; --font-size-xs: 1rem; --type-display-size: 2.5rem; --type-display-weight: 800; --type-title-size: 2rem; --base-gray-600: 120 100% 25%">
        ${roles.map((role) => `<p id="type-${role}" class="${cn(`text-${role}`, "text-secondary")}">Shared typography</p>`).join("")}
        <p id="type-override" class="text-display font-medium">Local weight</p>
        <p id="type-responsive" class="text-body md:text-title">Responsive role</p>
        ${button}
      </section>`);
    await page.addStyleTag({ content: css });
    const display = page.locator("#type-display");
    await expect(display).toHaveCSS("font-size", "40px");
    await expect(display).toHaveCSS("font-family", "Georgia");
    await expect(display).toHaveCSS("font-weight", "800");
    await expect(display).toHaveCSS("line-height", "44px");
    await expect(display).toHaveCSS("letter-spacing", "-1.6px");
    await expect(display).toHaveCSS("color", "rgb(0, 128, 0)");
    await expect(page.locator("#type-title")).toHaveCSS("font-size", "32px");
    await expect(page.locator("#type-body")).toHaveCSS("font-size", "16px");
    await expect(page.locator("#type-body")).toHaveCSS("line-height", "24px");
    await expect(page.locator("#type-label")).toHaveCSS("font-size", "13px");
    await expect(page.locator("#type-caption")).toHaveCSS("font-size", "16px");
    await expect(page.locator("#type-caption")).toHaveCSS("font-family", "Arial");
    await expect(page.locator("#type-eyebrow")).toHaveCSS("letter-spacing", "1.6px");
    await expect(page.locator("#type-eyebrow")).toHaveCSS("text-transform", "none");
    await expect(page.locator("#type-override")).toHaveCSS("font-weight", "500");
    await expect(page.locator("#type-override")).toHaveCSS("font-size", "40px");
    await expect(page.getByRole("button", { name: "Typography control" })).toHaveCSS("font-size", "13px");
    await expect(page.getByRole("button", { name: "Typography control" })).toHaveCSS("color", "rgb(0, 128, 0)");
    if (consumer === "tailwind4") {
      await page.setViewportSize({ width: 600, height: 800 });
      await expect(page.locator("#type-responsive")).toHaveCSS("font-size", "16px");
      await page.setViewportSize({ width: 1100, height: 800 });
      await expect(page.locator("#type-responsive")).toHaveCSS("font-size", "32px");
    }
  });
}

test("popover cycles focus and allows outside interaction only in non-modal mode", async ({ page }) => {
  await page.goto("/iframe.html?id=components-popover--default&viewMode=story");
  const trigger = page.getByRole("button", { name: "Edit dimensions" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const content = page.getByRole("dialog", { name: "Dimensions" });
  await expect(page.getByRole("textbox", { name: "Width" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Done" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("textbox", { name: "Width" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Done" })).toBeFocused();
  await page.getByRole("button", { name: "Continue editing" }).click();
  await expect(content).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Continue editing" })).toBeFocused();
  await trigger.click();
  const results = await new AxeBuilder({ page }).include('[role="dialog"]').withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  await page.goto("/iframe.html?id=components-popover--modal&viewMode=story");
  await page.getByRole("button", { name: "Review changes" }).click();
  const close = page.getByRole("button", { name: "Finish review" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(close).toBeFocused();
  await page.getByText("Review changes", { exact: true }).focus();
  await expect(close).toBeFocused();
  await close.click();
  await expect(page.getByRole("button", { name: "Review changes" })).toBeFocused();
});

test("popover inherits scoped portal tokens and fits a narrow viewport using published CSS", async ({ page }) => {
  await page.setViewportSize({ width: 280, height: 320 });
  await page.goto("/iframe.html?id=components-popover--scoped-theme&viewMode=story");
  // Replace catalog CSS with the package CSS to exercise shipped utilities.
  await page.evaluate(() => document.querySelectorAll('link[rel="stylesheet"], style').forEach((element) => element.remove()));
  await page.addStyleTag({ content: readFileSync("dist/styles.css", "utf8") });
  await page.addStyleTag({ content: readFileSync("dist/themes/comal.css", "utf8") });
  const trigger = page.getByRole("button", { name: "Scoped details", exact: true });
  await trigger.evaluate((element) => {
    element.style.position = "fixed";
    element.style.right = "0";
    element.style.bottom = "0";
  });
  await trigger.click();
  const content = page.getByRole("dialog", { name: "Scoped details" });
  await expect(content).toHaveCSS("background-color", "rgb(43, 37, 31)");
  await expect(content).toHaveCSS("z-index", "60");
  await expect(content).toHaveAttribute("data-side", "top");
  await expect(content).toBeVisible();
  const bounds = await content.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(280);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(320);
  // Focus remains usable after collision handling and scrolling constraints.
  await page.getByRole("button", { name: "Close scoped details" }).click();
  await expect(trigger).toBeFocused();
});
