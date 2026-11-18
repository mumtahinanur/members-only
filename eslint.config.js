import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: ["node_modules/"],
  },

  // ESLint's recommended rules catch common bugs (undefined variables, etc.)
  js.configs.recommended,

  // Turns off style rules that would clash with Prettier. It also turns off
  // `curly`, so it must come BEFORE our rules below, which turn it back on.
  prettier,

  // Server code runs in Node
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      curly: ["error", "all"], // always use braces, even for one-line if/else
      eqeqeq: "error", // === instead of ==
      // Unused arguments are allowed when they start with _ (e.g. Express's _next)
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },

  // public/js runs in the browser
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: globals.browser,
    },
  },
];
