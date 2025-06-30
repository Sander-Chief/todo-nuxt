import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';
import type { ConfigOptions } from '@nuxt/test-utils/playwright';

export default defineConfig<ConfigOptions>({
  globalSetup: './setup/playwright.setup.ts',
  globalTeardown: './setup/playwright.teardown.ts',
  testDir: './tests/e2e',
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url))
    }
  },
  workers: 1,
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    env: {
      DATABASE_PATH: 'todo-e2e.db'
    }
  },
});
