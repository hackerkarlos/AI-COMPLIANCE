import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 120_000,
  globalTimeout: 300_000,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command:
      'env -u __NEXT_PRIVATE_STANDALONE_CONFIG -u __NEXT_PRIVATE_ORIGIN -u __NEXT_PROCESSED_ENV -u TURBOPACK -u NEXT_DEPLOYMENT_ID -u NODE_ENV next dev --webpack',
    url: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
