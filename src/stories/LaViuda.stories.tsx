import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button } from "../index";
import harvestBox from "./assets/la-viuda/harvest-box.jpg";
import ranchHoney from "./assets/la-viuda/ranch-honey.jpg";
import marketTote from "./assets/la-viuda/market-tote.jpg";
import ranchHorse from "./assets/la-viuda/ranch-horse.jpg";

const meta = {
  id: "recipes-la-viuda",
  title: "Theming/La Viuda",
  tags: ["!autodocs"],
  globals: { theme: "la-viuda" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const products = [
  {
    name: "Seasonal harvest box",
    category: "Produce",
    unit: "One generous box",
    price: "$24",
    image: harvestBox,
    alt: "A wooden harvest crate filled with vegetables, leafy greens, and brown eggs",
    description: "A little of what is growing, gathered fresh for your table.",
  },
  {
    name: "Wildflower honey",
    category: "Pantry",
    unit: "One 350 g jar",
    price: "$14",
    image: ranchHoney,
    alt: "A glass jar of golden honey with a wooden dipper and small wildflowers",
    description: "Golden, floral, and made for slow breakfasts and second helpings.",
  },
  {
    name: "Everyday market tote",
    category: "Ranch goods",
    unit: "Natural cotton canvas",
    price: "$28",
    image: marketTote,
    alt: "A natural canvas market tote holding carrots and leafy greens",
    description: "A sturdy companion for market mornings and everything after.",
  },
];

// Static storefront composition: product, basket, and checkout controls are visual examples.
export const Default: Story = {
  render: () => (
    <article lang="en" className="comal-ui mx-auto box-border w-full max-w-[1100px] surface-primary px-lg pb-xl pt-lg text-body text-primary sm:px-2xl sm:pt-xl" aria-labelledby="la-viuda-title">
      <header className="flex flex-wrap items-center justify-between gap-md border-0 border-b border-solid border-primary pb-lg">
        <div>
          <p className="m-0 text-label font-semibold tracking-tight">COTTONWOOD RANCH</p>
          <p className="mb-0 mt-2xs text-caption text-secondary">The ranch market</p>
        </div>
        <a href="#la-viuda-basket" className="rounded-sm text-label text-primary no-underline underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-ring focus-visible:outline-offset-[var(--focus-offset)]">Basket (2)</a>
      </header>

      <section className="grid items-center gap-xl py-2xl md:grid-cols-2 md:gap-2xl" aria-labelledby="la-viuda-title">
        <div>
          <p className="mb-md mt-0 text-eyebrow uppercase text-action">From our land to your everyday</p>
          <h1 id="la-viuda-title" className="m-0 text-display">Grown here.<br />Made with care.</h1>
          <p className="mb-lg mt-lg max-w-[440px] text-body text-secondary">Fresh things for the table. Good things for the home. Discover the produce, pantry staples, and everyday goods that bring a little ranch life to you.</p>
          <Button asChild className="h-auto whitespace-normal px-lg py-sm no-underline shadow-none">
            <a href="#la-viuda-ranch">Shop the harvest <span aria-hidden="true">↗</span></a>
          </Button>
          <p className="mb-0 mt-md text-caption text-secondary">Seasonal goods · Ranch pickup · Prices in USD</p>
        </div>
        <figure className="m-0 min-w-0">
          <img src={harvestBox} alt="Fresh vegetables and eggs packed together in a wooden harvest crate" width="1000" height="1000" className="block aspect-square h-auto w-full rounded-sm object-cover" />
          <figcaption className="mt-sm flex flex-wrap items-center justify-between gap-sm text-caption">
            <span className="text-secondary">This week at the ranch</span>
            <span>Harvest box · $24</span>
          </figcaption>
        </figure>
      </section>

      <section id="la-viuda-ranch" tabIndex={-1} aria-labelledby="la-viuda-shop-title" className="scroll-mt-lg rounded-sm border-0 border-t border-solid border-primary pt-xl focus:outline focus:outline-[length:var(--focus-width)] focus:outline-ring focus:outline-offset-[var(--focus-offset)]">
        <div className="mb-lg flex flex-wrap items-end justify-between gap-md">
          <div>
            <p className="mb-xs mt-0 text-eyebrow uppercase text-action">The good stuff</p>
            <h2 id="la-viuda-shop-title" className="m-0 text-title">A little from the ranch.</h2>
          </div>
          <p className="m-0 text-label text-secondary">Produce, pantry, and practical things.</p>
        </div>
        <ul className="m-0 grid list-none gap-xl p-0 md:grid-cols-3 md:gap-lg">
          {products.map((product) => (
            <li key={product.name} className="flex min-w-0 flex-col">
              <img src={product.image} alt={product.alt} width="1000" height="1000" loading="lazy" className="block aspect-square h-auto w-full rounded-sm object-cover" />
              <div className="mb-sm mt-md"><Badge variant="secondary">{product.category}</Badge></div>
              <div className="flex items-start justify-between gap-sm">
                <h3 className="m-0 text-body font-semibold">{product.name}</h3>
                <span className="shrink-0 text-label">{product.price}</span>
              </div>
              <p className="mb-0 mt-2xs text-caption text-secondary">{product.unit}</p>
              <p className="mb-lg mt-sm text-label text-secondary">{product.description}</p>
              <Button variant="outline" className="mt-auto w-full" aria-label={"Add to basket: " + product.name}>Add to basket</Button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-2xl grid items-start gap-xl md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="min-w-0 overflow-hidden rounded-sm surface-tertiary" aria-labelledby="la-viuda-ranch-story">
          <img src={ranchHorse} alt="A white horse moving through grass beside the ranch tree line" width="1600" height="1067" loading="lazy" className="block aspect-[16/9] h-auto w-full object-cover" />
          <div className="p-lg">
            <p className="mb-sm mt-0 text-eyebrow uppercase">Rooted in the everyday</p>
            <h2 id="la-viuda-ranch-story" className="m-0 text-title">Good soil. Honest goods.</h2>
            <p className="mb-0 mt-sm text-body text-secondary">We believe the best things are simple: something fresh to share, a pantry worth opening, and well-made goods you will reach for again and again.</p>
          </div>
        </section>

        <aside id="la-viuda-basket" tabIndex={-1} aria-labelledby="la-viuda-basket-title" className="min-w-0 scroll-mt-lg rounded-sm border border-solid border-primary surface-raised p-lg focus:outline focus:outline-[length:var(--focus-width)] focus:outline-ring focus:outline-offset-[var(--focus-offset)]">
          <p className="mb-sm mt-0 text-eyebrow uppercase text-action">Something good to take home</p>
          <h2 id="la-viuda-basket-title" className="m-0 text-title">Your basket.</h2>
          <ul className="mb-0 mt-lg list-none space-y-md p-0">
            {products.slice(0, 2).map((product) => (
              <li key={product.name} className="flex items-center gap-sm">
                <img src={product.image} alt="" width="64" height="64" loading="lazy" className="h-3xl w-3xl shrink-0 rounded-sm object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-label font-semibold">{product.name}</p>
                  <p className="mb-0 mt-2xs text-caption text-secondary">Quantity 1</p>
                </div>
                <span className="text-label">{product.price}</span>
              </li>
            ))}
          </ul>
          <dl className="mb-lg mt-lg space-y-sm border-0 border-t border-solid border-primary pt-lg text-label">
            <div className="flex justify-between gap-sm"><dt className="text-secondary">Subtotal</dt><dd className="m-0">$38</dd></div>
            <div className="flex justify-between gap-sm"><dt className="text-secondary">Ranch pickup</dt><dd className="m-0">Included</dd></div>
            <div className="flex justify-between gap-sm font-semibold"><dt>Total</dt><dd className="m-0">$38</dd></div>
          </dl>
          <Button className="w-full">Checkout <span aria-hidden="true">↗</span></Button>
          <p className="mb-0 mt-sm text-caption text-secondary">Packed with care. Ready at the ranch.</p>
        </aside>
      </div>

      <footer className="mt-2xl flex flex-wrap justify-between gap-sm border-0 border-t border-solid border-primary pt-lg text-caption text-secondary">
        <span>COTTONWOOD RANCH · Good things, grown close.</span>
        <span>A fictional ranch market</span>
      </footer>
    </article>
  ),
};
