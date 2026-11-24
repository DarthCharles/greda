import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Card, CardDescription, CardFooter, CardHeader } from "../index";

const meta = {
  id: "recipes-workbench",
  title: "Theming/Workbench",
  tags: ["!autodocs"],
  globals: { theme: "workbench" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const screeningTime = "text-label [font-family:var(--workbench-font-code)] tabular-nums";
const screeningCard = "flex h-full flex-col border-primary shadow-none";

export const Default: Story = {
  render: () => (
    <article className="comal-ui mx-auto box-border w-full max-w-[920px] surface-primary px-lg py-xl text-body text-primary sm:px-2xl sm:py-2xl" aria-labelledby="workbench-title">
      <header className="mb-lg border-0 border-b border-solid border-secondary pb-lg sm:mb-xl sm:pb-xl">
        <h1 id="workbench-title" className="m-0 text-display">One night at the cinema</h1>
        <p className="mb-0 mt-sm text-body text-secondary">Saturday at Aster Cinema</p>
      </header>

      <ul role="list" aria-label="Screenings" className="m-0 grid list-none gap-md p-0 md:grid-cols-2">
        <li className="min-w-0">
          <Card className={screeningCard}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-xs">
                <time dateTime="20:00" className={`${screeningTime} text-action`}>8:00 PM</time>
                <Badge variant="outline" className="border-primary text-[color:hsl(var(--workbench-syntax-type))]">35 mm</Badge>
              </div>
              <h2 className="m-0 text-title">After the Signal</h2>
              <CardDescription className="text-body">An overnight radio host starts receiving calls from a town that went silent years ago.</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild className="no-underline">
                <a href="#workbench-screening-details">Screening details</a>
              </Button>
            </CardFooter>
          </Card>
        </li>

        <li className="min-w-0">
          <Card className={screeningCard}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-xs">
                <time dateTime="22:15" className={`${screeningTime} text-secondary`}>10:15 PM</time>
                <Badge variant="secondary">Sold out</Badge>
              </div>
              <h2 className="m-0 text-title">Blue Hour</h2>
              <CardDescription className="text-body">Two strangers walk across a sleeping city before dawn.</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button disabled>Reserve seat</Button>
            </CardFooter>
          </Card>
        </li>
      </ul>

      <section
        id="workbench-screening-details"
        tabIndex={-1}
        aria-labelledby="workbench-screening-title"
        className="mt-xl max-w-[65ch] scroll-mt-lg rounded-sm focus:outline focus:outline-[length:var(--focus-width)] focus:outline-ring focus:outline-offset-[var(--focus-offset)]"
      >
        <h2 id="workbench-screening-title" className="m-0 text-label">After the Signal screening details</h2>
        <p className="mb-0 mt-xs text-body text-secondary">The 104-minute feature screens on a 35 mm print. A short introduction to the print precedes the film.</p>
      </section>
    </article>
  ),
};
