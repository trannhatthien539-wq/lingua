import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

/**
 * ESLint cho dự án (flat config, không dùng TypeScript).
 * - Rule của React Hooks là lỗi (bắt lỗi hook gọi sai chỗ / thiếu dependency).
 * - Biến không dùng chỉ là cảnh báo để không chặn build.
 *
 * Chạy: npm run lint
 */
export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "functions/**",
      "public/sw.js",
      ".github/**",
      "android/**",
      "scripts/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.node,
        SpeechRecognition: "readonly",
        webkitSpeechRecognition: "readonly",
      },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-useless-escape": "off",
      "no-control-regex": "off",
      "no-cond-assign": ["error", "except-parens"],
    },
  },
  {
    files: ["tests/**/*.js", "vite.config.js", "tailwind.config.js", "postcss.config.js", "eslint.config.js"],
    languageOptions: { globals: { ...globals.node } },
  },
];
