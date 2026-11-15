import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Label, Textarea } from "../index";
import landscape from "./assets/cobalto/landscape.jpg";

const meta = {
  title: "Recipes/Cobalto",
  tags: ["!autodocs"],
  globals: { theme: "cobalto" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

// Fictional editorial content with a local reference photograph.
// Applications can replace it with their own licensed image.
export const Default: Story = {
  render: () => (
    <article lang="en" className="comal-ui mx-auto box-border w-full max-w-[558px] surface-primary px-6 py-10 text-body text-primary max-[420px]:px-5 max-[420px]:py-6 selection:bg-primary selection:text-primary-foreground" aria-labelledby="cobalto-title">
      <header className="relative">
        <p className="m-0 mb-4 min-h-[68px] pr-24 pt-3 text-eyebrow uppercase">Blue Notebook · Imaginary edition 01</p>
        <span className="absolute right-0 top-0 text-[78px] leading-none max-[420px]:text-[68px]" aria-hidden="true">*</span>
        <h1 id="cobalto-title" className="m-0 text-display">A moment<br /><span className="font-medium">to look closer.</span></h1>
        <p className="my-6 text-body text-secondary">
          A small imaginary archive of light, paper, and landscapes to discover.
          Stories that begin with a closer look.
        </p>
      </header>
      <figure className="comal-ui mx-auto my-8 box-border w-3/4 max-w-[265px] rotate-[-4deg] border border-primary surface-raised px-3 pt-3 shadow-sm max-[420px]:max-w-[220px]">
        <img
          className="block aspect-square h-auto w-full surface-tertiary object-cover"
          src={landscape}
          alt="A mountain lake reflecting pine forests, with a wooden boathouse at the shore"
          width="600"
          height="600"
        />
        <figcaption className="py-4 text-center font-[family-name:Georgia,Times_New_Roman,serif] text-[1.25rem] italic leading-[1.5]">Notes from a horizon</figcaption>
      </figure>
      <section className="border-0 border-t border-solid border-action pt-5" aria-labelledby="cobalto-chapter">
        <p className="m-0 mb-4 text-eyebrow uppercase">Chapter one</p>
        <h2 id="cobalto-chapter" className="mb-4 mt-2 text-title">Collecting moments</h2>
        <p className="my-6 text-body text-secondary">
          An imaginary collection of simple shapes, long shadows, and fresh
          perspectives. Unhurried and curious.
        </p>
        <Button asChild className="flex h-auto w-full justify-between whitespace-normal px-5 py-4 no-underline shadow-none focus-visible:outline focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-ring focus-visible:outline-offset-[var(--focus-offset)]">
          <a href="#cobalto-details">Explore the notebook <span aria-hidden="true">↗</span></a>
        </Button>
      </section>
      <footer className="mt-8 flex flex-wrap gap-x-8 gap-y-5 border-0 border-t border-solid border-primary pt-5 focus:outline focus:outline-[length:var(--focus-width)] focus:outline-ring focus:outline-offset-[var(--focus-offset)]" id="cobalto-details" tabIndex={-1}>
        <div className="grid gap-2"><span className="text-caption uppercase">Format</span><strong className="text-base font-medium">Visual notebook</strong></div>
        <div className="grid gap-2"><span className="text-caption uppercase">Pace</span><strong className="text-base font-medium">At your own pace</strong></div>
        <div className="grid gap-2"><span className="text-caption uppercase">Edition</span><strong className="text-base font-medium">Imaginary</strong></div>
      </footer>
      <div className="mt-8 grid gap-3 border-0 border-t border-solid border-primary pt-5">
        <Label htmlFor="cobalto-field-notes" className="text-eyebrow uppercase">Your field notes</Label>
        <Textarea id="cobalto-field-notes" rows={3} placeholder="A detail, a place, a thought to return to…" />
      </div>
    </article>
  ),
};
