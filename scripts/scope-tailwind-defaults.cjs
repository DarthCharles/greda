// Tailwind's variable initializers are emitted even with preflight disabled.
// Limit them to library elements so importing our CSS cannot reset a consumer's
// layered utilities. Keep this transform shared by the package and Storybook.
module.exports = function scopeTailwindDefaults() {
  const selectors = new Map([
    ["*", ":where(.comal-ui)"],
    ["::before", ":where(.comal-ui)::before"],
    [":before", ":where(.comal-ui)::before"],
    ["::after", ":where(.comal-ui)::after"],
    [":after", ":where(.comal-ui)::after"],
    ["::backdrop", ":where(.comal-ui)::backdrop"],
  ]);
  return {
    postcssPlugin: "comal-scope-tailwind-defaults",
    OnceExit(root) {
      root.walkRules((rule) => {
        if (!rule.selectors.every((selector) => selectors.has(selector.trim())))
          return;
        const declarations = rule.nodes.filter((node) => node.type === "decl");
        if (
          !declarations.length ||
          !declarations.every((node) => node.prop.startsWith("--tw-"))
        )
          return;
        rule.selector = rule.selectors
          .map((selector) => selectors.get(selector.trim()))
          .join(",");
      });
    },
  };
};
