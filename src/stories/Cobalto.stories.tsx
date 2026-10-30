import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../index";

const meta = {
  title: "Recipes/Cobalto",
  tags: ["!autodocs"],
  globals: { theme: "cobalto" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

// Fictional editorial content. The photograph is an external landscape;
// applications should replace it with their own local, licensed image.
export const Default: Story = {
  render: () => (
    <article className="comal-ui mx-auto box-border w-full max-w-[558px] surface-primary px-6 py-10 text-body text-primary max-[420px]:px-5 max-[420px]:py-6 selection:bg-primary selection:text-primary-foreground" aria-labelledby="cobalto-title">
      <header className="relative">
        <p className="m-0 mb-4 min-h-[68px] pr-24 pt-3 text-eyebrow uppercase">Cuaderno Azul · Edición imaginaria 01</p>
        <span className="absolute right-0 top-0 text-[78px] leading-none max-[420px]:text-[68px]" aria-hidden="true">*</span>
        <h1 id="cobalto-title" className="m-0 text-display">Una pausa<br /><span className="font-medium">para mirar.</span></h1>
        <p className="my-6 text-body text-secondary">
          Un pequeño archivo ficticio de luz, papel y paisajes por descubrir.
          Historias que empiezan con una mirada atenta.
        </p>
      </header>
      <figure className="comal-ui mx-auto my-8 box-border w-3/4 max-w-[265px] rotate-[-4deg] border border-primary surface-raised px-3 pt-3 shadow-sm max-[420px]:max-w-[220px]">
        <img
          className="block aspect-square h-auto w-full surface-tertiary object-cover"
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80"
          alt="Montañas reflejadas en un lago bajo el cielo del atardecer"
          width="600"
          height="600"
        />
        <figcaption className="py-4 text-center font-[family-name:Georgia,Times_New_Roman,serif] text-[1.25rem] italic leading-[1.5]">Notas de un horizonte</figcaption>
      </figure>
      <section className="border-0 border-t border-solid border-action pt-5" aria-labelledby="cobalto-chapter">
        <p className="m-0 mb-4 text-eyebrow uppercase">Capítulo uno</p>
        <h2 id="cobalto-chapter" className="mb-4 mt-2 text-title">Coleccionar instantes</h2>
        <p className="my-6 text-body text-secondary">
          Una colección imaginaria de formas sencillas, sombras largas y nuevas
          perspectivas. Sin prisa, con curiosidad.
        </p>
        <Button asChild className="flex h-auto w-full justify-between whitespace-normal px-5 py-4 no-underline shadow-none focus-visible:outline focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-ring focus-visible:outline-offset-[var(--focus-offset)]">
          <a href="#cobalto-details">Explorar el cuaderno <span aria-hidden="true">↗</span></a>
        </Button>
      </section>
      <footer className="mt-8 flex flex-wrap gap-x-8 gap-y-5 border-0 border-t border-solid border-primary pt-5 focus:outline focus:outline-[length:var(--focus-width)] focus:outline-ring focus:outline-offset-[var(--focus-offset)]" id="cobalto-details" tabIndex={-1}>
        <div className="grid gap-2"><span className="text-caption uppercase">Formato</span><strong className="text-base font-medium">Cuaderno visual</strong></div>
        <div className="grid gap-2"><span className="text-caption uppercase">Ritmo</span><strong className="text-base font-medium">A tu tiempo</strong></div>
        <div className="grid gap-2"><span className="text-caption uppercase">Edición</span><strong className="text-base font-medium">Imaginaria</strong></div>
      </footer>
    </article>
  ),
};
