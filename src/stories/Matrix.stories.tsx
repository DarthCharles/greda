import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge, Button, Input, Label,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "../index";

const meta = {
  id: "recipes-matrix",
  title: "Theming/Matrix",
  tags: ["!autodocs"],
  globals: { theme: "matrix" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <article className="comal-ui mx-auto box-border w-full max-w-[1100px] surface-primary p-lg text-body text-primary sm:p-2xl" aria-labelledby="matrix-title">
      <header className="flex flex-wrap items-center justify-between gap-md border-0 border-b border-solid border-primary pb-lg">
        <p className="m-0 text-eyebrow uppercase"><span className="text-action" aria-hidden="true">[░]</span> Greda / operator console</p>
        <Badge variant="outline" className="border-action text-action">System online</Badge>
      </header>
      <div className="grid gap-2xl py-2xl md:grid-cols-2 md:items-center">
        <section aria-labelledby="matrix-title">
          <p className="m-0 mb-lg text-eyebrow text-action">01 / ENTER THE SYSTEM</p>
          <h1 id="matrix-title" className="m-0 text-display">Follow the<br /><span className="text-action">green signal.</span></h1>
          <p className="my-lg text-body text-secondary">A quieter kind of control. Clear signals, deliberate actions, and everything you need to build your next interface.</p>
          <Button asChild className="h-auto whitespace-normal px-lg py-md no-underline shadow-none focus-visible:outline focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-ring focus-visible:outline-offset-[var(--focus-offset)]">
            <a href="#matrix-protocol">Explore the protocol <span aria-hidden="true">↗</span></a>
          </Button>
          <p className="mb-0 mt-lg text-caption text-muted">LOCAL SESSION / NO CONNECTION REQUIRED</p>
        </section>
        <section className="min-w-0 border border-solid border-primary surface-raised" aria-labelledby="matrix-terminal">
          <div className="flex flex-wrap justify-between gap-xs border-0 border-b border-solid border-primary px-lg py-md">
            <h2 id="matrix-terminal" className="m-0 text-label">boot_sequence.log</h2>
            <span className="text-caption text-muted">SIMULATION</span>
          </div>
          <Tabs defaultValue="log" className="p-lg">
            <TabsList aria-label="Console views">
              <TabsTrigger value="log">Log</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="log" className="space-y-lg pt-md text-label">
              <p className="m-0 text-secondary"><span className="text-action" aria-hidden="true">$ </span>greda initialize</p>
              <ul className="m-0 list-none space-y-sm p-0" aria-label="Initialization log">
                <li><span className="text-action">[OK]</span> Tokens loaded</li>
                <li><span className="text-action">[OK]</span> Components composed</li>
                <li><span className="text-action">[OK]</span> Focus paths visible</li>
                <li><span className="text-action">[OK]</span> Operator ready</li>
              </ul>
              <p className="m-0 border-0 border-t border-solid border-primary pt-lg text-action">Awaiting your next idea<span aria-hidden="true"> ▌</span></p>
            </TabsContent>
            <TabsContent value="settings" className="pt-md">
              <div className="grid gap-lg">
                <div className="grid gap-xs">
                  <Label htmlFor="matrix-session-name">Session name</Label>
                  <Input id="matrix-session-name" defaultValue="local-session" />
                </div>
                <div className="grid gap-xs">
                  <Label htmlFor="matrix-output">Output</Label>
                  <Select defaultValue="compact">
                    <SelectTrigger id="matrix-output"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="verbose">Verbose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
      <section id="matrix-protocol" tabIndex={-1} className="border-0 border-t border-solid border-primary pt-lg focus:outline focus:outline-[length:var(--focus-width)] focus:outline-ring focus:outline-offset-[var(--focus-offset)]" aria-labelledby="matrix-protocol-title">
        <p className="m-0 mb-sm text-eyebrow text-action">02 / THE PROTOCOL</p>
        <h2 id="matrix-protocol-title" className="m-0 mb-lg text-title">Built for the operator.</h2>
        <dl className="m-0 grid gap-lg sm:grid-cols-3">
          <div><dt className="text-label">01. Compose</dt><dd className="m-0 mt-xs text-body text-secondary">Small primitives. A system that stays yours.</dd></div>
          <div><dt className="text-label">02. Navigate</dt><dd className="m-0 mt-xs text-body text-secondary">Keyboard paths and visible focus, built in.</dd></div>
          <div><dt className="text-label">03. Override</dt><dd className="m-0 mt-xs text-body text-secondary">One palette. Every component on the same frequency.</dd></div>
        </dl>
      </section>
      <footer className="mt-2xl flex flex-wrap justify-between gap-sm border-0 border-t border-solid border-primary pt-lg text-caption text-muted">
        <span>GREDA / MATRIX</span><span>END OF TRANSMISSION_</span>
      </footer>
    </article>
  ),
};
