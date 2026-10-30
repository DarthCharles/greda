import * as React from "react";
import type { Preview } from "@storybook/react-vite";
import "../src/styles/tokens.css";
import "./styles.css";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/fraunces";
import "../src/styles/themes/comal.css";
import "../src/styles/themes/cobalto.css";
import "./preview.css";

function Theme({
  theme,
  scheme,
  children,
}: {
  theme: string;
  scheme: string;
  children: React.ReactNode;
}) {
  React.useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.colorScheme = scheme;
  }, [theme, scheme]);
  return <div className="catalog-canvas">{children}</div>;
}
const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Consumer token overrides",
      toolbar: {
        icon: "paintbrush",
        items: ["base", "comal", "cobalto"],
        dynamicTitle: true,
      },
    },
    scheme: {
      description: "Color scheme",
      toolbar: {
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "base", scheme: "light", a11y: { manual: true } },
  decorators: [
    (Story, context) => (
      <Theme theme={context.globals.theme} scheme={context.globals.scheme}>
        <Story />
      </Theme>
    ),
  ],
  parameters: {
    layout: "padded",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: "error" },
  },
};
export default preview;
