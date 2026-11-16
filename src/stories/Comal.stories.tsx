import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../index";

const meta = {
  id: "recipes-comal",
  title: "Theming/Comal",
  tags: ["!autodocs"],
  globals: { theme: "comal" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <article lang="en" className="comal-ui mx-auto box-border w-full max-w-[1100px] surface-primary px-6 pb-12 pt-8 text-body text-primary" aria-labelledby="comal-title">
      <header className="flex flex-wrap items-center justify-between gap-4 border-0 border-b border-solid border-primary pb-6">
        <p className="m-0 font-heading text-[1.5rem] font-semibold">Clay House</p>
        <Badge variant="secondary">An imaginary workshop</Badge>
      </header>
      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-center gap-10 py-12 max-[700px]:grid-cols-1 max-[700px]:gap-8 max-[700px]:py-8">
        <section className="min-w-0" aria-labelledby="comal-title">
          <p className="m-0 mb-4 text-eyebrow uppercase">Hands in the clay</p>
          <h1 id="comal-title" className="m-0 text-display">Good things<br /><em className="text-action">take their time.</em></h1>
          <p className="my-6 max-w-[38rem] text-body text-secondary">
            An imaginary space to explore pottery, share ideas, and
            find beauty in everyday life. One piece, endless possibilities.
          </p>
          <Button asChild size="lg" className="gap-6 no-underline">
            <a href="#comal-session">Explore the workshop <span aria-hidden="true">↗</span></a>
          </Button>
          <p className="mb-0 mt-4 text-sm text-secondary">Learn by doing. Create together.</p>
        </section>
        <aside className="rounded-lg surface-tertiary p-8 max-[700px]:p-6" aria-labelledby="comal-process">
          <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-[2rem] leading-none text-secondary-foreground" aria-hidden="true">✳</span>
          <p className="m-0 mb-4 text-eyebrow uppercase">Small rituals</p>
          <h2 id="comal-process" className="m-0 text-title">From an idea<br />to your hands.</h2>
          <p className="my-4">A little clay, a shared table, and room to experiment.</p>
          <ul className="mb-0 mt-6 list-disc space-y-2 pl-5">
            <li>Explore the shapes</li>
            <li>Enjoy the textures</li>
            <li>Celebrate the imperfect</li>
          </ul>
        </aside>
      </div>
      <section id="comal-session" className="scroll-mt-6 focus:outline focus:outline-[length:var(--focus-width)] focus:outline-ring focus:outline-offset-[var(--focus-offset)]" tabIndex={-1} aria-labelledby="comal-session-title">
        <Card className="shadow-sm">
          <CardHeader>
            <p className="m-0 mb-4 text-eyebrow uppercase">The first session</p>
            <h2 id="comal-session-title" className="m-0 text-title">A cup, your way.</h2>
            <p className="mb-0 mt-3 max-w-[38rem] text-body text-secondary">
              An example session to imagine your first piece, from its
              shape to the finishing touches.
            </p>
          </CardHeader>
          <CardContent>
            <dl className="m-0 grid grid-cols-3 gap-6 max-[700px]:grid-cols-1 max-[700px]:gap-4">
              <div><dt className="mb-2 text-sm text-secondary">Duration</dt><dd className="m-0 font-medium">Two unhurried hours</dd></div>
              <div><dt className="mb-2 text-sm text-secondary">Level</dt><dd className="m-0 font-medium">Beginner friendly</dd></div>
              <div><dt className="mb-2 text-sm text-secondary">Materials</dt><dd className="m-0 font-medium">Clay and imagination</dd></div>
            </dl>
            <div className="mt-6 grid items-end gap-5 border-0 border-t border-solid border-primary pt-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="comal-session-choice">Choose a session</Label>
                <Select defaultValue="hand-building">
                  <SelectTrigger id="comal-session-choice"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hand-building">Hand-building</SelectItem>
                    <SelectItem value="glazing">Glazing and finishing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex min-h-9 items-center gap-3">
                <Checkbox id="comal-starter-kit" defaultChecked />
                <Label htmlFor="comal-starter-kit">Include a starter kit</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-wrap justify-between gap-3">
            <Badge variant="outline">Materials included</Badge>
            <p className="m-0 text-caption text-secondary">Fictional workshop · No registration</p>
          </CardFooter>
        </Card>
      </section>
    </article>
  ),
};
