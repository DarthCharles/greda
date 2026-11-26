import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "vite";
import { buildConsumerCss } from "./tailwind-consumer";

const index = JSON.parse(readFileSync("storybook-static/index.json", "utf8"));
const stories = Object.values(index.entries) as { id: string; type: string }[];

async function mountScopedPortals(page: Page) {
  const bundle = await build({
    configFile: false,
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
    logLevel: "error",
    build: {
      lib: {
        entry: "tests/fixtures/scoped-portals.tsx",
        name: "ScopedPortalsFixture",
        formats: ["iife"],
      },
      write: false,
    },
  });
  if (!Array.isArray(bundle)) throw new Error("Expected a browser fixture bundle.");
  const script = bundle[0]?.output.find((output) => output.type === "chunk");
  if (!script) throw new Error("Missing browser fixture script.");
  await page.setContent("<!doctype html><html lang='en'><title>Scoped portals</title><body></body></html>");
  await page.addStyleTag({ content: readFileSync("dist/styles.css", "utf8") });
  await page.addStyleTag({ content: readFileSync("dist/themes/comal.css", "utf8") });
  await page.addScriptTag({ content: script.code });
}

test("collapsible keyboard toggling keeps closed fields out of the tab order", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/iframe.html?id=components-collapsible--default&viewMode=story&globals=theme:comal;scheme:dark");
  const trigger = page.getByRole("button", { name: "Delivery instructions" });
  const next = page.getByRole("button", { name: "Continue" });
  const note = page.getByRole("textbox", { name: "Where should we leave your order?" });
  await expect(trigger).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Tab");
  await expect(next).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(note).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(note).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Space");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(note).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(next).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("radio selection follows keyboard focus, skips disabled options, and displays its indicator", async ({ page }) => {
  await page.goto("/iframe.html?id=components-radio-group--default&viewMode=story");
  const standard = page.getByRole("radio", { name: "Standard delivery" });
  const express = page.getByRole("radio", { name: "Express delivery" });
  await expect(page.getByRole("radiogroup", { name: "Delivery method" })).toBeVisible();
  const unfocusedShadow = await standard.evaluate((element) => getComputedStyle(element).boxShadow);
  await page.keyboard.press("Tab");
  await expect(standard).toBeFocused();
  await expect(standard).toBeChecked();
  await expect(standard.locator("svg")).toBeVisible();
  await expect(standard).toHaveCSS("border-radius", "9999px");
  await expect(standard).toHaveCSS("width", "16px");
  await expect(standard).not.toHaveCSS("box-shadow", unfocusedShadow);
  // Radix defers focus movement and selects on focus while the arrow is held.
  await page.keyboard.down("ArrowDown");
  try {
    await expect(express).toBeFocused();
    await expect(express).toBeChecked();
  } finally {
    await page.keyboard.up("ArrowDown");
  }
  await expect(express.locator("svg")).toBeVisible();
  await expect(standard.locator("svg")).toHaveCount(0);
  await page.keyboard.down("ArrowDown");
  try {
    await expect(standard).toBeFocused();
    await expect(standard).toBeChecked();
  } finally {
    await page.keyboard.up("ArrowDown");
  }
  await expect(page.getByRole("radio", { name: "Pickup (unavailable)" })).toBeDisabled();
});

test("getting started composition fits a phone without horizontal panning", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/iframe.html?id=introduction-overview--getting-started&viewMode=docs");
  const composition = page.locator(".docs-story .catalog-stack").first();
  await expect(composition).toBeVisible();
  expect(await composition.evaluate((element) =>
    element.scrollWidth - element.clientWidth
  )).toBeLessThanOrEqual(1);
  const cards = composition.locator(".catalog-grid > *");
  expect(await cards.count()).toBeGreaterThan(0);
  for (const card of await cards.all()) {
    const bounds = await card.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
    expect(await card.evaluate((element) =>
      element.scrollWidth - element.clientWidth
    )).toBeLessThanOrEqual(1);
  }
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  )).toBeLessThanOrEqual(1);
});

test("component props stay within the phone viewport and scroll with the keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/iframe.html?id=components-button--docs&viewMode=docs");
  const props = page.getByRole("region", { name: "Component props" });
  await expect(props.getByRole("table")).toBeVisible();
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  )).toBeLessThanOrEqual(1);
  expect(await props.evaluate((element) =>
    element.scrollWidth > element.clientWidth
  )).toBe(true);
  await props.focus();
  await expect(props).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => props.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
});

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

