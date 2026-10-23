import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Design reference from the handoff: vendor scripts that only render the HTML mock-up.
    "design_handoff_archilab_sito/**",
    // Local wireframes (git-ignored): same kind of vendor scripts.
    "Archilab website wireframes/**",
  ]),
]);

export default eslintConfig;
