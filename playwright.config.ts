import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';
import type { ConfigOptions } from '@nuxt/test-utils/playwright';

export default defineConfig<ConfigOptions>({
  globalSetup: './setup/playwright.setup.ts',
  testDir: './tests/e2e',
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url))
    }
  },
  workers: 1,
});
