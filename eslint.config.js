import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import astro from "eslint-plugin-astro";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    ignores: [
      ".astro/**",
      "dist/**",
      "node_modules/**"
    ]
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest
      }
    }
  },
  {
    files: ["**/*.{ts,tsx,astro}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      }
    }
  },
  {
    files: ["src/env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off"
    }
  }
];

