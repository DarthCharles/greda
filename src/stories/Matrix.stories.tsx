import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button } from "../index";

const meta = {
  title: "Recipes/Matrix",
  tags: ["!autodocs"],
  globals: { theme: "matrix", scheme: "dark" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <article className="comal-ui mx-auto box-border w-full max-w-[1100px] surface-primary p-6 text-body text-primary sm:p-12" aria-labelledby="matrix-title">
      <header className="flex flex-wrap items-center justify-between gap-4 border-0 border-b border-solid border-primary pb-6">
        <p className="m-0 text-eyebrow uppercase"><span className="text-action" aria-hidden="true">[░]</span> Greda / operator console</p>
        <Badge variant="outline" className="border-action text-action">System online</Badge>
      </header>
      <div className="grid gap-10 py-12 md:grid-cols-2 md:items-center">
        <section aria-labelledby="matrix-title">
          <p className="m-0 mb-5 text-eyebrow text-action">01 / ENTER THE SYSTEM</p>
          <h1 id="matrix-title" className="m-0 text-display">Follow the<br /><span className="text-action">green signal.</span></h1>
          <p className="my-6 text-body text-secondary">A quieter kind of control. Clear signals, deliberate actions, and everything you need to build your next interface.</p>
          <Button asChild className="h-auto whitespace-normal px-6 py-4 no-underline shadow-none focus-visible:outline focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-ring focus-visible:outline-offset-[var(--focus-offset)]">
            <a href="#matrix-protocol">Explore the protocol <span aria-hidden="true">↗</span></a>
          </Button>
          <p className="mb-0 mt-5 text-caption text-muted">LOCAL SESSION / NO CONNECTION REQUIRED</p>
        </section>
        <section className="min-w-0 border border-solid border-primary surface-raised" aria-labelledby="matrix-terminal">
          <div className="flex flex-wrap justify-between gap-2 border-0 border-b border-solid border-primary px-5 py-4">
            <h2 id="matrix-terminal" className="m-0 text-label">boot_sequence.log</h2>
            <span className="text-caption text-muted">SIMULATION</span>
          </div>
          <div className="space-y-5 p-5 text-label sm:p-6">
            <p className="m-0 text-secondary"><span className="text-action" aria-hidden="true">$ </span>greda initialize</p>
            <ul className="m-0 list-none space-y-3 p-0" aria-label="Initialization log">
              <li><span className="text-action">[OK]</span> Tokens loaded</li>
              <li><span className="text-action">[OK]</span> Components composed</li>
              <li><span className="text-action">[OK]</span> Focus paths visible</li>
              <li><span className="text-action">[OK]</span> Operator ready</li>
            </ul>
            <p className="m-0 border-0 border-t border-solid border-primary pt-5 text-action">Awaiting your next idea<span aria-hidden="true"> ▌</span></p>
          </div>
        </section>
      </div>
      <section id="matrix-protocol" tabIndex={-1} className="border-0 border-t border-solid border-primary pt-6 focus:outline focus:outline-[length:var(--focus-width)] focus:outline-ring focus:outline-offset-[var(--focus-offset)]" aria-labelledby="matrix-protocol-title">
        <p className="m-0 mb-3 text-eyebrow text-action">02 / THE PROTOCOL</p>
        <h2 id="matrix-protocol-title" className="m-0 mb-6 text-title">Built for the operator.</h2>
        <dl className="m-0 grid gap-6 sm:grid-cols-3">
          <div><dt className="text-label">01. Compose</dt><dd className="m-0 mt-2 text-body text-secondary">Small primitives. A system that stays yours.</dd></div>
          <div><dt className="text-label">02. Navigate</dt><dd className="m-0 mt-2 text-body text-secondary">Keyboard paths and visible focus, built in.</dd></div>
          <div><dt className="text-label">03. Override</dt><dd className="m-0 mt-2 text-body text-secondary">One palette. Every component on the same frequency.</dd></div>
        </dl>
      </section>
      <footer className="mt-10 flex flex-wrap justify-between gap-3 border-0 border-t border-solid border-primary pt-5 text-caption text-muted">
        <span>GREDA / MATRIX</span><span>END OF TRANSMISSION_</span>
      </footer>
    </article>
  ),
};
