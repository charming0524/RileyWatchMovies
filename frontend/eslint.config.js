import tseslint from "typescript-eslint";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default [
  {
    ignores: ["dist/**", "node_modules/**"], // replaces .eslintignore
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    plugins: {
      "react-x": reactX,
      "react-dom": reactDom,
    },
    rules: {
      ...reactX.configs["recommended-typescript"].rules,
      ...reactDom.configs.recommended.rules,

      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
    languageOptions: {
      parserOptions: {
        project: null, // no type-checking for JS configs
      },
    },
  },
];
