import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge, Button, Dialog, DialogClose, DialogContent, DialogDescription,
  DialogTitle, DialogTrigger, Input, Label,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../index";
import ranchHorse from "./assets/la-viuda/ranch-horse.jpg";

const meta = {
  title: "Recipes/La Viuda",
  tags: ["!autodocs"],
  globals: { theme: "la-viuda" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function VisitPlanner() {
  const id = React.useId();
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} className="mt-5">
      <Dialog>
        <DialogTrigger asChild><Button variant="outline">Plan your day</Button></DialogTrigger>
        <DialogContent container={container}>
          <DialogTitle>A little time outdoors</DialogTitle>
          <DialogDescription>Choose an activity and group size to picture your day at the ranch.</DialogDescription>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-activity`}>Activity</Label>
            <Select defaultValue="walk">
              <SelectTrigger id={`${id}-activity`}><SelectValue /></SelectTrigger>
              <SelectContent container={container}>
                <SelectItem value="walk">Pasture walk</SelectItem>
                <SelectItem value="ride">Trail ride</SelectItem>
                <SelectItem value="fire">Evening by the fire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-guests`}>Guests</Label>
            <Input id={`${id}-guests`} type="number" min={1} max={8} defaultValue={2} />
          </div>
          <DialogClose asChild><Button>Keep exploring</Button></DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Fictional ranch with a local editorial reference photograph.
// No real property, visits, or bookings are offered.
export const Default: Story = {
  render: () => (
    <article lang="en" className="comal-ui mx-auto box-border w-full max-w-[1100px] surface-primary px-6 pb-8 pt-6 text-body text-primary sm:px-10 sm:pt-8" aria-labelledby="la-viuda-title">
      <header className="flex flex-wrap items-center justify-between gap-3 border-0 border-b border-solid border-primary pb-5">
        <p className="m-0 text-label font-semibold tracking-tight">COTTONWOOD RANCH</p>
        <span className="text-caption text-secondary">Open country. Easy days.</span>
      </header>
      <section className="py-10 sm:py-12" aria-labelledby="la-viuda-title">
        <p className="mb-4 mt-0 text-eyebrow uppercase text-action">A little closer to the land</p>
        <h1 id="la-viuda-title" className="m-0 max-w-[760px] text-display">Wide skies.<br />A slower pace.</h1>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <p className="m-0 max-w-[480px] text-body text-secondary">Walk the pastures, follow the trails, and settle into the rhythm of ranch life. Some days are better spent outside.</p>
          <Button asChild className="h-auto whitespace-normal px-5 py-3 no-underline shadow-none">
            <a href="#la-viuda-ranch">Explore the ranch <span aria-hidden="true">↗</span></a>
          </Button>
        </div>
      </section>
      <figure className="m-0">
        <img
          src={ranchHorse}
          alt="A white horse moving through grass beside a dark green tree line"
          width="1600"
          height="1067"
          className="block aspect-[4/3] h-auto w-full rounded-sm object-cover md:aspect-[16/9]"
        />
        <figcaption className="flex flex-wrap items-start justify-between gap-4 border-0 border-b border-solid border-primary py-5">
          <div>
            <p className="mb-1 mt-0 text-caption text-secondary">Open pastures · Winding trails · Room to breathe</p>
            <h2 className="m-0 text-title">A good day starts outdoors.</h2>
          </div>
          <Badge variant="secondary">Room to roam</Badge>
        </figcaption>
      </figure>
      <section id="la-viuda-ranch" tabIndex={-1} aria-labelledby="la-viuda-ranch-title" className="mt-10 scroll-mt-6 rounded-sm focus:outline focus:outline-[length:var(--focus-width)] focus:outline-ring focus:outline-offset-[var(--focus-offset)]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 id="la-viuda-ranch-title" className="m-0 text-title">A day at the ranch.</h2>
          <span className="text-caption text-secondary">From sunrise to the last light</span>
        </div>
        <ol className="m-0 list-none border-0 border-t border-solid border-primary p-0">
          <li className="grid gap-3 border-0 border-b border-solid border-primary py-6 md:grid-cols-[140px_minmax(0,1fr)_100px] md:gap-6">
            <p className="m-0 text-label text-secondary">Early light</p>
            <div><h3 className="m-0 text-body font-semibold">Pasture walks</h3><p className="mb-0 mt-1 text-label text-secondary">Follow the pasture paths and take in the landscape at your own pace.</p></div>
            <span className="text-caption text-secondary md:text-right">On foot</span>
          </li>
          <li className="grid gap-3 border-0 border-b border-solid border-primary py-6 md:grid-cols-[140px_minmax(0,1fr)_100px] md:gap-6">
            <p className="m-0 text-label text-secondary">Out on the trail</p>
            <div><h3 className="m-0 text-body font-semibold">Trail rides</h3><p className="mb-0 mt-1 text-label text-secondary">Saddle up for a guided ride through open country and quiet trails.</p></div>
            <span className="text-caption text-secondary md:text-right">On horseback</span>
          </li>
          <li className="grid gap-3 border-0 border-b border-solid border-primary py-6 md:grid-cols-[140px_minmax(0,1fr)_100px] md:gap-6">
            <p className="m-0 text-label text-secondary">After sunset</p>
            <div><h3 className="m-0 text-body font-semibold">Evenings by the fire</h3><p className="mb-0 mt-1 text-label text-secondary">Pull up a chair, share a story, and watch the stars come out.</p></div>
            <span className="text-caption text-secondary md:text-right">Under the stars</span>
          </li>
        </ol>
      </section>
      <aside className="mt-8 rounded-sm surface-tertiary p-6 sm:p-8" aria-labelledby="la-viuda-welcome">
        <h2 id="la-viuda-welcome" className="m-0 text-title">Come as you are.</h2>
        <p className="mb-0 mt-3 max-w-[640px] text-body text-secondary">Bring comfortable boots and a little curiosity. There is room here for familiar faces, first visits, and a quiet moment away from the everyday.</p>
        <VisitPlanner />
      </aside>
      <footer className="mt-8 flex flex-wrap justify-between gap-3 border-0 border-t border-solid border-primary pt-5 text-caption text-secondary">
        <span>COTTONWOOD RANCH · Life in the open</span>
        <span>An imaginary ranch · No bookings</span>
      </footer>
    </article>
  ),
};
