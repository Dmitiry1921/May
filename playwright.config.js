import { defineConfig, devices} from '@playwright/test';

export const STATIC_SERVER_HOST = 'localhost';
export const STATIC_SERVER_PORT = 8080;
export const STATIC_SERVER_URL = `http://${STATIC_SERVER_HOST}:${STATIC_SERVER_PORT}`;

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
