// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Decorator[expression.callee.name='Injectable'] > CallExpression[arguments.length=1] > ObjectExpression > Property[key.name='providedIn'][value.value='root']",
          message:
            "Are you sure you don't want to just create a provider for this?",
        },
        {
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.property.name='select']",
          message:
            "Use the `selectSignal` method instead of `select` on Store instances. Found .select() call - consider using .selectSignal() for signals.",
        },
      ],
      "@typescript-eslint/consistent-type-definitions": "off",
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
