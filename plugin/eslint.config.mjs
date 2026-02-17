// eslint.config.mjs
import tsparser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
  ...obsidianmd.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: { project: "./tsconfig.json" },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
      },
    },
    rules: {
      // Configure sentence case with our brand names
      "obsidianmd/ui/sentence-case": [
        "error",
        {
          brands: ["LoudThoughts", "AudioPen", "Voicenotes", "Alfie", "Obsidian", "GitHub", "README", "Tasks", "Linux", "Unix", "Mac", "Windows", "Markdown"],
          acronyms: ["ID", "H2", "URL", "API"],
        },
      ],
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "templates/**", "*.js", "*.mjs", "*.cjs"],
  },
]);
