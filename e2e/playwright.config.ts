import path from "node:path";
import { defineConfig } from "@playwright/test";
import { PROJECTS } from "./devices";
import { BASE_URL, EXTRA_PROJECTS } from "./targets";

const REPORT = path.resolve(__dirname, "..", process.env.E2E_REPORT_DIR ?? "e2e-report");
const run = process.env.E2E_RUN ?? "e2e";

export default defineConfig({
  testDir: ".",
  testMatch: /.*\.spec\.ts$/,
  outputDir: path.resolve(__dirname, "..", "test-results", run),
  timeout: 240_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  workers: Number(process.env.E2E_WORKERS ?? 3),
  retries: 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: path.join(REPORT, `html-${run}`), open: "never" }],
    ["json", { outputFile: path.join(REPORT, `results-${run}.json`) }],
  ],
  use: {
    baseURL: BASE_URL,
    locale: "es-SV",
    timezoneId: "America/El_Salvador",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 20_000,
    navigationTimeout: 150_000,
  },
  projects: [...PROJECTS, ...EXTRA_PROJECTS],
});
