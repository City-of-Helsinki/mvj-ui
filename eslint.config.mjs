import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: { version: "detect" }
    },
    languageOptions: { globals: globals.browser },
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-deprecated": "error",
      "react/no-find-dom-node": "error",
      "react/no-string-refs": "error",
      "react/no-unsafe": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-case-declarations": "warn",
      "no-fallthrough": "off",
      "no-var": "warn",
      "prefer-const": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-undef": "off",
      "@typescript-eslint/no-console": "off",
      "@typescript-eslint/no-restricted-globals": "off",
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/no-var": "off",
      "@typescript-eslint/no-empty": "off",
      "@typescript-eslint/no-func-assign": "off",
      "@typescript-eslint/no-duplicate-imports": "off",
      
      "@typescript-eslint/no-unsafe-function-type": "off"
    }
  }
];