for (const theme of ["base", "comal", "cobalto", "matrix", "la-viuda"]) {
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
        theme === "cobalto" || theme === "matrix" ? "0px" : theme === "comal" ? "24px" : "12px"
      );
      const input = dialog.getByRole("textbox", { name: "Name" });
      await expect(input).toBeFocused();
      const button = dialog.getByRole("button", { name: "Done" });
      await expect(button).toHaveCSS(
        "background-color",
        theme === "la-viuda"
          ? scheme === "dark" ? "rgb(243, 173, 155)" : "rgb(169, 47, 25)"
          : theme === "matrix"
          ? scheme === "dark" ? "rgb(77, 255, 121)" : "rgb(9, 113, 44)"
          : theme === "cobalto"
          ? scheme === "dark" ? "rgb(143, 179, 255)" : "rgb(7, 61, 181)"
          : theme === "comal"
          ? scheme === "dark"
            ? "rgb(236, 156, 121)"
            : "rgb(133, 58, 25)"
          : scheme === "dark"
          ? "rgb(131, 176, 248)"
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
  await page.getByRole("dialog").evaluate((element) => {
    element.style.setProperty("--dialog-width", "280px");
  });
  await expect(page.getByRole("dialog")).toHaveCSS("max-width", "280px");
});

test("drawer scrolls on a short viewport and inherits scoped tokens with published CSS", async ({ page }) => {
  await page.setViewportSize({ width: 280, height: 250 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mountScopedPortals(page);
  const trigger = page.getByRole("button", { name: "Pickup details" });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Pickup details" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toHaveCSS("background-color", "rgb(39, 32, 27)");
  await expect(drawer).toHaveCSS("border-top-left-radius", "24px");
  await expect(drawer).toHaveCSS("animation-name", "none");
  const bounds = await drawer.boundingBox();
  expect(bounds).toMatchObject({ x: 0, width: 280 });
  expect(bounds!.y).toBeGreaterThan(0);
  expect(bounds!.y + bounds!.height).toBe(250);
  const scrollRegion = drawer.getByRole("region", { name: "Pickup instructions" });
  const { clientHeight, scrollHeight } = await scrollRegion.evaluate((element) => ({
    clientHeight: element.clientHeight, scrollHeight: element.scrollHeight,
  }));
  expect(clientHeight).toBeGreaterThan(0);
  expect(scrollHeight).toBeGreaterThan(clientHeight);
  await expect(scrollRegion).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => scrollRegion.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  const results = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await drawer.getByRole("button", { name: "Done" }).click();
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator('[data-slot="drawer-overlay"]').click({ position: { x: 4, y: 4 } });
  await expect(drawer).toBeHidden();
});

test("clicking a drawer close button inside the swipe area dismisses the drawer", async ({ page }) => {
  await page.goto("/iframe.html?id=components-drawer--right&viewMode=story");
  const trigger = page.getByRole("button", { name: "Delivery window" });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Delivery window" });
  const swipeArea = drawer.locator('[data-slot="drawer-handle"]');
  await swipeArea.getByRole("button", { name: "Close delivery window" }).click();
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("swiping the drawer header moves the panel and closes it after a completed swipe", async ({ page }) => {
  await page.goto("/iframe.html?id=components-drawer--right&viewMode=story");
  const trigger = page.getByRole("button", { name: "Delivery window" });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Delivery window" });
  await expect.poll(async () => {
    const bounds = await drawer.boundingBox();
    return bounds && Math.round(bounds.x + bounds.width);
  }).toBe(1100);
  await expect(drawer).toHaveCSS("height", "800px");

  const swipeArea = drawer.locator('[data-slot="drawer-handle"]');
  const bounds = await swipeArea.getByRole("heading", { name: "Delivery window" }).boundingBox();
  const x = bounds!.x + bounds!.width / 2;
  const y = bounds!.y + bounds!.height / 2;
  const touch = await page.context().newCDPSession(page);
  for (const { offset, finish } of [
    { offset: 40, finish: "touchEnd" },
    { offset: 120, finish: "touchCancel" },
  ] as const) {
    await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + offset, y }] });
    await expect.poll(async () => {
      const bounds = await drawer.boundingBox();
      return bounds && Math.round(bounds.x + bounds.width);
    }).toBe(1100 + offset);
    await touch.send("Input.dispatchTouchEvent", { type: finish, touchPoints: [] });
    await expect.poll(async () => {
      const bounds = await drawer.boundingBox();
      return bounds && Math.round(bounds.x + bounds.width);
    }).toBe(1100);
  }

  await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (const offset of [20, 60, 120, 180]) {
    await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + offset, y }] });
  }
  await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });

  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
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

