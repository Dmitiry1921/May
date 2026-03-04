// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/unit/**'],
  retries: 1,           // retry once — python server can crash under heavy load
  timeout: 600_000,       // каждый тест до 10 минут (реальный геймплей)
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    headless: true,  // always headless to not interfere with user
    viewport: { width: 1280, height: 704 },
    baseURL: 'http://localhost:8080',
    video: 'on',          // записываем видео прохождения
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npx vite --port 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
