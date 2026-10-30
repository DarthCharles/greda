import { useEffect, useRef, useState, type CSSProperties } from "react";
import { tokens, tokenPages, tokenPageHref, type DesignToken, type TokenPage } from "./catalog";
import "./TokenCatalog.css";
import { typographyRoles } from "../../styles/tailwind-theme";

function styleFor(token: DesignToken): CSSProperties {
  const value = `var(${token.name})`;
  switch (token.kind) {
    case "color":
      return { backgroundColor: `hsl(${value})` };
    case "font":
      return { fontFamily: value };
    case "fontSize":
      return { fontSize: value };
    case "weight":
      return { fontWeight: value };
    case "leading":
      return { lineHeight: value };
    case "tracking":
      return { letterSpacing: value };
    case "spacing":
      return { width: value };
    case "radius":
      return { borderRadius: value };
    case "border":
      return { borderWidth: value };
    case "width":
      return { width: value };
    case "shadow":
      return { boxShadow: value };
    case "focus":
      return token.name === "--focus-width"
        ? { outlineWidth: value }
        : { outlineOffset: value };
    case "opacity":
      return { opacity: value };
    case "duration":
      return { transitionDuration: value };
    case "layer":
      return { zIndex: value };
  }
}
const propertyFor = {
  color: "background-color",
  font: "font-family",
  fontSize: "font-size",
  weight: "font-weight",
  leading: "line-height",
  tracking: "letter-spacing",
  spacing: "width",
  radius: "border-radius",
  border: "border-width",
  width: "width",
  shadow: "box-shadow",
  focus: "outline-width",
  opacity: "opacity",
  duration: "transition-duration",
  layer: "z-index",
};

function useLiveToken(token: DesignToken, themeKey: string) {
  const sample = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState({ value: token.base, result: "" });
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(token.name)
        .trim();
      const property =
        token.name === "--focus-offset"
          ? "outline-offset"
          : propertyFor[token.kind];
      const result = sample.current
        ? getComputedStyle(sample.current).getPropertyValue(property)
        : "";
      setLive({ value, result });
    });
    return () => cancelAnimationFrame(frame);
  }, [token, themeKey]);
  return { sample, live };
}