for (const consumer of ["package", "tailwind4"] as const) {
  test(`toggle buttons keep geometry and stay still with ${consumer} CSS`, async ({ page }) => {
    const { Button, buttonVariants }: typeof import("../src/index") = await import(
      new URL("../dist/index.js", import.meta.url).href
    );
    const examples = ["component", "helper"].map((kind) => ({
      id: `${kind}-toggle`,
      markup: [false, true].map((selected) => {
        const variant = selected ? "secondary" : "outline";
        return renderToStaticMarkup(kind === "component"
          ? createElement(Button, {
              id: `${kind}-toggle`, variant, "aria-pressed": selected,
            }, "Weekend")
          : createElement("button", {
              id: `${kind}-toggle`, type: "button", "aria-pressed": selected,
              className: buttonVariants({ variant }),
            }, "Weekend"));
      }),
    }));
    await page.setViewportSize({ width: 375, height: 667 });
    await page.setContent(`<!doctype html>${examples.map(({ id, markup }) =>
      `<div id="${id}-row" style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px">${markup[0]}<span>Following content</span></div>`
    ).join("")}`);
    await page.addStyleTag({ content: consumer === "tailwind4"
      ? await buildConsumerCss([], true)
      : readFileSync("dist/styles.css", "utf8") });
    await page.evaluate((examples) => {
      for (const { id, markup } of examples) {
        const button = document.getElementById(id)!;
        const classes = markup.map((html) => {
          const template = document.createElement("template");
          template.innerHTML = html;
          return template.content.firstElementChild!.getAttribute("class")!;
        });
        button.addEventListener("click", () => {
          const selected = button.getAttribute("aria-pressed") !== "true";
          button.setAttribute("aria-pressed", String(selected));
          button.setAttribute("class", classes[Number(selected)]);
        });
      }
    }, examples);
    for (const { id } of examples) {
      const toggle = page.locator(`#${id}`);
      const row = page.locator(`#${id}-row`);
      const geometry = () => row.evaluate((element) => Array.from(element.children, (child) => {
        const { x, y, width, height } = child.getBoundingClientRect();
        return { x, y, width, height };
      }));
      const before = await geometry();
      await expect(toggle).toHaveCSS("border-width", "1px");
      for (const pressed of [false, true]) {
        await expect(toggle).toHaveAttribute("aria-pressed", String(pressed));
        await expect(toggle).toHaveCSS("transition-duration", "0s");
        await toggle.hover();
        await page.mouse.down();
        await expect(toggle).toHaveCSS("transform", "none");
        expect(await geometry()).toEqual(before);
        await page.mouse.up();
        await expect(toggle).toHaveAttribute("aria-pressed", String(!pressed));
        expect(await geometry()).toEqual(before);
        expect(await toggle.evaluate((element) => element.getAnimations().length)).toBe(0);
      }
      await toggle.focus();
      await page.keyboard.press("Space");
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      expect(await geometry()).toEqual(before);
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      expect(await geometry()).toEqual(before);
    }
  });
}

test("named spacing overrides update component padding", async ({ page }) => {
  await page.goto("/iframe.html?id=components-button--default&viewMode=story");
  const button = page.getByRole("button", { name: "Continue" });
  await expect(button).toHaveCSS("padding-left", "16px");
  await page.evaluate(() =>
    document.documentElement.style.setProperty("--space-md", "28px")
  );
  await expect(button).toHaveCSS("padding-left", "28px");
});

