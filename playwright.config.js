import { defineConfig, devices} from '@playwright/test';

import {STATIC_SERVER_PORT, STATIC_SERVER_URL} from "./server/config.js";

export default defineConfig({
  workers: process.env.CI ? 3 : undefined,
  // Run your local dev server before starting the tests
  webServer: {
    command: `npm run static-server ${STATIC_SERVER_PORT}`,
    url: STATIC_SERVER_URL,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  testMatch: '*tests/playwright/*.spec.js',
});