function TokenCard({
  token,
  themeKey,
}: {
  token: DesignToken;
  themeKey: string;
}) {
  const { sample, live } = useLiveToken(token, themeKey);
  const [moving, setMoving] = useState(false);
  const text = ["font", "fontSize", "weight", "tracking"].includes(token.kind);
  return (
    <article className="token-card" data-token={token.name}>
      <header className="token-card-header">
        <h3>
          <code>{token.name}</code>
        </h3>
        {token.group !== "Palette" && <p>{token.description}</p>}
      </header>
      <div className={`token-stage token-stage--${token.kind}`}>
        {token.kind === "layer" && (
          <div className="token-layer-behind" aria-hidden="true" />
        )}
        <div
          ref={sample}
          role={token.kind === "opacity" ? "button" : undefined}
          aria-disabled={token.kind === "opacity" ? true : undefined}
          className={`token-sample token-sample--${token.kind}`}
          style={{
            ...styleFor(token),
            ...(token.kind === "duration"
              ? { transform: moving ? "translateX(4rem)" : "translateX(0)" }
              : {}),
          }}
        >
          {text && (
            <>
              The quick brown fox
              <br />
              <span>Aa Bb Cc 012345</span>
            </>
          )}
          {token.kind === "leading" && (
            <>
              Good typography gives
              <br />
              every line room to breathe.
              <br />
              This is the line-height token.
            </>
          )}
          {token.kind === "focus" && "Keyboard focus"}
          {token.kind === "opacity" && "Unavailable"}
          {token.kind === "layer" && `Layer ${live.value}`}
          {token.kind === "shadow" && "Surface"}
        </div>
        {token.kind === "duration" && (
          <button
            type="button"
            className="token-motion-button"
            onClick={() => setMoving(!moving)}
          >
            Preview transition
          </button>
        )}
        {token.kind === "spacing" && (
          <span className="token-spacing-label">{live.result || "0px"}</span>
        )}
      </div>
      <dl className="token-values">
        <div>
          <dt>Value</dt>
          <dd>
            <code>{live.value}</code>
          </dd>
        </div>
        {token.kind !== "color" && live.result && live.result !== live.value && (
          <div>
            <dt>{token.kind === "width" ? "Preview width" : "Rendered"}</dt>
            <dd>
              <code>{live.result}</code>
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}

function ColorRoleRow({ token, themeKey, scheme }: {
  token: DesignToken;
  themeKey: string;
  scheme: string;
}) {
  const { sample, live } = useLiveToken(token, themeKey);
  const assignment = scheme === "dark" ? token.dark ?? token.base : token.base;
  return (
    <tr data-token={token.name}>
      <th scope="row"><code>{token.name.slice(2)}</code></th>
      <td><code>{assignment}</code></td>
      <td>
        <div className="token-role-color">
          <div ref={sample} className="token-sample token-role-swatch" style={styleFor(token)} aria-hidden="true" />
          <code className="token-values">{live.value}</code>
        </div>
      </td>
    </tr>
  );
}

function ColorRoleTable({ group, themeKey, scheme }: {
  group: DesignToken["group"];
  themeKey: string;
  scheme: string;
}) {
  return (
    <div className="token-table-scroll" role="region" aria-label={`${group} table`} tabIndex={0}>
      <table className="token-role-table">
        <caption>{group}</caption>
        <thead><tr><th scope="col">Utility</th><th scope="col">Assignment</th><th scope="col">Current color</th></tr></thead>
        <tbody>
          {tokens.filter((token) => token.group === group).map((token) => (
            <ColorRoleRow key={token.name} token={token} themeKey={themeKey} scheme={scheme} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleExamples() {
  return (
    <section className="tokens-role-examples" aria-label="Color roles in use">
      <div className="comal-ui surface-primary text-primary border border-primary">
        <h2>Primary surface</h2>
        <p className="text-secondary">Secondary text</p>
        <p className="text-muted">Muted supporting text</p>
        <code>surface-primary · text-primary · border-primary</code>
      </div>
      <div className="comal-ui surface-secondary text-primary border border-secondary">
        <h2>Secondary surface</h2>
        <p>A separate surface and border assignment.</p>
        <code>surface-secondary · border-secondary</code>
      </div>
      <div className="comal-ui surface-tertiary text-primary border border-secondary">
        <h2>Tertiary surface</h2>
        <p>A separate surface color, independent of accents.</p>
        <code>surface-tertiary · text-primary</code>
      </div>
      <div className="comal-ui surface-inverse text-inverse border border-inverse">
        <h2>Inverse surface</h2>
        <p>Inverse text on an inverse surface.</p>
        <code>surface-inverse · text-inverse</code>
      </div>
    </section>
  );
}

function TypographyTokenRow({ token, themeKey }: { token: DesignToken; themeKey: string }) {
  const { live } = useLiveToken(token, themeKey);
  return (
    <tr>
      <th scope="row"><code>{token.name}</code></th>
      <td><code>{live.value}</code></td>
    </tr>
  );
}

const typographyExamples: Record<(typeof typographyRoles)[keyof typeof typographyRoles], { purpose: string; sample: string }> = {
  display: { purpose: "Hero headlines and large editorial statements.", sample: "Made to be yours." },
  title: { purpose: "Section titles and content headings.", sample: "A shared foundation" },
  body: { purpose: "Paragraphs and primary reading text.", sample: "Build a clear hierarchy with styles that follow your theme." },
  label: { purpose: "Control labels and compact interface text.", sample: "Workspace name" },
  caption: { purpose: "Supporting notes, captions and metadata.", sample: "Your changes are saved automatically." },
  eyebrow: { purpose: "Short introductions above a heading.", sample: "A new chapter" },
};

function TypographyGuide({ themeKey }: { themeKey: string }) {
  const foundations = tokens.filter((token) => token.group === "Typography" && !token.name.startsWith("--type-"));
  return (
    <>
      <nav className="typography-navigation" aria-label="On this page">
        <a href="#typography-use">Choose a style</a>
        <a href="#typography-customize">Customize a style</a>
        <a href="#typography-foundations">Foundation reference</a>
      </nav>
      <section className="tokens-section" id="typography-use" aria-labelledby="typography-use-title">
        <h2 id="typography-use-title">Choose a style</h2>
        <p className="tokens-section-description">Start with a complete role. It sets font family, size, weight, line height and tracking. Add a text color separately; choose HTML elements for their meaning. Margins, uppercase and italics stay explicit.</p>
        <pre className="typography-code"><code>{`<h1 className="text-display text-primary">Made to be yours.</h1>
<p className="text-body text-secondary">A little room to explore.</p>
<p className="text-caption text-muted">A supporting note.</p>`}</code></pre>
        <p className="tokens-section-description">These previews follow the theme and scheme selected in the toolbar. Open a style’s theme tokens to inspect its current values.</p>
        <div className="typography-styles">
          {Object.entries(typographyRoles).map(([utility, role]) => {
            const example = typographyExamples[role];
            return (
              <article key={utility} className="typography-style">
                <header className="typography-style-header">
                  <h3><code>{utility}</code></h3>
                  <p>{example.purpose}</p>
                </header>
                <p className={`typography-style-sample ${utility}`}>{example.sample}</p>
                <details className="typography-details">
                  <summary>Theme tokens for <code>{utility}</code></summary>
                  <table className="typography-token-table" aria-label={`Theme tokens for ${utility}`}>
                    <thead><tr><th scope="col">Token</th><th scope="col">Current value</th></tr></thead>
                    <tbody>
                      {tokens.filter((token) => token.name.startsWith(`--type-${role}-`)).map((token) => (
                        <TypographyTokenRow key={token.name} token={token} themeKey={themeKey} />
                      ))}
                    </tbody>
                  </table>
                </details>
              </article>
            );
          })}
        </div>
      </section>
      <section className="tokens-section" id="typography-customize" aria-labelledby="typography-customize-title">
        <h2 id="typography-customize-title">Customize a style</h2>
        <p className="tokens-section-description">For one element, add an ordinary utility such as <code>text-display font-medium</code>. With a Tailwind 4 build, <code>text-body md:text-title</code> switches roles at a breakpoint. The six unmodified roles also work with Greda’s compiled CSS.</p>
        <p className="tokens-section-description">To change a role throughout a theme, override its tokens on the theme boundary. Each role has <code>family</code>, <code>size</code>, <code>weight</code>, <code>leading</code> and <code>tracking</code> properties.</p>
        <pre className="typography-code"><code>{`[data-theme="brand"] {
  --type-display-size: clamp(2rem, 6vw, 4rem);
  --type-display-weight: 700;
  --type-caption-size: 0.8125rem;
}`}</code></pre>
        <p className="tokens-section-description">Font aliases resolve at theme boundaries. Comal uses DM Sans and Fraunces; Cobalto uses Arial/Helvetica with its own headline sizes and weights. Load custom fonts in your application: a family token does not download a font.</p>
      </section>
      <section className="tokens-section" id="typography-foundations" aria-labelledby="typography-foundations-title">
        <h2 id="typography-foundations-title">Foundation reference</h2>
        <p className="tokens-section-description">These individual tokens support existing component styles and size utilities. A size utility such as <code>text-sm</code> sets size and line height; a role such as <code>text-label</code> supplies the complete style.</p>
        {[
          { title: "Font families", kinds: ["font"] },
          { title: "Size scale", kinds: ["fontSize"] },
          { title: "Weights and line height", kinds: ["weight", "leading"] },
        ].map(({ title, kinds }) => (
          <details className="typography-details typography-foundation" key={title}>
            <summary>{title}</summary>
            <div className="tokens-grid">
              {foundations.filter((token) => kinds.includes(token.kind)).map((token) => (
                <TokenCard key={token.name} token={token} themeKey={themeKey} />
              ))}
            </div>
          </details>
        ))}
      </section>
    </>
  );
}

export function TokenCatalog({ page, theme, scheme }: {
  page: TokenPage;
  theme: string;
  scheme: string;
}) {
  const current = tokenPages.find((item) => item.id === page) ?? tokenPages[0];
  const themeKey = `${theme}:${scheme}`;
  const palette = tokens.filter((token) => token.group === "Palette");
  const neutrals = palette.filter((token) => /--base-(white|black|gray-)/.test(token.name));
  const brandColors = palette.filter((token) => !neutrals.includes(token));
  return (
    <main className="tokens-page">
      <header className="tokens-header">
        <p className="tokens-eyebrow">Design tokens</p>
        <h1>{current.title}</h1>
        <p>{current.description}</p>
        <p className="tokens-theme">{theme === "cobalto" ? "Cobalto" : theme === "comal" ? "Comal" : "Base"} · {scheme === "dark" ? "Dark" : "Light"}</p>
      </header>
      {page === "overview" ? (
        <>
          <section className="tokens-introduction" aria-label="How colors work">
            <h2>Change the base colors. Greda handles the roles.</h2>
            <ol>
              <li><strong>Base colors</strong><span>Override only --base-* colors for your theme.</span></li>
              <li><strong>Color roles</strong><span>Greda assigns the palette to surfaces, text, borders, and actions.</span></li>
              <li><strong>Components</strong><span>Components and utilities use those assignments automatically.</span></li>
            </ol>
            <p>Primary has a separate meaning in each category: surface-primary, text-primary, and border-primary can use different base colors.</p>
          </section>
          <nav className="tokens-page-links" aria-label="Token pages">
            {tokenPages.filter((item) => item.id !== "overview").map((item) => (
              <a key={item.id} href={tokenPageHref(item.id)} target="_top">
                <h2>{item.title}</h2><p>{item.description}</p>
              </a>
            ))}
          </nav>
          <p className="tokens-section-description">Switch theme and scheme in the toolbar on any page. Color customization starts in Base colors; typography, spacing, and other foundations have their own optional tokens.</p>
        </>
      ) : (
        <nav className="tokens-navigation" aria-label="Token pages">
          {tokenPages.map((item) => (
            <a key={item.id} href={tokenPageHref(item.id)} target="_top" aria-current={item.id === page ? "page" : undefined}>{item.title}</a>
          ))}
        </nav>
      )}
      {page === "palette" && (
        <section id="tokens-palette" aria-label="Base colors">
          <p className="tokens-section-description">Override these colors on :root or a data-theme element. The names stay the same across themes; the values below follow the active theme and scheme.</p>
          {[{ title: "Brand & state colors", colors: brandColors }, { title: "Neutrals", colors: neutrals }].map(({ title, colors }) => (
            <section className="tokens-section" key={title}>
              <h2>{title}</h2>
              <div className="tokens-grid tokens-grid--palette">
                {colors.map((token) => <TokenCard key={token.name} token={token} themeKey={themeKey} />)}
              </div>
            </section>
          ))}
        </section>
      )}
      {page === "roles" && (
        <>
          <p className="tokens-section-description">These assignments belong to Greda. Customize the base colors, and the roles update automatically. The tables show the current scheme’s assignment and the active theme’s resolved color.</p>
          <RoleExamples />
          {current.groups.map((group) => <ColorRoleTable key={group} group={group} themeKey={themeKey} scheme={scheme} />)}
        </>
      )}
      {page === "typography" && <TypographyGuide themeKey={themeKey} />}
      {page !== "palette" && page !== "roles" && page !== "typography" && current.groups.map((group) => (
        <section className="tokens-section" key={group}>
          <h2>{group}</h2>
          {group === "Spacing" && <p className="tokens-section-description">The default spacing unit is 4px. For example, --space-4 resolves to 16px at the default root font size. Override --spacing-unit to scale the system, or one --space-* token to change a single step.</p>}
          <div className="tokens-grid">
            {tokens.filter((token) => token.group === group).map((token) => <TokenCard key={token.name} token={token} themeKey={themeKey} />)}
          </div>
        </section>
      ))}
    </main>
  );
}