for (const source of ["precompiled CSS", "Tailwind 4"] as const) {
  test(`named spacing utilities work with ${source}`, async ({ page }) => {
    const { Button } = await import(new URL("../dist/index.js", import.meta.url).href);
    const button = renderToStaticMarkup(
      createElement(Button, { className: "p-3xs" }, "Continue")
    );
    await page.setViewportSize({ width: 640, height: 800 });
    await page.setContent(`<!doctype html><div id="scope">
      <div id="layout" class="p-md -mt-xs gap-sm md:gap-lg">${button}</div>
      <div id="square" class="size-md"></div>
      <div id="sized" class="w-3xl h-xl max-w-lg"></div>
      <div id="offset-row"><div id="offset" style="position: relative" class="-top-xs -translate-y-xs"></div></div>
      <div id="siblings" class="space-y-sm"><div>First</div><div>Second</div></div>
      <table class="border-spacing-x-md"><tbody><tr><td>Cell</td></tr></tbody></table>
    </div>`);
    await page.addStyleTag({
      content: source === "Tailwind 4"
        ? await buildConsumerCss([
            "p-md", "-mt-xs", "gap-sm", "md:gap-lg", "p-3xs",
            "size-md", "w-3xl", "h-xl", "max-w-lg", "-top-xs", "-translate-y-xs", "space-y-sm",
            "border-spacing-x-md",
          ], true)
        : readFileSync("dist/styles.css", "utf8"),
    });

    const layout = page.locator("#layout");
    await expect(layout).toHaveCSS("padding", "16px");
    await expect(layout).toHaveCSS("margin-top", "-8px");
    await expect(layout).toHaveCSS("gap", "12px");
    await expect(page.getByRole("button", { name: "Continue" })).toHaveCSS("padding", "2px");
    const square = page.locator("#square");
    await expect(square).toHaveCSS("width", "16px");
    await expect(square).toHaveCSS("height", "16px");
    await expect(page.locator("#sized")).toHaveCSS("width", "24px");
    await expect(page.locator("#sized")).toHaveCSS("height", "32px");
    await expect(page.locator("#offset")).toHaveCSS("top", "-8px");
    const offset = await page.locator("#offset").evaluate((element) =>
      element.getBoundingClientRect().top - element.parentElement!.getBoundingClientRect().top
    );
    expect(offset).toBe(-16);
    const siblingGap = await page.locator("#siblings").evaluate((element) =>
      element.lastElementChild!.getBoundingClientRect().top -
      element.firstElementChild!.getBoundingClientRect().bottom
    );
    expect(siblingGap).toBe(12);
    await expect(page.getByRole("table")).toHaveCSS("border-spacing", "16px 0px");

    await page.locator("#scope").evaluate((element) => {
      element.style.setProperty("--space-md", "20px");
      element.style.setProperty("--space-sm", "10px");
    });
    await expect(layout).toHaveCSS("padding", "20px");
    await expect(layout).toHaveCSS("gap", "10px");
    await expect(square).toHaveCSS("width", "20px");

    if (source === "Tailwind 4") {
      await page.setViewportSize({ width: 900, height: 800 });
      await expect(layout).toHaveCSS("gap", "24px");
    }
  });
}

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
  await expect(panel).toHaveCSS("border-color", "rgb(108, 121, 147)");
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
  await expect(panel).toHaveCSS("background-color", "rgb(131, 176, 248)");
  await expect(page.locator("#state")).toHaveCSS(
    "background-color",
    "rgb(37, 42, 55)"
  );
  await page.locator("#state").hover();
  await expect(page.locator("#state")).toHaveCSS(
    "background-color",
    "rgb(54, 65, 89)"
  );
  await page.locator("#state").focus();
  await expect(page.locator("#state")).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.locator("#scope").evaluate((element) => {
    element.setAttribute("style", `
      --primary: 120 100% 25%;
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
    await expect(panel).toHaveCSS(property, "24px");
  }
  await expect(page.locator("#ring")).toHaveCSS("--tw-ring-offset-width", "3px");
  await expect(page.locator("#ring")).toHaveCSS("box-shadow", /0px 0px 0px 7px/);
  await expect(page.locator("#fraction")).toHaveCSS("padding", "3px");
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
    '<!doctype html><div id="plain" style="color: hsl(var(--primary)); padding: var(--space-md); font-family: var(--font-sans)">Plain CSS tokens</div>'
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

for (const theme of ["comal", "workbench"]) {
  test(`scoped ${theme} palettes set the native color scheme independently of the document`, async ({ page }) => {
    for (const [outer, inner] of [
      ["dark", "light"],
      ["light", "dark"],
    ]) {
      const schemeAttribute = theme === "workbench" && inner === "dark" ? "" : ` data-color-scheme="${inner}"`;
      await page.setContent(
        `<!doctype html><div id="scoped-theme" data-theme="${theme}"${schemeAttribute}><input aria-label="Native field" /></div>`
      );
      await page.evaluate((scheme) => {
        document.documentElement.dataset.colorScheme = scheme;
      }, outer);
      await page.addStyleTag({
        content: readFileSync("dist/styles.css", "utf8"),
      });
      await page.addStyleTag({
        content: readFileSync(`dist/themes/${theme}.css`, "utf8"),
      });
      await expect(page.locator("html")).toHaveCSS("color-scheme", outer);
      await expect(page.locator("#scoped-theme")).toHaveCSS("color-scheme", inner);
      await expect(page.getByRole("textbox", { name: "Native field" })).toHaveCSS("color-scheme", inner);
    }
  });
}

for (const layered of [false, true]) {
  test(`category color roles stay independent in ${layered ? "layered components" : "standalone utilities"}`, async ({ page }) => {
    const api = await import(new URL("../dist/index.js", import.meta.url).href);
    const candidates = [
      "bg-primary", "bg-secondary", "bg-accent", "text-primary-foreground",
      "text-secondary-foreground", "hover:bg-accent", "hover:text-accent-foreground",
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
              ${renderToStaticMarkup(createElement(api.Button, { id: "secondary-component", variant: "secondary" }, "Secondary action"))}
              ${renderToStaticMarkup(createElement(api.Button, { id: "accent-component", variant: "outline" }, "Context action"))}
              <div id="scope" data-theme="custom" data-color-scheme="light" style="--base-white: 240 100% 25%; --base-black: 60 100% 75%; --base-gray-200: 120 100% 25%; --base-tertiary: 120 100% 25%">
                <div id="scoped" class="surface-primary text-primary border-primary">Scoped roles</div>
                <div id="scoped-tertiary" class="surface-tertiary">Scoped accent surface</div>
              </div>
            </body></html>`);
          await page.addStyleTag({ content: css });
          await page.addStyleTag({ content: comal });
          const dark = scheme === "dark";
          const surface = theme === "comal"
            ? dark ? "rgb(39, 32, 27)" : "rgb(245, 240, 235)"
            : dark ? "rgb(16, 20, 30)" : "rgb(255, 255, 255)";
          const text = theme === "comal"
            ? dark ? "rgb(245, 240, 235)" : "rgb(49, 40, 33)"
            : dark ? "rgb(255, 255, 255)" : "rgb(15, 23, 41)";
          const border = theme === "comal"
            ? dark ? "rgb(138, 122, 106)" : "rgb(113, 99, 86)"
            : dark ? "rgb(135, 145, 166)" : "rgb(108, 121, 147)";
          const roles = page.locator("#roles");
          await expect(roles).toHaveCSS("background-color", surface);
          await expect(roles).toHaveCSS("color", text);
          await expect(roles).toHaveCSS("border-color", border);
          const tertiary = theme === "comal"
            ? dark ? "rgb(69, 83, 55)" : "rgb(206, 216, 196)"
            : dark ? "rgb(28, 41, 64)" : "rgb(239, 246, 255)";
          await expect(page.locator("#tertiary")).toHaveCSS("background-color", tertiary);
          await expect(page.locator("#tertiary")).toHaveCSS("color", text);
          const accent = await page.locator("#accent").evaluate((element) =>
            getComputedStyle(element).backgroundColor
          );
          await page.mouse.move(0, 0);
          const secondary = await page.getByRole("button", { name: "Secondary action", exact: true }).evaluate(
            async (element) => {
              await Promise.all(element.getAnimations().map((animation) => animation.finished));
              return getComputedStyle(element).backgroundColor;
            }
          );
          const contextAction = page.getByRole("button", { name: "Context action", exact: true });
          await contextAction.hover();
          await expect(contextAction).toHaveCSS("background-color", accent);
          expect(accent).not.toBe(secondary);
          await expect(page.locator("#scoped-tertiary")).toHaveCSS("background-color", "rgb(0, 128, 0)");
          const action = theme === "comal"
            ? dark ? "rgb(236, 156, 121)" : "rgb(133, 58, 25)"
            : dark ? "rgb(131, 176, 248)" : "rgb(23, 84, 207)";
          await expect(page.locator("#brand")).toHaveCSS("background-color", action);
          await expect(page.locator("#component")).toHaveCSS("background-color", action);
          const actionForeground = dark
            ? theme === "comal" ? "rgb(49, 40, 33)" : "rgb(15, 23, 41)"
            : theme === "comal" ? "rgb(245, 240, 235)" : "rgb(255, 255, 255)";
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
  await expect(page.locator("#alpha")).toHaveCSS("border-color", "rgba(108, 121, 147, 0.5)");
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
    await expect(page.locator("#ink")).toHaveCSS("color", "rgb(60, 84, 129)");
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

for (const consumer of ["compiled", "tailwind4"]) {
  test(`Matrix scopes its palette and native color scheme with ${consumer} CSS`, async ({ page }) => {
    const css = consumer === "tailwind4"
      ? await buildConsumerCss(["surface-primary", "text-primary", "bg-primary", "text-primary-foreground"], true, "matrix")
      : readFileSync("dist/styles.css", "utf8") + readFileSync("dist/themes/matrix.css", "utf8");
    await page.goto("/iframe.html");
    await page.setContent(`
      <div id="neutral" class="comal-ui surface-primary text-primary">Neutral</div>
      <section id="matrix" data-theme="matrix" data-color-scheme="dark">
        <div id="terminal" class="comal-ui surface-primary text-primary">Terminal</div>
        <button class="comal-ui bg-primary text-primary-foreground">Continue</button>
        <input aria-label="Native field" />
      </section>`);
    await page.addStyleTag({ content: css });
    const terminal = page.locator("#terminal");
    const action = page.getByRole("button", { name: "Continue" });
    await expect(terminal).toHaveCSS("background-color", "rgb(6, 14, 10)");
    await expect(terminal).toHaveCSS("font-family", /monospace/);
    await expect(action).toHaveCSS("background-color", "rgb(77, 255, 121)");
    await expect(action).toHaveCSS("color", "rgb(6, 14, 10)");
    await expect(page.getByRole("textbox")).toHaveCSS("color-scheme", "dark");
    await page.locator("#matrix").evaluate((element) => { element.dataset.colorScheme = "light"; });
    await expect(terminal).toHaveCSS("background-color", "rgb(241, 248, 243)");
    await expect(action).toHaveCSS("background-color", "rgb(9, 113, 44)");
    await expect(page.getByRole("textbox")).toHaveCSS("color-scheme", "light");
    await expect(page.locator("#neutral")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await page.addStyleTag({ content: '[data-theme="matrix"] { --base-primary: 0 0% 0%; }' });
    await expect(action).toHaveCSS("background-color", "rgb(0, 0, 0)");
  });
}

test("Comal's public CSS import preserves readable primary and hover states with Tailwind 4", async ({ page }) => {
  const css = await buildConsumerCss(["bg-primary", "text-primary-foreground", "hover:bg-primary-hover"], true, "comal");
  await page.goto("/iframe.html");
  await page.setContent('<section data-theme="comal" data-color-scheme="light"><button class="comal-ui bg-primary text-primary-foreground hover:bg-primary-hover">Continue</button></section>');
  await page.addStyleTag({ content: css });
  const button = page.getByRole("button", { name: "Continue" });
  for (const scheme of ["light", "dark"]) {
    await page.mouse.move(1000, 700);
    await page.locator("section").evaluate((element, value) => { element.dataset.colorScheme = value; }, scheme);
    await expect(button).toHaveCSS("background-color", scheme === "light" ? "rgb(133, 58, 25)" : "rgb(236, 156, 121)");
    await button.hover();
    await expect(button).toHaveCSS("background-color", scheme === "light" ? "rgb(120, 52, 23)" : "rgb(242, 182, 156)");
    const results = await new AxeBuilder({ page })
      .include("section")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

for (const recipe of [
  { theme: "cobalto", link: "Explore the notebook", target: "#cobalto-details", width: "558px" },
  { theme: "comal", link: "Explore the workshop", target: "#comal-session", width: "1100px" },
  { theme: "matrix", link: "Explore the protocol", target: "#matrix-protocol", width: "1100px" },
  { theme: "la-viuda", link: "Shop the harvest", target: "#la-viuda-ranch", width: "1100px" },
  { theme: "workbench", link: "Screening details", target: "#workbench-screening-details", width: "920px" },
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
        await expect(article).toHaveCSS("color-scheme", scheme);
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
        if (recipe.theme === "la-viuda") {
          await expect(page.getByRole("link", { name: "Basket (2)" })).toBeFocused();
          await page.keyboard.press("Tab");
        }
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
    // Load generated output at runtime so type checking works before the build.
    const { cn, Button }: typeof import("../src/index") = await import(
      new URL("../dist/index.js", import.meta.url).href
    );
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

test("popover enter animation follows the named offset", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/iframe.html?id=components-popover--default&viewMode=story");
  await page.addStyleTag({
    content: ':root { --space-xs: 12px; } [role="dialog"] { animation-duration: 5s !important; }',
  });
  await page.getByRole("button", { name: "Edit dimensions" }).click();
  const content = page.getByRole("dialog", { name: "Dimensions" });
  await expect(content).toHaveAttribute("data-side", "bottom");
  await expect.poll(() => content.evaluate((element) => {
    const enter = element.getAnimations().find(
      (animation) => animation instanceof CSSAnimation && animation.animationName === "enter"
    );
    if (!enter) return null;
    enter.pause();
    enter.currentTime = 0;
    return new DOMMatrixReadOnly(getComputedStyle(element).transform).m42;
  })).toBe(-12);
});

test("popover supports a custom anchor and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/iframe.html?id=components-popover--custom-anchor&viewMode=story");
  const anchor = page.getByRole("region", { name: "Delivery card" });
  await page.getByRole("button", { name: "Delivery details" }).click();
  const content = page.getByRole("dialog", { name: "Delivery details" });
  await expect(content).toHaveCSS("animation-name", "none");
  await expect.poll(async () => {
    const cardBounds = await anchor.boundingBox();
    const contentBounds = await content.boundingBox();
    if (!cardBounds || !contentBounds) return null;
    return Math.round(contentBounds.y - cardBounds.y - cardBounds.height);
  }).toBe(4);
});

test("popover inherits scoped portal tokens and fits a narrow viewport using published CSS", async ({ page }) => {
  await page.setViewportSize({ width: 280, height: 320 });
  await mountScopedPortals(page);
  const trigger = page.getByRole("button", { name: "Scoped details", exact: true });
  await trigger.evaluate((element) => {
    element.style.position = "fixed";
    element.style.right = "0";
    element.style.bottom = "0";
  });
  await trigger.click();
  const content = page.getByRole("dialog", { name: "Scoped details" });
  await expect(content).toHaveCSS("background-color", "rgb(53, 45, 39)");
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

test("combobox keeps filtered options while closing and preserves keyboard focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/iframe.html?id=components-combobox--default&viewMode=story");
  const input = page.getByRole("combobox", { name: "Material" });
  await input.focus();
  await expect(page.getByRole("listbox")).toBeVisible();
  await expect(input).toBeFocused();
  await page.keyboard.press("ArrowUp");
  const activeId = await input.getAttribute("aria-activedescendant");
  expect(activeId).toBeTruthy();
  await expect(page.getByRole("option", { name: "Paper" })).toHaveAttribute("id", activeId!);
  await expect(page.getByRole("option", { name: "Paper" })).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  const results = await new AxeBuilder({ page }).include(".catalog-canvas").include('[role="listbox"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
  await input.fill("pa");
  await page.keyboard.press("ArrowDown");
  const closingOptions = await page.evaluateHandle(() => {
    const list = document.querySelector('[role="listbox"]');
    if (!list) throw new Error("Expected the filtered options to be open.");
    const samples: string[][] = [];
    const observer = new MutationObserver(() => {
      if (!list.isConnected) {
        observer.disconnect();
      } else if (list.parentElement?.getAttribute("data-state") === "closed") {
        samples.push([...list.querySelectorAll('[role="option"]')].map((option) => option.textContent ?? ""));
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, attributes: true });
    return samples;
  });
  await page.keyboard.press("Enter");
  await expect(input).toHaveValue("Paper");
  await expect(input).toBeFocused();
  await expect(page.getByRole("listbox")).toHaveCount(0);
  const samples = await closingOptions.jsonValue();
  expect(samples.length).toBeGreaterThan(0);
  for (const options of samples) expect(options).toEqual(["Paper"]);
  await closingOptions.dispose();
  await input.click();
  await expect(page.getByRole("option", { name: "Clay" })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Continue" })).toBeFocused();
  await expect(page.getByRole("listbox")).toHaveCount(0);
});

test("combobox nested in a dialog dismisses its popup before the dialog", async ({ page }) => {
  await page.goto("/iframe.html?id=components-combobox--inside-dialog&viewMode=story");
  const trigger = page.getByRole("button", { name: "Edit material" });
  await trigger.click();
  const input = page.getByRole("combobox", { name: "Material" });
  await expect(input).toBeFocused();
  await input.fill("pa");
  await page.getByRole("option", { name: "Paper" }).click();
  await expect(input).toHaveValue("Paper");
  await input.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "Edit material" })).toBeVisible();
  await expect(input).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

for (const consumer of ["compiled", "tailwind4"]) {
  test(`La Viuda keeps scoped surfaces and actions readable with ${consumer} CSS`, async ({ page }) => {
    const api = await import(new URL("../dist/index.js", import.meta.url).href);
    const css = consumer === "tailwind4"
      ? await buildConsumerCss([
        "surface-primary", "text-primary", "bg-primary", "text-primary-foreground",
        "bg-secondary", "text-secondary-foreground", "bg-accent", "text-accent-foreground",
        "hover:bg-accent", "hover:text-accent-foreground",
      ], true, "la-viuda")
      : readFileSync("dist/styles.css", "utf8") + readFileSync("dist/themes/la-viuda.css", "utf8");
    await page.goto("/iframe.html");
    await page.setContent(`
      <div id="neutral" class="comal-ui surface-primary text-primary">Neutral</div>
      <section id="brand" data-theme="la-viuda" data-color-scheme="light">
        <div id="paper" class="comal-ui surface-primary text-primary">Paper</div>
        <button class="comal-ui bg-primary text-primary-foreground">Continue</button>
        ${renderToStaticMarkup(createElement(api.Button, { variant: "secondary" }, "Secondary action"))}
        ${renderToStaticMarkup(createElement(api.Button, { variant: "outline" }, "Context action"))}
        <div id="accent" class="bg-accent text-accent-foreground">Accent background</div>
        <input aria-label="Native field" />
      </section>`);
    await page.addStyleTag({ content: css });
    const paper = page.locator("#paper");
    const action = page.getByRole("button", { name: "Continue" });
    await expect(paper).toHaveCSS("background-color", "rgb(255, 244, 230)");
    await expect(paper).toHaveCSS("color", "rgb(41, 37, 31)");
    await expect(action).toHaveCSS("background-color", "rgb(169, 47, 25)");
    await expect(action).toHaveCSS("color", "rgb(255, 244, 230)");
    await page.locator("#brand").evaluate((element) => { element.dataset.colorScheme = "dark"; });
    await expect(paper).toHaveCSS("background-color", "rgb(37, 31, 24)");
    await expect(paper).toHaveCSS("color", "rgb(255, 244, 230)");
    await expect(action).toHaveCSS("background-color", "rgb(243, 173, 155)");
    await expect(action).toHaveCSS("color", "rgb(41, 37, 31)");
    await expect(page.getByRole("textbox")).toHaveCSS("color-scheme", "dark");
    await expect(page.locator("#neutral")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    for (const scheme of ["light", "dark"]) {
      await page.locator("#brand").evaluate((element, value) => { element.dataset.colorScheme = value; }, scheme);
      await page.mouse.move(0, 0);
      const secondary = await page.getByRole("button", { name: "Secondary action", exact: true }).evaluate(
        async (element) => {
          await Promise.all(element.getAnimations().map((animation) => animation.finished));
          return getComputedStyle(element).backgroundColor;
        }
      );
      const accent = await page.locator("#accent").evaluate((element) => getComputedStyle(element).backgroundColor);
      const contextAction = page.getByRole("button", { name: "Context action", exact: true });
      await contextAction.hover();
      await expect(contextAction).toHaveCSS("background-color", accent);
      expect(accent).not.toBe(secondary);
    }
    await page.addStyleTag({ content: '[data-theme="la-viuda"] { --base-primary: 0 0% 100%; }' });
    await expect(action).toHaveCSS("background-color", "rgb(255, 255, 255)");
  });
}

test("Comal workshop preferences use keyboard selection and native checkbox state", async ({ page }) => {
  await page.goto("/iframe.html?id=recipes-comal--default&viewMode=story");
  const session = page.getByRole("combobox", { name: "Choose a session" });
  await session.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("option", { name: "Hand-building", exact: true })).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.getByRole("option", { name: "Glazing and finishing", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(session).toHaveText("Glazing and finishing");
  const kit = page.getByRole("checkbox", { name: "Include a starter kit" });
  await expect(kit).toBeChecked();
  await kit.focus();
  await page.keyboard.press("Space");
  await expect(kit).not.toBeChecked();
});

test("Matrix console reveals its local settings through keyboard tabs", async ({ page }) => {
  await page.goto("/iframe.html?id=recipes-matrix--default&viewMode=story");
  await page.getByRole("tab", { name: "Log", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Settings", exact: true })).toBeFocused();
  await page.getByRole("textbox", { name: "Session name" }).fill("night-session");
  await page.getByRole("combobox", { name: "Output", exact: true }).click();
  await page.getByRole("option", { name: "Verbose", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Output", exact: true })).toHaveText("Verbose");
  const results = await new AxeBuilder({ page }).include("article")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});
