import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../index";

const meta = {
  title: "Recipes/Comal",
  tags: ["!autodocs"],
  globals: { theme: "comal" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <article className="comal-ui mx-auto box-border w-full max-w-[1100px] surface-primary px-6 pb-12 pt-8 text-body text-primary" aria-labelledby="comal-title">
      <header className="flex flex-wrap items-center justify-between gap-4 border-0 border-b border-solid border-primary pb-6">
        <p className="m-0 font-heading text-[1.5rem] font-semibold">Casa de Barro</p>
        <Badge variant="secondary">Un taller imaginario</Badge>
      </header>
      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-center gap-10 py-12 max-[700px]:grid-cols-1 max-[700px]:gap-8 max-[700px]:py-8">
        <section className="min-w-0" aria-labelledby="comal-title">
          <p className="m-0 mb-4 text-eyebrow uppercase">Manos a la tierra</p>
          <h1 id="comal-title" className="m-0 text-display">Las cosas buenas<br /><em className="text-action">toman su tiempo.</em></h1>
          <p className="my-6 max-w-[38rem] text-body text-secondary">
            Un espacio ficticio para explorar la cerámica, compartir ideas y
            encontrar belleza en lo cotidiano. Una pieza, muchas posibilidades.
          </p>
          <Button asChild size="lg" className="gap-6 no-underline">
            <a href="#comal-session">Conocer el taller <span aria-hidden="true">↗</span></a>
          </Button>
          <p className="mb-0 mt-4 text-sm text-secondary">Aprender haciendo. Crear en compañía.</p>
        </section>
        <aside className="rounded-lg surface-tertiary p-8 max-[700px]:p-6" aria-labelledby="comal-process">
          <span className="mb-6 block text-[3rem] leading-none text-action" aria-hidden="true">✳</span>
          <p className="m-0 mb-4 text-eyebrow uppercase">Pequeños rituales</p>
          <h2 id="comal-process" className="m-0 text-title">De la idea<br />a las manos.</h2>
          <p className="my-4">Un poco de barro, una mesa compartida y espacio para experimentar.</p>
          <ul className="mb-0 mt-6 list-disc space-y-2 pl-5">
            <li>Explorar las formas</li>
            <li>Disfrutar las texturas</li>
            <li>Celebrar lo imperfecto</li>
          </ul>
        </aside>
      </div>
      <section id="comal-session" className="scroll-mt-6 focus:outline focus:outline-[length:var(--focus-width)] focus:outline-ring focus:outline-offset-[var(--focus-offset)]" tabIndex={-1} aria-labelledby="comal-session-title">
        <Card className="shadow-sm">
          <CardHeader>
            <p className="m-0 mb-4 text-eyebrow uppercase">El primer encuentro</p>
            <h2 id="comal-session-title" className="m-0 text-title">Una taza, a tu manera.</h2>
            <p className="mb-0 mt-3 max-w-[38rem] text-body text-secondary">
              Una sesión de ejemplo para imaginar tu primera pieza, desde la
              forma hasta los últimos detalles.
            </p>
          </CardHeader>
          <CardContent>
            <dl className="m-0 grid grid-cols-3 gap-6 max-[700px]:grid-cols-1 max-[700px]:gap-4">
              <div><dt className="mb-2 text-sm text-secondary">Duración</dt><dd className="m-0 font-medium">Dos horas sin prisa</dd></div>
              <div><dt className="mb-2 text-sm text-secondary">Nivel</dt><dd className="m-0 font-medium">Desde cero</dd></div>
              <div><dt className="mb-2 text-sm text-secondary">Materiales</dt><dd className="m-0 font-medium">Barro e imaginación</dd></div>
            </dl>
          </CardContent>
          <CardFooter className="flex-wrap justify-between gap-3">
            <Badge variant="outline">Materiales incluidos</Badge>
            <p className="m-0 text-caption text-secondary">Propuesta ficticia · Sin inscripciones</p>
          </CardFooter>
        </Card>
      </section>
    </article>
  ),
};
