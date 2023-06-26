import { defineConfig, devices} from '@playwright/test';

export default defineConfig({
  workers: process.env.CI ? 3 : undefined,
  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run static-server',
    url: 'http://localhost:3000',
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
