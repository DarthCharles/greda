import { useEffect, useRef, useState, type CSSProperties } from "react";
import { groups, tokens, type DesignToken, type TokenGroup } from "./catalog";
import "./TokenCatalog.css";

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

function TokenCard({
  token,
  themeKey,
}: {
  token: DesignToken;
  themeKey: string;
}) {
  const sample = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState({ value: token.base, result: "" });
  const [moving, setMoving] = useState(false);
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
  const text = ["font", "fontSize", "weight"].includes(token.kind);
  return (
    <article className="token-card" data-token={token.name}>
      <header className="token-card-header">
        <h3>
          <code>{token.name}</code>
        </h3>
        <p>{token.description}</p>
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
        {live.result && (
          <div>
            <dt>{token.kind === "width" ? "Preview width" : "Rendered"}</dt>
            <dd>
              <code>{live.result}</code>
            </dd>
          </div>
        )}
      </dl>
      {live.value !== token.base && (
        <p className="token-base-value">
          Base: <code>{token.base}</code>
        </p>
      )}
    </article>
  );
}

export function TokenCatalog({
  group,
  themeKey,
}: {
  group?: TokenGroup;
  themeKey: string;
}) {
  const visibleGroups = group ? [group] : groups;
  return (
    <main className="tokens-page">
      <header className="tokens-header">
        <p className="tokens-eyebrow">Design foundations</p>
        <h1>{group ?? "Design tokens"}</h1>
        <p>
          Explore each token’s value and the result it produces. Switch the
          theme or color scheme in the toolbar to see the examples update.
        </p>
      </header>
      {!group && (
        <nav className="tokens-navigation" aria-label="Token categories">
          {groups.map((name) => (
            <a
              key={name}
              href={`#tokens-${name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            >
              {name}
            </a>
          ))}
        </nav>
      )}
      {visibleGroups.map((name) => (
        <section
          className="tokens-section"
          id={`tokens-${name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
          key={name}
        >
          <h2>{name}</h2>
          {name === "Spacing" && (
            <p className="tokens-section-description">
              One spacing scale supplies distances for padding, margin, gap,
              and control dimensions. The default base unit is 4px. For example,{" "}
              <code>--space-4</code> is 16px at the default root font size.
              No overrides are required. Optionally override{" "}
              <code>--spacing-unit</code> on the document root to scale it, or a
              single <code>--space-*</code> token to adjust one step. Use any step
              directly in your CSS, or import the token theme into a Tailwind 4
              app to generate padding, margin, and gap utilities. The precompiled
              component stylesheet includes only the spacing classes used by
              Greda's components.
            </p>
          )}
          <div className="tokens-grid">
            {tokens
              .filter((token) => token.group === name)
              .map((token) => (
                <TokenCard key={token.name} token={token} themeKey={themeKey} />
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
