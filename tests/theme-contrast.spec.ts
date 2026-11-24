import { expect, test, type Locator } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildConsumerCss } from "./tailwind-consumer";

// Test rendered colors, including alpha compositing, rather than token strings.
async function measureColors(locator: Locator) {
  const samples = await locator.evaluateAll((elements) => {
    const context = document.createElement("canvas").getContext("2d");
    // Tailwind 4 opacity utilities can resolve to oklab()/color(), not rgb().
    function channels(color: string): number[] {
      if (!context) throw new Error("Missing canvas context.");
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      return [red, green, blue, alpha / 255];
    }
    function composite(front: number[], back: number[]): number[] {
      const alpha = front[3] ?? 1;
      return front.slice(0, 3).map((value, index) => value * alpha + back[index] * (1 - alpha));
    }
    function background(element: Element | null): number[] {
      if (!element) return [255, 255, 255];
      return composite(channels(getComputedStyle(element).backgroundColor), background(element.parentElement));
    }
    function luminance(color: number[]): number {
      const linear = color.map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    }
    return elements.map((element) => {
      const style = getComputedStyle(element);
      const border = element.getAttribute("data-contrast") === "border";
      const backdrop = background(element);
      const foreground = composite(channels(border ? style.borderTopColor : style.color), backdrop);
      const light = luminance(foreground);
      const dark = luminance(backdrop);
      return {
        label: `${element.closest("section")?.className}: ${element.getAttribute("aria-label") ?? element.textContent}`,
        ratio: (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05),
        minimum: border ? 3 : 4.5,
      };
    });
  });
  return samples;
}

for (const theme of ["base", "comal", "cobalto", "matrix", "la-viuda", "workbench"] as const) {
  for (const consumer of ["package", "tailwind4"] as const) {
    for (const scheme of ["light", "dark"] as const) {
      test(`theme contrast: ${theme} ${scheme} with ${consumer}`, async ({ page }) => {
        const { Badge, Button, Input, Textarea }: typeof import("../src/index") = await import(
          new URL("../dist/index.js", import.meta.url).href
        );
        const surfaces = ["surface-primary", "surface-secondary", "surface-raised", "surface-tertiary", "bg-accent", "bg-secondary"];
        const textRoles = ["text-primary", "text-secondary", "text-muted", "text-action", "text-destructive"];
        const fieldAttributes = { "data-contrast": "border" };
        const textAttributes = { "data-contrast": "text", "data-hover": "" };
        const controls = renderToStaticMarkup(createElement("div", null,
          createElement(Input, { "aria-label": "Name", ...fieldAttributes }),
          createElement(Textarea, { "aria-label": "Notes", ...fieldAttributes }),
          ...(["default", "destructive", "secondary"] as const).flatMap((variant) => [
            createElement(Button, { key: `button-${variant}`, variant, ...textAttributes }, `${variant} button`),
            createElement(Badge, { key: `badge-${variant}`, variant, ...textAttributes }, `${variant} badge`),
          ]),
          createElement(Button, {
            variant: "ghost", ...textAttributes, ...{ "data-feedback": "" },
          }, "Context action")
        ));
        const syntax = theme === "workbench" ? ["keyword", "type"].map((role) =>
          `<p style="color: hsl(var(--workbench-syntax-${role}))" data-contrast="text">Syntax ${role}</p>`
        ).join("") : "";
        const markup = surfaces.map((surface) => `<section class="comal-ui ${surface} text-primary" style="padding: 16px">
          ${textRoles.map((role) => `<p class="${role}" data-contrast="text">${role}</p>`).join("")}
          ${syntax}
          ${controls}
        </section>`).join("");
        const schemeAttribute = theme === "workbench" && scheme === "dark" ? "" : ` data-color-scheme="${scheme}"`;
        await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"${schemeAttribute}><body>${markup}<section class="comal-ui surface-inverse text-inverse" data-contrast="text">Inverse text</section></body></html>`);
        const candidates = await page.locator("body").evaluate((body) =>
          [...new Set([...body.querySelectorAll("*")].flatMap((element) => [...element.classList]))]
        );
        await page.addStyleTag({ content: consumer === "tailwind4"
          ? await buildConsumerCss(candidates, true, theme === "base" ? undefined : theme)
          : `${readFileSync("dist/styles.css", "utf8")}\n${theme === "base" ? "" : readFileSync(`dist/themes/${theme}.css`, "utf8")}` });
        await expect(page.locator("html")).toHaveCSS("color-scheme", scheme);
        // Assert settled default/hover states without sampling transition frames.
        await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
        await page.mouse.move(0, 0);
        const measurements = (await measureColors(page.locator("[data-contrast]"))).map((sample) => ({ ...sample, state: "default" }));
        for (const control of await page.locator("[data-hover]").all()) {
          await control.hover();
          measurements.push(...(await measureColors(control)).map((sample) => ({ ...sample, state: "hover" })));
          if (await control.getAttribute("data-feedback") !== null) {
            const feedback = await control.evaluate((element) => {
              const surface = element.closest("section");
              return {
                check: surface?.classList.contains("surface-tertiary") || surface?.classList.contains("bg-secondary"),
                background: getComputedStyle(element).backgroundColor,
                surrounding: surface ? getComputedStyle(surface).backgroundColor : "",
              };
            });
            if (feedback.check) {
              expect.soft(feedback.background, `${theme} ${scheme}: context action hover must remain visible on its supporting surface`).not.toBe(feedback.surrounding);
            }
          }
        }
        await test.info().attach("contrast-measurements", {
          body: JSON.stringify({ theme, scheme, consumer, measurements }, null, 2),
          contentType: "application/json",
        });
        const failures = measurements.filter((sample) => sample.ratio < sample.minimum);
        expect(failures, `${theme} ${scheme} ${consumer} contrast failures`).toEqual([]);
      });
    }
  }
}
