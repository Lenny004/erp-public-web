// Lighthouse CI · perfil mobile. URLs en ./urls.json (cambian por repo).
const path = require("node:path");
const { base, paths } = require("./urls.json");
const BASE = process.env.LH_BASE_URL || base;

module.exports = {
  ci: {
    collect: {
      url: paths.map((p) => new URL(p, BASE).toString()),
      numberOfRuns: Number(process.env.LH_RUNS || 1),
      settings: {
        
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        chromeFlags: "--headless=new --no-sandbox --disable-dev-shm-usage",
        maxWaitForLoad: 120000,
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: path.resolve(__dirname, "..", "..", "e2e-report", "lighthouse", "mobile"),
    },
  },
};
