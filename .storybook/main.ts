import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  staticDirs: [
    { from: '../temp-home/assets', to: '/assets' },
    { from: '../favicon.svg', to: '/favicon.svg' },
  ],
};

export default config;
