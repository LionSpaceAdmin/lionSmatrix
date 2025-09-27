import type { StorybookConfig } from "storybook";

const config: StorybookConfig = {
// eslint.config.mjs
    import js from '@eslint/js';
    import eslintPluginNext from '@next/eslint-plugin-next';
// If you already have other imports, keep them.
// Add this import for Storybook:
    import storybook from 'eslint-plugin-storybook';

    export default [
        js.configs.recommended,
        // ... existing code ...
        {
            plugins: {
                'eslint-plugin-next': eslintPluginNext,
                storybook,
            },
            rules: {
                // your shared project rules here
            },
        },
        // ... existing code ...
        // Scope Storybook lint to Storybook-related files to avoid noise
        {
            files: [
                '.storybook/**/*.{js,jsx,ts,tsx,mjs,cjs}',
                '**/*.stories.@(js|jsx|ts|tsx)',
                '**/*.story.@(js|jsx|ts|tsx)',
            ],
            // Use Storybook's recommended config if available
            rules: {
                ...(storybook?.configs?.recommended?.rules ?? {}),
            },
        },
        // ... existing code ...
    ];  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {}
  }
};

export default config;