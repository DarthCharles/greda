import * as React from "react";
import type { Preview } from "@storybook/react-vite";
import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
  useOf,
} from "@storybook/addon-docs/blocks";
import "../src/styles/tokens.css";
import "./styles.css";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/geist";
import "../src/styles/themes/comal.css";
import "../src/styles/themes/cobalto.css";
import "../src/styles/themes/matrix.css";
import "../src/styles/themes/la-viuda.css";
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
        items: ["base", "comal", "cobalto", "matrix", "la-viuda"],
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
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Introduction",
          ["Getting started", "Components"],
          "Design Tokens",
          [
            "Overview", "Base colors", "Color roles", "Typography", "Spacing",
            "Shape & elevation", "Sizing & states",
          ],
          "Iconography",
          ["Usage guide", "*"],
          "Theming",
          "Components",
        ],
      },
    },
    docs: {
      page: function CatalogDocs() {
        const { csfFile } = useOf("meta", ["meta"]);
        const isSingleStory = Object.keys(csfFile.stories).length === 1;
        return (
          <>
            <Title />
            <Subtitle />
            <Description />
            {isSingleStory && <Description of="story" />}
            <Primary />
            <div
              className="catalog-controls"
              role="region"
              aria-label="Component props"
              tabIndex={0}
            >
              <Controls />
            </div>
            {!isSingleStory && <Stories includePrimary={false} />}
          </>
        );
      },
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: "error" },
  },
};
export default preview;
